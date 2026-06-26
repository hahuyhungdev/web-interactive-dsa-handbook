// ── Types ──────────────────────────────────────────────────────────────────────

export interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  status: 'default' | 'visiting' | 'visited' | 'inserted' | 'found' | 'comparing';
  x: number; // normalized 0-1 for SVG positioning
  y: number; // level (0, 1, 2...)
}

export interface TreeFrame {
  nodes: TreeNode[];
  edges: { from: string; to: string; status: 'default' | 'active' }[];
  highlightedMarker: string;
  message: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

let _nextId = 0;
function makeId(): string {
  return `node-${_nextId++}`;
}

/** Deep-clone nodes so each frame is an independent snapshot. */
function cloneNodes(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({ ...n }));
}

function findNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  return nodes.find((n) => n.id === id);
}

function findNodeByValue(nodes: TreeNode[], value: number): TreeNode | undefined {
  return nodes.find((n) => n.value === value);
}

function findRoot(nodes: TreeNode[]): TreeNode | undefined {
  // The root is the node that is not referenced as a child by any other node.
  const childIds = new Set<string>();
  for (const n of nodes) {
    if (n.left) childIds.add(n.left);
    if (n.right) childIds.add(n.right);
  }
  return nodes.find((n) => !childIds.has(n.id));
}

function resetStatuses(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((n) => ({ ...n, status: 'default' as const }));
}

// ── Position calculation ───────────────────────────────────────────────────────

const LEVEL_OFFSETS = [0.25, 0.125, 0.0625, 0.03125, 0.015625, 0.0078125];

function getOffset(level: number): number {
  return level < LEVEL_OFFSETS.length
    ? LEVEL_OFFSETS[level]
    : 0.0078125 / Math.pow(2, level - LEVEL_OFFSETS.length + 1);
}

/**
 * Recursively assign (x, y) positions to all nodes in the tree.
 * Root is at (0.5, 0). Each child offsets x by ±getOffset(parentLevel).
 */
function assignPositions(
  nodes: TreeNode[],
  nodeId: string | null,
  x: number,
  y: number,
): void {
  if (!nodeId) return;
  const node = findNode(nodes, nodeId);
  if (!node) return;
  node.x = x;
  node.y = y;
  const offset = getOffset(y);
  assignPositions(nodes, node.left, x - offset, y + 1);
  assignPositions(nodes, node.right, x + offset, y + 1);
}

// ── buildDefaultBST ────────────────────────────────────────────────────────────

/**
 * Build a BST with values [50, 30, 70, 20, 40, 60, 80] and pre-computed positions.
 */
