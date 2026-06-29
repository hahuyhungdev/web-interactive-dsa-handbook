/**
 * Route constants — single source of truth for all paths.
 * Eliminates magic strings across the codebase.
 */
export const ROUTES = {
  HOME: "/",
  CHAPTERS: "/chapters",
  SORTING: "/sorting",
  /** Deep-link to a specific sort algorithm tab. */
  SORTING_ALGO: (algoId: string) => `/sorting?algo=${algoId}`,
  LINKED_LIST: "/linked-list",
  STACK_QUEUE: "/stack-queue",
  TREE: "/tree",
  HASH_TABLE: "/hash-table",
  GRAPH: "/graph",
  SEARCH: "/search",
  THEORY: (lessonId: string) => `/theory/${lessonId}`,
  PRACTICE: (challengeId: string) => `/practice/${challengeId}`,
  PRACTICE_ROOT: "/practice",
} as const;

/**
 * Lesson title → route path mapping.
 * Used by sidebar navigation and URL sync.
 */
export const LESSON_ROUTE_MAP: Record<string, string> = {
  "Bubble Sort Visualizer": ROUTES.SORTING_ALGO("bubble"),
  "Selection Sort Visualizer": ROUTES.SORTING_ALGO("selection"),
  "Insertion Sort Visualizer": ROUTES.SORTING_ALGO("insertion"),
  "Quick Sort Visualizer": ROUTES.SORTING_ALGO("quick"),
  "Merge Sort Visualizer": ROUTES.SORTING_ALGO("merge"),
  "Singly Linked List Visualizer": ROUTES.LINKED_LIST,
  "Linear Search & Binary Search": ROUTES.SEARCH,
  "The Contiguous Memory Model": ROUTES.THEORY("contiguous-memory"),
  "Sorting Taxonomy & Complexity": ROUTES.THEORY("sorting-taxonomy"),
  "Nodes, Pointers & References": ROUTES.THEORY("pointers-references"),
  "Challenge: Two Sum": ROUTES.PRACTICE("two-sum"),
  "Challenge: Max Value in Array": ROUTES.PRACTICE("find-max"),
  "Challenge: Reverse Linked List": ROUTES.PRACTICE("reverse-list"),
  "Challenge: Binary Search": ROUTES.PRACTICE("binary-search"),
  "Challenge: Valid Parentheses": ROUTES.PRACTICE("valid-parentheses"),

  // New visualizers
  "Stack & Queue Visualizer": ROUTES.STACK_QUEUE,
  "Binary Search Tree Visualizer": ROUTES.TREE,
  "Hash Table Visualizer": ROUTES.HASH_TABLE,
  "Graph Traversal Visualizer": ROUTES.GRAPH,

  // New theory lessons
  "Stack & Queue Fundamentals": ROUTES.THEORY("stack-queue-intro"),
  "Binary Search Tree Fundamentals": ROUTES.THEORY("bst-intro"),
  "Hash Table Fundamentals": ROUTES.THEORY("hash-table-intro"),
  "Graph Representation & Traversals": ROUTES.THEORY("graph-intro"),
};

/**
 * Route path → lesson title mapping (reverse lookup).
 * Used by LessonSync to set activeLesson from URL.
 */
export const ROUTE_LESSON_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(LESSON_ROUTE_MAP).map(([lesson, route]) => [route, lesson]),
);
