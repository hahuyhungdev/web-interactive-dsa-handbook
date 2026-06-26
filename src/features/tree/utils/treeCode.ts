// ── BST Insert ─────────────────────────────────────────────────────────────────

export const BST_INSERT_CODE: string[] = [
  'function insert(root, value) {',
  '  if (root === null) { // @init',
  '    return new Node(value); // @insert',
  '  }',
  '  if (value < root.value) { // @compare-left',
  '    root.left = insert(root.left, value);',
  '  } else if (value > root.value) { // @compare-right',
  '    root.right = insert(root.right, value);',
  '  }',
  '  // value already exists // @found',
  '  return root;',
  '}',
];

// ── BST Search ─────────────────────────────────────────────────────────────────

export const BST_SEARCH_CODE: string[] = [
  'function search(root, target) {',
  '  if (root === null) { // @not-found',
  '    return null;',
  '  }',
  '  if (target === root.value) { // @found',
  '    return root;',
  '  }',
  '  if (target < root.value) { // @compare-left',
  '    return search(root.left, target);',
  '  } else { // @compare-right',
  '    return search(root.right, target);',
  '  }',
  '}',
];

// ── Inorder Traversal ──────────────────────────────────────────────────────────

export const BST_INORDER_CODE: string[] = [
  'function inorder(node) {',
  '  if (node === null) return; // @init',
  '  inorder(node.left); // @go-left',
  '  visit(node); // @visit',
  '  inorder(node.right); // @go-right',
  '  // return to parent // @return',
  '}',
];

// ── Preorder Traversal ─────────────────────────────────────────────────────────

export const BST_PREORDER_CODE: string[] = [
  'function preorder(node) {',
  '  if (node === null) return; // @init',
  '  visit(node); // @visit',
  '  preorder(node.left); // @go-left',
  '  preorder(node.right); // @go-right',
  '  // return to parent // @return',
  '}',
];

// ── Postorder Traversal ────────────────────────────────────────────────────────

export const BST_POSTORDER_CODE: string[] = [
  'function postorder(node) {',
  '  if (node === null) return; // @init',
  '  postorder(node.left); // @go-left',
  '  postorder(node.right); // @go-right',
  '  visit(node); // @visit',
  '  // return to parent // @return',
  '}',
];
