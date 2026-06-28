# Handoff Report — Browser-Based Visualizer Audit

This handoff details the browser-based audit findings, evidence, logic chains, and recommended fix strategies for the Sorting, LinkedList, and Stack/Queue Visualizers.

---

## 1. Observation

### General Stability
- Vite Dev Server was successfully booted at `http://localhost:5175`.
- Automated browser audit scripts using Playwright (`scripts/audit-visualizers.mjs`) tested all 3 pages (`/sorting`, `/linked-list`, `/stack-queue`) across standard viewports: **Desktop** (1440x900), **Tablet** (768x1024), and **Mobile** (375x667).
- Console and unhandled error logs saved to `docs/audit-screenshots/audit-logs.json`:
  ```json
  "consoleLogs": [],
  "pageErrors": []
  ```
  Resulting in **0 console warnings/errors** and **0 uncaught page exceptions**.

### Sorting Visualizer (`/sorting`)
- The container for the array bars in `src/features/sorting/components/SortingVisualizer.tsx`:
  - **Line 85**: `className="flex items-end justify-center gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-8 h-64 min-w-[280px] overflow-hidden"`
  - **Line 113**: `className={`w-10 rounded-t-md transition-[background-color,box-shadow] duration-200 ${style.bar}`}` (fixed 40px width `w-10`).
- The array size slider in `src/features/sorting/components/SortingArrayEditor.tsx` allows sizes between 3 and 12:
  - **Line 16-17**: `const MIN_SIZE = 3; const MAX_SIZE = 12;`

### LinkedList Visualizer (`/linked-list`)
- The visualizer container in `src/features/linked-list/components/LinkedListVisualizer.tsx`:
  - **Line 217**: `className="flex items-center justify-start gap-4 overflow-x-auto bg-paper-dark border border-charcoal/10 rounded-3xl p-8 min-h-[140px] flex-wrap md:flex-nowrap"`
- The node structure and connectors in `src/features/linked-list/components/LinkedListVisualizer.tsx`:
  - **Line 241-269**: Node card and arrow rendering with right-pointing SVG:
    ```tsx
    {/* Connector Arrow */}
    {idx < currentNodesState.length - 1 && (
      <div className="list-pointer flex items-center justify-center text-charcoal" ...>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42 5.43 5.43H5v2z" />
        </svg>
      </div>
    )}
    ```
- Node `"active"` status visual representation:
  - **Line 249-250**: `node.status === "active" ? "bg-blue-50 border-blue-200 text-blue-800"`
  - A project grep search for `"active"` status in `src/features/linked-list/` returned only a single styling occurrence (`LinkedListVisualizer.tsx:249`). No frames in `src/features/linked-list/utils/generateFrames.ts` assign `"active"`.
- Deletion logic:
  - **Line 69-70**: `const newList = list.filter((_, idx) => idx !== index); onListChange(newList, null);`
- Static code viewer rendering in `src/features/linked-list/components/LinkedListWorkspace.tsx`:
  - **Line 95**: `<CodeViewer codeType="linked-list" ... />` which maps strictly to `LINKED_LIST_CODE` containing only the `traverseList` function in `src/features/theory/components/CodeViewer.tsx`.

### Stack & Queue Visualizer (`/stack-queue`)
- The Queue layout in `src/features/stack-queue/components/StackQueueVisualizer.tsx`:
  - **Line 189**: `className="border-y-2 border-charcoal/20 bg-paper-light/50 px-6 py-4 flex items-center gap-3 relative min-w-[360px] justify-center rounded-sm shadow-inner"`
  - **Line 190**: `<span className="absolute -left-14 ...">out</span>`
  - **Line 191**: `<span className="absolute -right-14 ...">in</span>`
  - **Line 77**: The parent wrapper is `className="w-full bg-paper-dark border border-charcoal/10 rounded-3xl p-8 min-h-[380px] overflow-hidden"`
- The Stack beaker pointer label in `src/features/stack-queue/components/StackQueueVisualizer.tsx`:
  - **Line 128**: `className="absolute -left-20 font-mono text-xs font-bold text-coral animate-pulse whitespace-nowrap select-none"` (equivalent to `-80px` offset).

