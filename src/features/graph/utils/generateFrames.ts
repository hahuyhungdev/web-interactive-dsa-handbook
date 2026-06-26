// ─── Types ────────────────────────────────────────────────────────────────────

export interface GraphNode {
  id: string;
  label: string;
  x: number; // 0-100 position
  y: number; // 0-100 position
  status: 'default' | 'visiting' | 'visited' | 'queued' | 'current';
}

export interface GraphEdge {
  from: string;
  to: string;
  status: 'default' | 'traversed' | 'active';
}

export interface GraphFrame {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightedMarker: string;
  message: string;
  dataStructure: { label: string; items: string[] };
}

// ─── Default Graph ────────────────────────────────────────────────────────────

const DEFAULT_NODES: Omit<GraphNode, 'status'>[] = [
  { id: 'A', label: 'A', x: 50, y: 8 },
  { id: 'B', label: 'B', x: 25, y: 35 },
  { id: 'C', label: 'C', x: 75, y: 35 },
  { id: 'D', label: 'D', x: 12, y: 65 },
  { id: 'E', label: 'E', x: 38, y: 65 },
  { id: 'F', label: 'F', x: 62, y: 65 },
  { id: 'G', label: 'G', x: 88, y: 65 },
];

const DEFAULT_EDGES: [string, string][] = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'F'],
  ['C', 'G'],
  ['B', 'C'],
  ['D', 'E'],
];

export function buildDefaultGraph() {
  const nodes: GraphNode[] = DEFAULT_NODES.map((n) => ({
    ...n,
    status: 'default' as const,
  }));

  const edges: GraphEdge[] = DEFAULT_EDGES.map(([from, to]) => ({
    from,
    to,
    status: 'default' as const,
  }));

  const adjacency: Record<string, string[]> = {};
  for (const n of nodes) {
    adjacency[n.id] = [];
  }
  for (const [a, b] of DEFAULT_EDGES) {
    adjacency[a].push(b);
    adjacency[b].push(a);
  }

  return { nodes, edges, adjacency };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cloneNodes(nodes: GraphNode[]): GraphNode[] {
  return nodes.map((n) => ({ ...n }));
}

function cloneEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.map((e) => ({ ...e }));
}

function setNodeStatus(nodes: GraphNode[], id: string, status: GraphNode['status']) {
  const node = nodes.find((n) => n.id === id);
  if (node) node.status = status;
}

function setEdgeStatus(edges: GraphEdge[], from: string, to: string, status: GraphEdge['status']) {
  const edge = edges.find(
    (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from),
  );
  if (edge) edge.status = status;
}

function makeFrame(
  nodes: GraphNode[],
  edges: GraphEdge[],
  marker: string,
  message: string,
  dsLabel: string,
  dsItems: string[],
): GraphFrame {
  return {
    nodes: cloneNodes(nodes),
    edges: cloneEdges(edges),
    highlightedMarker: marker,
    message,
    dataStructure: { label: dsLabel, items: [...dsItems] },
  };
}

// ─── BFS Frame Generation ────────────────────────────────────────────────────

