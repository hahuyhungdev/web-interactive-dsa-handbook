/**
 * Route constants — single source of truth for all paths.
 * Eliminates magic strings across the codebase.
 */
export const ROUTES = {
  HOME: "/",
  CHAPTERS: "/chapters",
  SORTING: "/chapters/sorting",
  /** Deep-link to a specific sort algorithm tab. */
  SORTING_ALGO: (algoId: string) => `/chapters/sorting?algo=${algoId}`,
  LINKED_LIST: "/chapters/linked-lists",
  STACK_QUEUE: "/chapters/stack-queue",
  TREE: "/chapters/tree",
  HASH_TABLE: "/chapters/hash-table",
  GRAPH: "/chapters/graph",
  SEARCH: "/chapters/arrays",
  THEORY: (chapterId: string, lessonId: string) => `/chapters/${chapterId}/theory/${lessonId}`,
  PRACTICE: (chapterId: string, challengeId: string) => `/chapters/${chapterId}/practice/${challengeId}`,
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
  "The Contiguous Memory Model": ROUTES.THEORY("arrays", "contiguous-memory"),
  "Sorting Taxonomy & Complexity": ROUTES.THEORY("sorting", "sorting-taxonomy"),
  "Nodes, Pointers & References": ROUTES.THEORY("linked-lists", "pointers-references"),
  "Challenge: Two Sum": ROUTES.PRACTICE("arrays", "two-sum"),
  "Challenge: Max Value in Array": ROUTES.PRACTICE("sorting", "find-max"),
  "Challenge: Reverse Linked List": ROUTES.PRACTICE("linked-lists", "reverse-list"),
  "Challenge: Binary Search": ROUTES.PRACTICE("arrays", "binary-search"),
  "Challenge: Valid Parentheses": ROUTES.PRACTICE("stack-queue", "valid-parentheses"),
  "Challenge: Implement Queue using Stacks": ROUTES.PRACTICE("stack-queue", "queue-using-stacks"),
  "Challenge: Min Stack": ROUTES.PRACTICE("stack-queue", "min-stack"),
  "Challenge: Evaluate Reverse Polish Notation": ROUTES.PRACTICE("stack-queue", "evaluate-rpn"),
  "Challenge: Next Greater Element I": ROUTES.PRACTICE("stack-queue", "next-greater-element"),
  "Challenge: Remove Duplicates": ROUTES.PRACTICE("arrays", "remove-duplicates"),
  "Challenge: Merge Sorted Array": ROUTES.PRACTICE("arrays", "merge-sorted-array"),
  "Challenge: Maximum Subarray": ROUTES.PRACTICE("arrays", "max-subarray"),
  "Challenge: Sort Colors": ROUTES.PRACTICE("sorting", "sort-colors"),
  "Challenge: Kth Largest Element": ROUTES.PRACTICE("sorting", "kth-largest"),
  "Challenge: Top K Frequent Elements": ROUTES.PRACTICE("sorting", "top-k-frequent"),
  "Challenge: Intersection of Two Arrays": ROUTES.PRACTICE("sorting", "intersection-arrays"),
  "Challenge: Merge Two Sorted Lists": ROUTES.PRACTICE("linked-lists", "merge-two-lists"),
  "Challenge: Linked List Cycle": ROUTES.PRACTICE("linked-lists", "linked-list-cycle"),
  "Challenge: Middle of the Linked List": ROUTES.PRACTICE("linked-lists", "middle-list"),
  "Challenge: Remove Nth Node From End": ROUTES.PRACTICE("linked-lists", "remove-nth-node"),

  // New visualizers
  "Stack & Queue Visualizer": ROUTES.STACK_QUEUE,
  "Binary Search Tree Visualizer": ROUTES.TREE,
  "Hash Table Visualizer": ROUTES.HASH_TABLE,
  "Graph Traversal Visualizer": ROUTES.GRAPH,

  // New theory lessons
  "Stack & Queue Fundamentals": ROUTES.THEORY("stack-queue", "stack-queue-intro"),
  "Binary Search Tree Fundamentals": ROUTES.THEORY("tree", "bst-intro"),
  "Hash Table Fundamentals": ROUTES.THEORY("hash-table", "hash-table-intro"),
  "Graph Representation & Traversals": ROUTES.THEORY("graph", "graph-intro"),
};

/**
 * Route path → lesson title mapping (reverse lookup).
 * Used by LessonSync to set activeLesson from URL.
 */
export const ROUTE_LESSON_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(LESSON_ROUTE_MAP).map(([lesson, route]) => [route, lesson]),
);
