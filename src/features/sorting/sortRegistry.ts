import type { VisualizerFrame } from "@/shared/types";
import {
  generateBubbleSortFrames,
  generateSelectionSortFrames,
  generateInsertionSortFrames,
  generateQuickSortFrames,
  generateMergeSortFrames,
} from "./utils/generateFrames";
import {
  BUBBLE_SORT_CODE,
  SELECTION_SORT_CODE,
  INSERTION_SORT_CODE,
  QUICK_SORT_CODE,
  MERGE_SORT_CODE,
} from "./utils/sortCode";

/**
 * A single sorting algorithm, described entirely by data.
 *
 * The UI (tabs, code panel, playback) consumes this shape and nothing else, so
 * adding an algorithm = appending one entry below. Changing an algorithm's
 * internals never touches the UI as long as `generate` keeps returning
 * `VisualizerFrame[]` and `code` keeps the same markers.
 */
export interface SortAlgo {
  /** Stable id — also used for tab/element ids (`btn-select-<id>-sort`). */
  id: string;
  /** Tab label. */
  label: string;
  /** Filename shown in the code panel chrome. */
  fileName: string;
  /** Big-O badge shown next to the tab label. */
  complexity: string;
  /** Pure algorithm → precomputed playback frames. */
  generate: (arr: number[]) => VisualizerFrame[];
  /** Source lines (with `// @marker` comments) for the code panel. */
  code: string[];
}

export const SORT_ALGOS = [
  {
    id: "bubble",
    label: "Bubble Sort",
    fileName: "bubbleSort.js",
    complexity: "O(n²)",
    generate: generateBubbleSortFrames,
    code: BUBBLE_SORT_CODE,
  },
  {
    id: "selection",
    label: "Selection Sort",
    fileName: "selectionSort.js",
    complexity: "O(n²)",
    generate: generateSelectionSortFrames,
    code: SELECTION_SORT_CODE,
  },
  {
    id: "insertion",
    label: "Insertion Sort",
    fileName: "insertionSort.js",
    complexity: "O(n²)",
    generate: generateInsertionSortFrames,
    code: INSERTION_SORT_CODE,
  },
  {
    id: "quick",
    label: "Quick Sort",
    fileName: "quickSort.js",
    complexity: "O(n log n)",
    generate: generateQuickSortFrames,
    code: QUICK_SORT_CODE,
  },
  {
    id: "merge",
    label: "Merge Sort",
    fileName: "mergeSort.js",
    complexity: "O(n log n)",
    generate: generateMergeSortFrames,
    code: MERGE_SORT_CODE,
  },
] as const satisfies readonly SortAlgo[];

export type SortAlgoId = (typeof SORT_ALGOS)[number]["id"];

export const DEFAULT_SORT_ALGO_ID: SortAlgoId = "bubble";

/** Look up an algorithm by id, falling back to the default. */
export function getSortAlgo(id: SortAlgoId): SortAlgo {
  return SORT_ALGOS.find((a) => a.id === id) ?? SORT_ALGOS[0];
}

/** Narrow an arbitrary string (e.g. a URL param) to a known algorithm id. */
export function isSortAlgoId(
  value: string | null | undefined,
): value is SortAlgoId {
  return !!value && SORT_ALGOS.some((a) => a.id === value);
}
