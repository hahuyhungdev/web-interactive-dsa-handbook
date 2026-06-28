## 2026-06-28T10:32:22Z
Please implement the following frontend enhancements and responsive layout refactoring across the codebase.

### FINDINGS & ACTION PLAN:

#### 1. Main Layout Table of Contents (TOC) Mobile Stacking
* **File**: `src/layouts/MainLayout.tsx`
* **Enhancement**: Make the TOC collapsible on mobile viewports (below `md` breakpoint). You can wrap it in an elegant `<details>` panel or create a responsive drawer/toggle. For example, wrap it in a `<details className="md:hidden group">` with a styled `<summary>` header (e.g. "Chapters Outline ▼") and a separate `hidden md:block` TOC for desktop.

#### 2. BST (Tree) Visualizer Legibility
* **File**: `src/features/tree/components/TreeVisualizer.tsx`
* **Enhancement**: Ensure node circle text labels are readable on mobile. Add `min-w-[650px]` directly to the SVG element, and add `overflow-x-auto` to the parent container wrapper so the SVG is scrollable horizontally rather than shrinking to illegible dimensions.

#### 3. Hash Table Buckets scroll origin
* **File**: `src/features/hash-table/components/HashTableVisualizer.tsx`
* **Enhancement**: Change the flex bucket container classes from `justify-center` to `justify-start md:justify-center` so that overflowing buckets can be scrolled to from left to right (preventing buckets [0] and [1] from being clipped off-screen to the left of the scroll origin).

#### 4. Graph Visualizer Node Text Size & Code Viewer Fixes
* **Files**: `src/features/graph/components/GraphVisualizer.tsx`, `src/features/graph/components/GraphWorkspace.tsx`
* **Enhancement**: 
  - In `GraphVisualizer.tsx`, increase node text `fontSize` (e.g. from `4.2` to `5.2`) and node circle radius (e.g. to `7`), or wrap the SVG in a scrollable frame.
  - In `GraphWorkspace.tsx` (and other workspaces if needed), add `min-w-0` to the flex container parent of the CodeViewer to enable horizontal scrolling, preventing long code lines from being truncated.

#### 5. Search Visualizer Array Responsiveness
* **File**: `src/features/search/components/SearchVisualizer.tsx`
* **Enhancement**: Update the array bar container layout to `overflow-x-auto justify-start sm:justify-center gap-1 sm:gap-2 p-4 sm:p-8`. Reduce the array bar width on mobile to `w-8` (32px) and font size to `text-sm` (inside the loop) so they fit comfortably on standard mobile screens.

#### 6. Sorting Visualizer Responsive Bar Widths
* **File**: `src/features/sorting/components/SortingVisualizer.tsx`
* **Enhancement**: Remove `overflow-hidden` and apply `overflow-x-auto` on the array container. Make the bars responsive (e.g., replacement of fixed width `w-10` with responsive widths such as `w-6 sm:w-10`, responsive gap `gap-1 sm:gap-2`).

#### 7. LinkedList Visualizer Wrapping, Deletion, and Dynamic Code
* **Files**: 
  - `src/features/linked-list/components/LinkedListVisualizer.tsx`
  - `src/features/linked-list/components/LinkedListWorkspace.tsx`
  - `src/features/linked-list/utils/generateFrames.ts`
* **Enhancement**: 
  - Remove `flex-wrap` and force `flex-nowrap overflow-x-auto` on all viewports (`LinkedListVisualizer.tsx:217`) so it scrolls horizontally, keeping the pointer arrows pointing correctly to the next node.
  - Implement active traversal node styling: ensure that `generateFrames.ts` actually assigns `node.status = "active"` during the frames generated for traversals/searches (e.g., highlight the current node being examined in blue).
  - Implement node delete animation frame: currently, deletion filters the array instantly. Update the deletion frame generation logic (or add deletion frames in `generateListFrames`) to highlight the target node as `"deleted"` (red border/text/background) and dynamically show the preceding node's pointer pointing to the next node (or highlight the pointer change), before removing the node from the DOM.
  - Make CodeViewer dynamic in `LinkedListWorkspace.tsx`: instead of a static `traverseList` code block, dynamically select the code snippet (e.g. `insertHead`, `insertTail`, `insertIndex`, `deleteNode`, `traverseList`) in CodeViewer depending on the last action or selection.

#### 8. Stack & Queue Visualizer Responsiveness & Labels
* **File**: `src/features/stack-queue/components/StackQueueVisualizer.tsx`
* **Enhancement**: 
  - QueueView: make the pipeline container responsive (e.g. remove `min-w-[360px]` and place `in`/`out` badges inline rather than absolutely positioned outside the viewport). Alternatively, enable `overflow-x-auto` on the parent container.
  - StackView: adjust the `top →` pointer label offset from `-left-20` to `-left-16` or `-left-14` or render it as a badge/indicator next to the element, preventing border collisions.

#### 9. Cross-Workspace Layout Parity
* **Files**: `src/features/sorting/components/SortingWorkspace.tsx`, `src/features/linked-list/components/LinkedListWorkspace.tsx`
* **Enhancement**: Bring parity across visualizer workspaces. Apply the collapsible code panel wrapper (`isCodeCollapsed` state) currently only present in `StackQueueWorkspace.tsx` to `SortingWorkspace.tsx` and `LinkedListWorkspace.tsx`. Use a consistent code panel width (e.g. `lg:w-[400px]` or similar) across all workspaces.

#### 10. Playback Scrubber Touch Target
* **File**: `src/shared/components/ui/PlaybackControls.tsx`
* **Enhancement**: Expand the scrubber thumb's touch area on mobile screens using Tailwind's pseudo-elements: add `after:content-[''] after:absolute after:-top-3 after:-bottom-3 after:-left-3 after:-right-3` to achieve a 44px+ touch target without altering the visual design.
