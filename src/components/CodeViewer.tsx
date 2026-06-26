/* eslint-disable react/prop-types */
const BUBBLE_SORT_CODE = [
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
  "}"
];

const SELECTION_SORT_CODE = [
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
  "}"
];

const LINKED_LIST_CODE = [
  "function traverseList(head) {",
  "  let current = head; // @init",
  "  while (current !== null) { // @loop",
  "    // Visit the node",
  "    visit(current); // @visit",
  "    current = current.next; // @next",
  "  }",
  "}"
];

const LINEAR_SEARCH_CODE = [
  "function linearSearch(arr, target) {",
  "  for (let i = 0; i < arr.length; i++) { // @loop",
  "    if (arr[i] === target) return i; // @compare",
  "  }",
  "  return -1; // @notfound",
  "}"
];

const BINARY_SEARCH_CODE = [
  "function binarySearch(arr, target) {",
  "  let low = 0, high = arr.length - 1; // @init",
  "  while (low <= high) { // @loop",
  "    let mid = Math.floor((low + high) / 2); // @mid",
  "    if (arr[mid] === target) return mid; // @compare",
  "    else if (arr[mid] < target) low = mid + 1; // @left-half",
  "    else high = mid - 1; // @right-half",
  "  }",
  "  return -1; // @notfound",
  "}"
];

interface CodeViewerProps {
  codeType: string;
  highlightedLine?: number;
  highlightedMarker?: string;
}

export default function CodeViewer({ codeType, highlightedLine, highlightedMarker }: CodeViewerProps) {
  let codeLines: string[] = [];
  if (codeType === 'bubble') codeLines = BUBBLE_SORT_CODE;
  else if (codeType === 'selection') codeLines = SELECTION_SORT_CODE;
  else if (codeType === 'linked-list') codeLines = LINKED_LIST_CODE;
  else if (codeType === 'linear-search') codeLines = LINEAR_SEARCH_CODE;
  else if (codeType === 'binary-search') codeLines = BINARY_SEARCH_CODE;

  // Compute highlighted line number from marker if provided, otherwise fallback to highlightedLine
  let activeLine = highlightedLine || 0;
  if (highlightedMarker) {
    const idx = codeLines.findIndex(line => line.includes(highlightedMarker));
    if (idx !== -1) {
      activeLine = idx + 1;
    }
  }

  // Clean lines for render (strip markers like // @loop)
  const cleanLines = codeLines.map(line => line.replace(/\s*\/\/\s*@\w+/, ''));

  return (
    <div id="code-viewer" className="font-mono text-base bg-paper-dark border border-charcoal/10 rounded-2xl p-6 shadow-sm overflow-x-auto min-w-[280px] min-h-[340px] flex flex-col flex-1">
      <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <span className="text-base text-charcoal font-bold tracking-wider">
          {codeType === 'bubble' ? 'bubbleSort.js' :
           codeType === 'selection' ? 'selectionSort.js' :
           codeType === 'linear-search' ? 'linearSearch.js' :
           codeType === 'binary-search' ? 'binarySearch.js' :
           'linkedList.js'}
        </span>
      </div>
      <div className="space-y-1">
        {cleanLines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;
          return (
            <div
              key={lineNum}
              data-line-number={lineNum}
              data-line-active={isActive ? "true" : undefined}
              className={`py-0.5 px-2 -mx-2 rounded transition-colors whitespace-pre ${
                isActive ? 'bg-coral/10 border-l-2 border-coral code-line-active text-charcoal font-bold font-mono' : 'text-charcoal font-mono'
              }`}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