export function buildDefaultBST(): TreeNode[] {
  _nextId = 0;

  // Create nodes
  const n50: TreeNode = { id: makeId(), value: 50, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n30: TreeNode = { id: makeId(), value: 30, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n70: TreeNode = { id: makeId(), value: 70, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n20: TreeNode = { id: makeId(), value: 20, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n40: TreeNode = { id: makeId(), value: 40, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n60: TreeNode = { id: makeId(), value: 60, left: null, right: null, status: 'default', x: 0, y: 0 };
  const n80: TreeNode = { id: makeId(), value: 80, left: null, right: null, status: 'default', x: 0, y: 0 };

  // Wire up parent-child relationships
  n50.left = n30.id;
  n50.right = n70.id;
  n30.left = n20.id;
  n30.right = n40.id;
  n70.left = n60.id;
  n70.right = n80.id;

  const nodes = [n50, n30, n70, n20, n40, n60, n80];

  // Assign positions
  assignPositions(nodes, n50.id, 0.5, 0);

  return nodes;
}

// ── getEdges ───────────────────────────────────────────────────────────────────

export function getEdges(
  nodes: TreeNode[],
  activeEdges?: Set<string>,
): TreeFrame['edges'] {
  const edges: TreeFrame['edges'] = [];
  for (const node of nodes) {
    if (node.left) {
      const key = `${node.id}->${node.left}`;
      edges.push({
        from: node.id,
        to: node.left,
        status: activeEdges?.has(key) ? 'active' : 'default',
      });
    }
    if (node.right) {
      const key = `${node.id}->${node.right}`;
      edges.push({
        from: node.id,
        to: node.right,
        status: activeEdges?.has(key) ? 'active' : 'default',
      });
    }
  }
  return edges;
}

// ── Frame builder helper ───────────────────────────────────────────────────────

function makeFrame(
  nodes: TreeNode[],
  marker: string,
  message: string,
  activeEdges?: Set<string>,
): TreeFrame {
  return {
    nodes: cloneNodes(nodes),
    edges: getEdges(nodes, activeEdges),
    highlightedMarker: marker,
    message,
  };
}

// ── generateInsertFrames ───────────────────────────────────────────────────────

export function generateInsertFrames(nodes: TreeNode[], value: number): TreeFrame[] {
  const frames: TreeFrame[] = [];
  const working = cloneNodes(resetStatuses(nodes));
  const root = findRoot(working);
  const activeEdges = new Set<string>();

  // Initial frame
  frames.push(makeFrame(working, '@init', `Inserting ${value} into the BST.`));

  if (!root) {
    // Empty tree — insert as root
    const newNode: TreeNode = {
      id: `node-${working.length}`,
      value,
      left: null,
      right: null,
      status: 'inserted',
      x: 0.5,
      y: 0,
    };
    working.push(newNode);
    frames.push(makeFrame(working, '@insert', `Tree was empty. Inserted ${value} as root.`));
    return frames;
  }

  let current: TreeNode | undefined = root;

  while (current) {
    current.status = 'comparing';
    frames.push(
      makeFrame(working, '@init', `Compare ${value} with node ${current.value}.`, activeEdges),
    );

    if (value < current.value) {
      current.status = 'visited';
      if (current.left) {
        activeEdges.add(`${current.id}->${current.left}`);
        frames.push(
          makeFrame(
            working,
            '@compare-left',
            `${value} < ${current.value} — go left.`,
            activeEdges,
          ),
        );
        current = findNode(working, current.left);
      } else {
        // Insert here
        const parentLevel = current.y;
        const offset = getOffset(parentLevel);
        const newNode: TreeNode = {
          id: `node-${working.length}`,
          value,
          left: null,
          right: null,
          status: 'inserted',
          x: current.x - offset,
          y: parentLevel + 1,
        };
        current.left = newNode.id;
        working.push(newNode);
        activeEdges.add(`${current.id}->${newNode.id}`);
        frames.push(
          makeFrame(
            working,
            '@insert',
            `${value} < ${current.value} — inserted as left child.`,
            activeEdges,
          ),
        );
        current = undefined;
      }
    } else if (value > current.value) {
      current.status = 'visited';
      if (current.right) {
        activeEdges.add(`${current.id}->${current.right}`);
        frames.push(
          makeFrame(
            working,
            '@compare-right',
            `${value} > ${current.value} — go right.`,
            activeEdges,
          ),
        );
        current = findNode(working, current.right);
      } else {
        // Insert here
        const parentLevel = current.y;
        const offset = getOffset(parentLevel);
        const newNode: TreeNode = {
          id: `node-${working.length}`,
          value,
          left: null,
          right: null,
          status: 'inserted',
          x: current.x + offset,
          y: parentLevel + 1,
        };
        current.right = newNode.id;
        working.push(newNode);
        activeEdges.add(`${current.id}->${newNode.id}`);
        frames.push(
          makeFrame(
            working,
            '@insert',
            `${value} > ${current.value} — inserted as right child.`,
            activeEdges,
          ),
        );
        current = undefined;
      }
    } else {
      // Duplicate
      current.status = 'found';
      frames.push(
        makeFrame(
          working,
          '@found',
          `Value ${value} already exists in the BST.`,
          activeEdges,
        ),
      );
      current = undefined;
    }
  }

  return frames;
}

// ── generateSearchFrames ───────────────────────────────────────────────────────

export function generateSearchFrames(nodes: TreeNode[], target: number): TreeFrame[] {
  const frames: TreeFrame[] = [];
  const working = cloneNodes(resetStatuses(nodes));
  const root = findRoot(working);
  const activeEdges = new Set<string>();

  frames.push(makeFrame(working, '@init', `Searching for ${target} in the BST.`));

  if (!root) {
    frames.push(makeFrame(working, '@not-found', `Tree is empty. ${target} not found.`));
    return frames;
  }

  let current: TreeNode | undefined = root;

  while (current) {
    current.status = 'comparing';
    frames.push(
      makeFrame(working, '@init', `Compare ${target} with node ${current.value}.`, activeEdges),
    );

    if (target === current.value) {
      current.status = 'found';
      frames.push(
        makeFrame(working, '@found', `Found ${target}!`, activeEdges),
      );
      return frames;
    } else if (target < current.value) {
      current.status = 'visited';
      if (current.left) {
        activeEdges.add(`${current.id}->${current.left}`);
        frames.push(
          makeFrame(
            working,
            '@compare-left',
            `${target} < ${current.value} — go left.`,
            activeEdges,
          ),
        );
        current = findNode(working, current.left);
      } else {
        frames.push(
          makeFrame(
            working,
            '@not-found',
            `${target} < ${current.value} — no left child. ${target} not found.`,
            activeEdges,
          ),
        );
        return frames;
      }
    } else {
      current.status = 'visited';
      if (current.right) {
        activeEdges.add(`${current.id}->${current.right}`);
        frames.push(
          makeFrame(
            working,
            '@compare-right',
            `${target} > ${current.value} — go right.`,
            activeEdges,
          ),
        );
        current = findNode(working, current.right);
      } else {
        frames.push(
          makeFrame(
            working,
            '@not-found',
            `${target} > ${current.value} — no right child. ${target} not found.`,
            activeEdges,
          ),
        );
        return frames;
      }
    }
  }

  return frames;
}

// ── Traversal helpers ──────────────────────────────────────────────────────────

function traverseInorder(
  working: TreeNode[],
  nodeId: string | null,
  frames: TreeFrame[],
  activeEdges: Set<string>,
  result: number[],
): void {
  if (!nodeId) return;
  const node = findNode(working, nodeId);
  if (!node) return;

  // Go left
  if (node.left) {
    node.status = 'comparing';
    activeEdges.add(`${node.id}->${node.left}`);
    frames.push(
      makeFrame(working, '@go-left', `At ${node.value} — traverse left subtree.`, activeEdges),
    );
    traverseInorder(working, node.left, frames, activeEdges, result);
  }

  // Visit
  node.status = 'visiting';
  frames.push(
    makeFrame(working, '@visit', `Visit node ${node.value}. Order: [${[...result, node.value].join(', ')}]`, activeEdges),
  );
  result.push(node.value);
  node.status = 'visited';

  // Go right
  if (node.right) {
    activeEdges.add(`${node.id}->${node.right}`);
    frames.push(
      makeFrame(working, '@go-right', `At ${node.value} — traverse right subtree.`, activeEdges),
    );
    traverseInorder(working, node.right, frames, activeEdges, result);
  }

  // Return
  frames.push(
    makeFrame(working, '@return', `Done with subtree rooted at ${node.value}.`, activeEdges),
  );
}

function traversePreorder(
  working: TreeNode[],
  nodeId: string | null,
  frames: TreeFrame[],
  activeEdges: Set<string>,
  result: number[],
): void {
  if (!nodeId) return;
  const node = findNode(working, nodeId);
  if (!node) return;

  // Visit first
  node.status = 'visiting';
  result.push(node.value);
  frames.push(
    makeFrame(working, '@visit', `Visit node ${node.value}. Order: [${result.join(', ')}]`, activeEdges),
  );
  node.status = 'visited';

  // Go left
  if (node.left) {
    activeEdges.add(`${node.id}->${node.left}`);
    frames.push(
      makeFrame(working, '@go-left', `At ${node.value} — traverse left subtree.`, activeEdges),
    );
    traversePreorder(working, node.left, frames, activeEdges, result);
  }

  // Go right
  if (node.right) {
    activeEdges.add(`${node.id}->${node.right}`);
    frames.push(
      makeFrame(working, '@go-right', `At ${node.value} — traverse right subtree.`, activeEdges),
    );
    traversePreorder(working, node.right, frames, activeEdges, result);
  }

  // Return
  frames.push(
    makeFrame(working, '@return', `Done with subtree rooted at ${node.value}.`, activeEdges),
  );
}

function traversePostorder(
  working: TreeNode[],
  nodeId: string | null,
  frames: TreeFrame[],
  activeEdges: Set<string>,
  result: number[],
): void {
  if (!nodeId) return;
  const node = findNode(working, nodeId);
  if (!node) return;

  node.status = 'comparing';

  // Go left
  if (node.left) {
    activeEdges.add(`${node.id}->${node.left}`);
    frames.push(
      makeFrame(working, '@go-left', `At ${node.value} — traverse left subtree.`, activeEdges),
    );
    traversePostorder(working, node.left, frames, activeEdges, result);
  }

  // Go right
  if (node.right) {
    activeEdges.add(`${node.id}->${node.right}`);
    frames.push(
      makeFrame(working, '@go-right', `At ${node.value} — traverse right subtree.`, activeEdges),
    );
    traversePostorder(working, node.right, frames, activeEdges, result);
  }

  // Visit last
  node.status = 'visiting';
  result.push(node.value);
  frames.push(
    makeFrame(working, '@visit', `Visit node ${node.value}. Order: [${result.join(', ')}]`, activeEdges),
  );
  node.status = 'visited';

  // Return
  frames.push(
    makeFrame(working, '@return', `Done with subtree rooted at ${node.value}.`, activeEdges),
  );
}

// ── Public traversal frame generators ──────────────────────────────────────────

export function generateInorderFrames(nodes: TreeNode[]): TreeFrame[] {
  const frames: TreeFrame[] = [];
  const working = cloneNodes(resetStatuses(nodes));
  const root = findRoot(working);
  const activeEdges = new Set<string>();
  const result: number[] = [];

  frames.push(makeFrame(working, '@init', 'Starting in-order traversal (Left → Visit → Right).'));

  if (root) {
    traverseInorder(working, root.id, frames, activeEdges, result);
  }

  frames.push(
    makeFrame(working, '@return', `In-order traversal complete: [${result.join(', ')}]`, activeEdges),
  );

  return frames;
}

export function generatePreorderFrames(nodes: TreeNode[]): TreeFrame[] {
  const frames: TreeFrame[] = [];
  const working = cloneNodes(resetStatuses(nodes));
  const root = findRoot(working);
  const activeEdges = new Set<string>();
  const result: number[] = [];

  frames.push(makeFrame(working, '@init', 'Starting pre-order traversal (Visit → Left → Right).'));

  if (root) {
    traversePreorder(working, root.id, frames, activeEdges, result);
  }

  frames.push(
    makeFrame(working, '@return', `Pre-order traversal complete: [${result.join(', ')}]`, activeEdges),
  );

  return frames;
}

export function generatePostorderFrames(nodes: TreeNode[]): TreeFrame[] {
  const frames: TreeFrame[] = [];
  const working = cloneNodes(resetStatuses(nodes));
  const root = findRoot(working);
  const activeEdges = new Set<string>();
  const result: number[] = [];

  frames.push(makeFrame(working, '@init', 'Starting post-order traversal (Left → Right → Visit).'));

  if (root) {
    traversePostorder(working, root.id, frames, activeEdges, result);
  }

  frames.push(
    makeFrame(working, '@return', `Post-order traversal complete: [${result.join(', ')}]`, activeEdges),
  );

  return frames;
}
