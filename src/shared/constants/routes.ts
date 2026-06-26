/**
 * Route constants — single source of truth for all paths.
 * Eliminates magic strings across the codebase.
 */
export const ROUTES = {
  HOME: '/',
  SORTING: '/sorting',
  LINKED_LIST: '/linked-list',
  SEARCH: '/search',
  THEORY: (lessonId: string) => `/theory/${lessonId}`,
  PRACTICE: (challengeId: string) => `/practice/${challengeId}`,
  PRACTICE_ROOT: '/practice',
} as const;

/**
 * Lesson title → route path mapping.
 * Used by sidebar navigation and URL sync.
 */
export const LESSON_ROUTE_MAP: Record<string, string> = {
  'Bubble Sort Visualizer': ROUTES.SORTING,
  'Selection Sort Visualizer': ROUTES.SORTING,
  'Singly Linked List Visualizer': ROUTES.LINKED_LIST,
  'Linear Search & Binary Search': ROUTES.SEARCH,
  'The Contiguous Memory Model': ROUTES.THEORY('contiguous-memory'),
  'Sorting Taxonomy & Complexity': ROUTES.THEORY('sorting-taxonomy'),
  'Nodes, Pointers & References': ROUTES.THEORY('pointers-references'),
  'Challenge: Two Sum': ROUTES.PRACTICE('two-sum'),
  'Challenge: Max Value in Array': ROUTES.PRACTICE('find-max'),
  'Challenge: Reverse Linked List': ROUTES.PRACTICE('reverse-list'),
};

/**
 * Route path → lesson title mapping (reverse lookup).
 * Used by LessonSync to set activeLesson from URL.
 */
export const ROUTE_LESSON_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(LESSON_ROUTE_MAP).map(([lesson, route]) => [route, lesson])
);