export function generateBFSFrames(
  initNodes: GraphNode[],
  initEdges: GraphEdge[],
  adjacency: Record<string, string[]>,
  startId: string,
): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const nodes = cloneNodes(initNodes);
  const edges = cloneEdges(initEdges);

  const visited = new Set<string>();
  const queue: string[] = [];

  // Frame: init
  frames.push(makeFrame(nodes, edges, '@init', `Initializing BFS from node ${startId}`, 'Queue', []));

  // Enqueue start
  queue.push(startId);
  setNodeStatus(nodes, startId, 'queued');
  frames.push(
    makeFrame(nodes, edges, '@enqueue', `Enqueue start node ${startId}`, 'Queue', [...queue]),
  );

  while (queue.length > 0) {
    const current = queue.shift()!;

    // Frame: dequeue
    setNodeStatus(nodes, current, 'current');
    frames.push(
      makeFrame(nodes, edges, '@dequeue', `Dequeue node ${current}`, 'Queue', [...queue]),
    );

    if (visited.has(current)) {
      setNodeStatus(nodes, current, 'visited');
      continue;
    }

    // Frame: visit
    setNodeStatus(nodes, current, 'visiting');
    frames.push(
      makeFrame(nodes, edges, '@visit', `Visit node ${current}`, 'Queue', [...queue]),
    );

    // Frame: mark visited
    visited.add(current);
    setNodeStatus(nodes, current, 'visited');
    frames.push(
      makeFrame(nodes, edges, '@mark-visited', `Mark ${current} as visited`, 'Queue', [...queue]),
    );

    // Process neighbors
    const neighbors = adjacency[current] || [];
    for (const nb of neighbors) {
      // Frame: check neighbor
      setEdgeStatus(edges, current, nb, 'active');
      frames.push(
        makeFrame(
          nodes,
          edges,
          '@check-neighbor',
          `Check neighbor ${nb} of ${current}`,
          'Queue',
          [...queue],
        ),
      );

      if (!visited.has(nb) && !queue.includes(nb)) {
        // Frame: enqueue
        queue.push(nb);
        setNodeStatus(nodes, nb, 'queued');
        frames.push(
          makeFrame(nodes, edges, '@enqueue', `Enqueue neighbor ${nb}`, 'Queue', [...queue]),
        );
      }

      setEdgeStatus(edges, current, nb, 'traversed');
    }
  }

  // Frame: done
  frames.push(makeFrame(nodes, edges, '@done', 'BFS traversal complete!', 'Queue', []));

  return frames;
}

// ─── DFS Frame Generation ────────────────────────────────────────────────────

export function generateDFSFrames(
  initNodes: GraphNode[],
  initEdges: GraphEdge[],
  adjacency: Record<string, string[]>,
  startId: string,
): GraphFrame[] {
  const frames: GraphFrame[] = [];
  const nodes = cloneNodes(initNodes);
  const edges = cloneEdges(initEdges);

  const visited = new Set<string>();
  const stack: string[] = [];

  // Frame: init
  frames.push(makeFrame(nodes, edges, '@init', `Initializing DFS from node ${startId}`, 'Stack', []));

  // Push start
  stack.push(startId);
  setNodeStatus(nodes, startId, 'queued');
  frames.push(
    makeFrame(nodes, edges, '@push', `Push start node ${startId}`, 'Stack', [...stack]),
  );

  while (stack.length > 0) {
    const current = stack.pop()!;

    // Frame: pop
    setNodeStatus(nodes, current, 'current');
    frames.push(
      makeFrame(nodes, edges, '@pop', `Pop node ${current}`, 'Stack', [...stack]),
    );

    if (visited.has(current)) {
      setNodeStatus(nodes, current, 'visited');
      continue;
    }

    // Frame: visit
    setNodeStatus(nodes, current, 'visiting');
    frames.push(
      makeFrame(nodes, edges, '@visit', `Visit node ${current}`, 'Stack', [...stack]),
    );

    // Frame: mark visited
    visited.add(current);
    setNodeStatus(nodes, current, 'visited');
    frames.push(
      makeFrame(nodes, edges, '@mark-visited', `Mark ${current} as visited`, 'Stack', [...stack]),
    );

    // Process neighbors
    const neighbors = adjacency[current] || [];
    for (const nb of neighbors) {
      // Frame: check neighbor
      setEdgeStatus(edges, current, nb, 'active');
      frames.push(
        makeFrame(
          nodes,
          edges,
          '@check-neighbor',
          `Check neighbor ${nb} of ${current}`,
          'Stack',
          [...stack],
        ),
      );

      if (!visited.has(nb)) {
        // Frame: push
        stack.push(nb);
        setNodeStatus(nodes, nb, 'queued');
        frames.push(
          makeFrame(nodes, edges, '@push', `Push neighbor ${nb}`, 'Stack', [...stack]),
        );
      }

      setEdgeStatus(edges, current, nb, 'traversed');
    }
  }

  // Frame: done
  frames.push(makeFrame(nodes, edges, '@done', 'DFS traversal complete!', 'Stack', []));

  return frames;
}
