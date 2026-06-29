/* eslint-disable react/prop-types */
const LINKED_LIST_CODE = [
  "function traverseList(head) {",
  "  let current = head; // @init",
  "  while (current !== null) { // @loop",
  "    // Visit the node",
  "    visit(current); // @visit",
  "    current = current.next; // @next",
  "  }",
  "}",
];

const LINEAR_SEARCH_CODE = [
  "function linearSearch(arr, target) {",
  "  for (let i = 0; i < arr.length; i++) { // @loop",
  "    if (arr[i] === target) return i; // @compare",
  "  }",
  "  return -1; // @notfound",
  "}",
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
  "}",
];

interface CodeViewerProps {
  /** Legacy lookup key (linked-list / search). Ignored when `codeLines` is set. */
  codeType?: string;
  /** Explicit source lines — preferred. Supplied by the sorting registry. */
  codeLines?: string[];
  /** Filename shown in the window chrome. Overrides the `codeType` default. */
  fileName?: string;
  highlightedLine?: number;
  highlightedMarker?: string;
}

export function CodeViewer({
  codeType,
  codeLines: codeLinesProp,
  fileName,
  highlightedLine,
  highlightedMarker,
}: CodeViewerProps) {
  let codeLines: string[] = codeLinesProp ?? [];
  if (!codeLinesProp) {
    if (codeType === "linked-list") codeLines = LINKED_LIST_CODE;
    else if (codeType === "linear-search") codeLines = LINEAR_SEARCH_CODE;
    else if (codeType === "binary-search") codeLines = BINARY_SEARCH_CODE;
  }

  // Compute highlighted line number from marker if provided, otherwise fallback to highlightedLine
  let activeLine = highlightedLine || 0;
  if (highlightedMarker) {
    const idx = codeLines.findIndex((line) => line.includes(highlightedMarker));
    if (idx !== -1) {
      activeLine = idx + 1;
    }
  }

  const displayName =
    fileName ??
    (codeType === "linear-search"
      ? "linearSearch.js"
      : codeType === "binary-search"
        ? "binarySearch.js"
        : "linkedList.js");

  // Clean lines for render (strip markers like // @loop)
  const cleanLines = codeLines.map((line) =>
    line.replace(/\s*\/\/\s*@[\w-]+/, ""),
  );

  return (
    <div
      id="code-viewer"
      className="font-mono text-xs sm:text-sm glass-panel-dark rounded-2xl p-4 sm:p-5 shadow-sm overflow-x-auto w-full max-w-full min-h-[340px] flex flex-col flex-1"
    >
      <div className="flex items-center justify-between border-b border-charcoal/5 pb-3 mb-4 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-coral/60"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60"></div>
        </div>
        <span className="text-xs sm:text-sm text-charcoal/60 font-bold tracking-wider uppercase">
          {displayName}
        </span>
      </div>
      <div className="space-y-1 overflow-x-auto w-full">
        {cleanLines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;
          return (
            <div
              key={lineNum}
              data-line-number={lineNum}
              data-line-active={isActive ? "true" : undefined}
              className={`py-0.5 px-2 -mx-2 rounded transition-all whitespace-pre ${
                isActive
                  ? "bg-coral/10 border-l-2 border-coral code-line-active text-charcoal font-bold font-mono shadow-sm"
                  : "text-charcoal/70 font-mono hover:text-charcoal transition-colors duration-150"
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
