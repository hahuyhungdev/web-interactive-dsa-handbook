/**
 * Source snippets shown in the sorting "Implementation" panel.
 *
 * Each line may carry a trailing marker comment (e.g. `// @compare`). The marker
 * is the contract that links a generated frame (`highlightedMarker`) to the line
 * that should glow. `CodeViewer` strips the markers before rendering.
 *
 * Rule: every marker emitted by a frame generator in `generateFrames.ts` MUST
 * appear on exactly one line here, otherwise no line lights up for that step.
 */

export const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",
  "  let n = arr.length;",
  "  for (let i = 0; i < n; i++) { // @outer-loop",
  "    for (let j = 0; j < n - i - 1; j++) { // @inner-loop",
  "      // Comparing elements",
  "      if (arr[j] > arr[j + 1]) { // @compare",
  "        // Swapping elements",
  "        swap(arr, j, j + 1); // @swap",
  "      }",
  "    }",
  "    // Element is sorted",
  "  }",
  "}",
];

export const SELECTION_SORT_CODE = [
  "function selectionSort(arr) {",
  "  let n = arr.length;",
  "  for (let i = 0; i < n - 1; i++) { // @outer-loop",
  "    let minIdx = i; // @init-min",
  "    for (let j = i + 1; j < n; j++) { // @inner-loop",
  "      // Comparing elements",
  "      if (arr[j] < arr[minIdx]) { // @compare",
  "        minIdx = j; // @update-min",
  "      }",
  "    }",
  "    if (minIdx !== i) {",
  "      // Swapping elements",
  "      swap(arr, i, minIdx); // @swap",
  "    }",
  "  }",
  "}",
];

export const INSERTION_SORT_CODE = [
  "function insertionSort(arr) {",
  "  let n = arr.length;",
  "  for (let i = 1; i < n; i++) { // @outer-loop",
  "    let key = arr[i]; // @pick",
  "    let j = i;",
  "    while (j > 0) { // @inner-loop",
  "      if (arr[j - 1] > arr[j]) { // @compare",
  "        swap(arr, j, j - 1); // @shift",
  "        j--;",
  "      } else break;",
  "    }",
  "  }",
  "}",
];

export const QUICK_SORT_CODE = [
  "function quickSort(arr, low, high) { // @start",
  "  if (low >= high) return; // @base",
  "  let pivot = arr[high]; // @pivot",
  "  let i = low;",
  "  for (let j = low; j < high; j++) { // @compare",
  "    if (arr[j] < pivot) {",
  "      swap(arr, i, j); // @swap",
  "      i++;",
  "    }",
  "  }",
  "  swap(arr, i, high); // @place",
  "  quickSort(arr, low, i - 1);",
  "  quickSort(arr, i + 1, high);",
  "}",
];

export const MERGE_SORT_CODE = [
  "function mergeSort(arr, low, high) { // @start",
  "  if (low >= high) return;",
  "  let mid = (low + high) >> 1; // @split",
  "  mergeSort(arr, low, mid);",
  "  mergeSort(arr, mid + 1, high);",
  "  let i = low, j = mid + 1, tmp = [];",
  "  while (i <= mid && j <= high) { // @compare",
  "    if (arr[i] <= arr[j]) tmp.push(arr[i++]);",
  "    else tmp.push(arr[j++]); // @write",
  "  }",
  "  copyBack(arr, tmp, low); // @merged",
  "}",
];