### Workspace Code Panel Layouts
- Collapsible code panel state is only defined in `src/features/stack-queue/components/StackQueueWorkspace.tsx`:
  - **Line 21**: `const [isCodeCollapsed, setIsCodeCollapsed] = useState(false);`
  - **Line 107-139**: Renders code pane with `lg:w-[390px]`.
- No collapsible panel logic is present in `src/features/sorting/components/SortingWorkspace.tsx` or `src/features/linked-list/components/LinkedListWorkspace.tsx`. Both workspaces have a fixed code viewer width of `lg:w-[480px]`.

### Playback Controls
- The scrubber timeline slider in `src/shared/components/ui/PlaybackControls.tsx`:
  - **Line 215-216**: `className="block w-4 h-4 bg-paper border-2 border-coral rounded-full shadow-sm ..."` (fixed `w-4 h-4` / 16px size).

---

## 2. Logic Chain

1. **Sorting Visualizer Clipping**:
   - *Observation*: The sorting visualizer container has `overflow-hidden` (Line 85) and each bar has a fixed `w-10` width (Line 113) with `gap-2` spacing.
   - *Reasoning*: A size-12 array requires `12 * 40px + 11 * 8px = 568px` of horizontal space. On mobile viewports (375px wide), this is significantly wider than the screen. Because `overflow-hidden` is applied, the visualizer clippings cannot be scrolled to, cutting off the outer elements and hiding pivots or comparison states.
   - *Conclusion*: Responsiveness is broken for larger array sizes on mobile.

2. **LinkedList Wrapping & Visual Flow**:
   - *Observation*: The list container has `flex-wrap md:flex-nowrap` (Line 217). The arrow connector is a hardcoded right-pointing shape (Line 265).
   - *Reasoning*: When a list of 5+ nodes wraps to a new line on mobile, the rightmost node on the first row renders a right-pointing pointer that points to empty wall space instead of visually directing the user down to the next node (which wraps and starts at the left of the second row).
   - *Conclusion*: Wrapping ruins the semantic and visual representation of the linked list on mobile/tablet viewports.

3. **LinkedList Instant Deletion and Dead Code**:
   - *Observation*: Deletion filters the array instantly (Line 69) and resets playback, and the `"deleted"` status style (Line 248) is defined but never assigned in `generateFrames.ts`.
   - *Reasoning*: Since the target node is removed before the list is passed to `generateListFrames`, it disappears instantly from the screen without any visual warning or tracing. The red `"deleted"` state is dead code and is never rendered.
   - *Conclusion*: Deleting a node lacks educational utility and visual polish compared to the stack/queue popped animation states.

4. **LinkedList Static Code Viewer**:
   - *Observation*: `LinkedListWorkspace.tsx` hardcodes `codeType="linked-list"` (Line 95), displaying only the `traverseList` function.
   - *Reasoning*: Users performing `Insert Node` or `Delete Node` will see the visual sandbox execute steps, but the code panel continues to display a static traversal loop, which does not match the actual operation being performed.
   - *Conclusion*: A static code pane for varying linked list operations decreases educational alignment.

5. **Queue Visualizer Clipping**:
   - *Observation*: The Queue pipeline is `min-w-[360px]` (Line 189) with `out`/`in` labels positioned absolutely at `-left-14` (-56px) and `-right-14` (+56px), requiring `360 + 56 + 56 = 472px` minimum space. The parent container has `overflow-hidden` (Line 77).
   - *Reasoning*: On mobile screens (375px), this 472px width exceeds available container bounds. Because overflow is hidden, the `in` and `out` text badges and outer queue elements are fully clipped.
   - *Conclusion*: The Queue layout is non-responsive on mobile viewports.

6. **Stack Beaker Label Overlap**:
   - *Observation*: The Stack beaker has `min-w-[180px]` and centers elements (Line 105). The `top →` label has an absolute positioning of `-left-20` (Line 128).
   - *Reasoning*: On mobile layouts, the container shrinks to fit the screen. A `-left-20` (80px) offset on centered 96px elements will extend past the beaker's left padding and render directly on top of or outside the glass outline, causing aesthetic clipping and layout collision.
   - *Conclusion*: Stack pointer labels overlap container borders on narrow viewports.

7. **Cross-Workspace Parity Inconsistencies**:
   - *Observation*: Collapsible code panel state only exists in `StackQueueWorkspace.tsx` (Line 21) and the widths of code panels vary between 390px (Stack/Queue) and 480px (Sorting & LinkedList).
   - *Reasoning*: Navigating between these adjacent visualizers causes the layout grid width to jump, causing layout shifts.
   - *Conclusion*: Visual and architectural parity between visualizers is lacking.

8. **Playback Scrubber Touch Target**:
   - *Observation*: The scrubber thumb is a `w-4 h-4` (16px) element (Line 215-216).
   - *Reasoning*: Mobile usability standards recommend touch targets of at least 44px to prevent user frustration. A 16px target makes scrubbing hard to interact with on mobile.
   - *Conclusion*: Timeline scrubbers have poor mobile accessibility.

---

## 3. Caveats

- We assumed Vite dev server's behavior on port `5175` is identical to port `5173` (defined as the default in `playwright.config.ts`).
- We did not audit the Graph, Hash-Table, Search, and Tree visualizer pages, as they were explicitly scoped out of the initial user request.
- Assumed standard React and TailwindCSS properties apply without external media query overlays modifying the classes.

---

## 4. Conclusion & Recommended Fix Strategies

### Sorting Visualizer
- **Fix**: Remove `overflow-hidden` and apply `overflow-x-auto` on the visualizer container `SortingVisualizer.tsx:85` on smaller screens. Alternatively, scale down the bar width dynamically (e.g., replacement of `w-10` with responsive widths such as `w-6 sm:w-10` or a responsive flex layout).

### LinkedList Visualizer
- **Fix**: Remove `flex-wrap` and lock the list to a single row using `flex-nowrap overflow-x-auto` on all viewports (`LinkedListVisualizer.tsx:217`). This preserves the horizontal layout and keeps the right-pointing arrows pointing to the next node.
- **Fix**: Implement deletion frames in `generateListFrames` (or a dedicated `generateDeleteFrames` utility). Before filtering the node, push frames highlighting the target node as `"deleted"` (red) and visual redirection of the preceding node's arrow to the next node.
- **Fix**: Dynamic code panel content: define code snippets for `insertNode` (head, tail, index) and `deleteNode` inside a code dictionary, and dynamically switch the `CodeViewer` inputs in `LinkedListWorkspace.tsx` based on the user's last action.

### Stack & Queue Visualizer
- **Fix**: In `QueueView`, make the pipeline container responsive (e.g. remove `min-w-[360px]` and place `in`/`out` badges inline rather than absolutely positioned outside the viewport). Alternatively, enable `overflow-x-auto` on the parent container.
- **Fix**: In `StackView`, adjust the `top →` pointer label offset from `-left-20` to `-left-16` or render it as a badge/indicator next to the element, preventing border collisions.

### Cross-Workspace Layout Parity
- **Fix**: Extract a unified, reusable layout shell for visualizer pages. Apply the collapsible code panel wrapper to all three workspaces with a consistent code panel width (e.g. `lg:w-[420px]`).

### Playback Controls
- **Fix**: Expand the scrubber thumb's hit area on mobile screens using Tailwind's pseudo-elements:
  `className="after:content-[''] after:absolute after:-top-3 after:-bottom-3 after:-left-3 after:-right-3"` to achieve a 40px+ touch target without altering the visual design.

---

## 5. Verification Method

To verify these issues and test any subsequent implementations:
1. **Visual and Responsiveness Pass**:
   - Inspect the generated screenshots in `docs/audit-screenshots/` to confirm clipping and layouts:
     - `sorting_mobile_init.png` (displays clipped bars if custom elements are input).
     - `linked_list_mobile_init.png` (displays wrapped nodes with wrong arrow direction).
     - `stack_queue_mobile_init_stack.png` (displays clipped queue container / out-of-bounds top pointer).
2. **Interactive Run**:
   - Run the dev server: `npm run dev`
   - Navigate to `/sorting`, increase array size to 12, shrink browser width to mobile (375px), and check if visualizer clips elements.
   - Navigate to `/linked-list` on mobile, add 6 elements, and check if wrapping occurs.
   - Navigate to `/stack-queue` on mobile, select Queue, and verify if the `in` and `out` text badges are clipped.
