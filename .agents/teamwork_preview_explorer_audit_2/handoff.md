# Handoff Report — Visualizer Audit

This handoff report summarizes the comprehensive browser-based audit of the DSA visualizer routes (`/tree`, `/hash-table`, `/graph`, `/search`) using Playwright automated browser tests.

---

## 1. Observation

During the Playwright spec execution (`npx playwright test --project=chromium`), screenshots were captured at viewports representing Desktop (1440x900), Tablet (768x1024), and Mobile (375x667). 

The following exact structural issues were observed in the code and screenshot outputs:

### A. Main Layout (All pages)
* **File**: `src/layouts/MainLayout.tsx` (Lines 30-46)
```typescript
      <div className="pt-24 flex-1 flex flex-col md:flex-row max-w-[95rem] w-full mx-auto relative px-4 md:px-6 mb-12">
        {/* Left column: Sidebar TableOfContents */}
        <aside className="w-full md:w-72 shrink-0 md:pr-6 border-b md:border-b-0 md:border-r border-charcoal/10 py-6 md:py-0">
          <div className="md:sticky md:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <TableOfContents
              activeLesson={activeLesson}
              onSelectLesson={onSelectLesson}
              isSidebar={true}
            />
          </div>
        </aside>

        {/* Right column: Active Route Workspace */}
        <main className="flex-1 min-w-0 py-6 md:py-0 md:pl-6">
          <Outlet />
        </main>
      </div>
```
* **Visual observation**: In `scratch/tree-mobile.png`, `scratch/hash-table-mobile.png`, `scratch/graph-mobile.png`, and `scratch/search-mobile.png`, the `TableOfContents` sidebar is rendered at the top of the screen as a full-width column, taking up more than 500px of vertical space. The interactive visualizer is pushed entirely below the fold, forcing the user to scroll down a full page height to interact with it.

### B. Binary Search Tree (BST) Visualizer (`/tree`)
* **File**: `src/features/tree/components/TreeVisualizer.tsx` (Lines 40-43, 118-130)
```typescript
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto max-h-[480px]"
        >
```
and node text labels:
```typescript
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="font-mono text-sm font-bold select-none"
                  ...
                  style={{ fontSize: '13px', fontWeight: 700 }}
                >
                  {node.value}
                </text>
```
* **Visual observation**: In `scratch/tree-mobile.png`, as the SVG scales down to fit the narrow content area (~200px wide due to nested paddings on `p-8` for the layout, `p-6` for the sandbox, and `p-6` for the SVG container), the circle nodes (`r=24`) shrink to ~6px dots and the labels (`fontSize: '13px'`) scale down to ~3.2px CSS size, becoming completely illegible.

### C. Hash Table Visualizer (`/hash-table`)
* **File**: `src/features/hash-table/components/HashTableVisualizer.tsx` (Line 77)
```typescript
      {/* Bucket columns */}
      <div className="flex gap-4 justify-center items-start overflow-x-auto py-4 px-2 bg-paper-light/50 rounded-2xl border border-charcoal/5 shadow-inner">
```
* **Visual observation**: In `scratch/hash-table-mobile.png`, buckets are cut off at the left and right edges. Because the flexbox container uses `justify-center`, the overflowed buckets to the left (e.g., indices `[0]` and `[1]`) are pushed off-screen to the left of the scroll origin, making them permanently clipped and unreachable via scrolling.

### D. Graph Traversal Visualizer (`/graph`)
* **File**: `src/features/graph/components/GraphVisualizer.tsx` (Line 198-214)
```typescript
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="4.2"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  ...
                >
                  {node.label}
                </text>
```
* **Visual observation 1**: In `scratch/graph-mobile.png`, node text labels scale down to ~8.4px, which is extremely squint-inducing and hard to read.
* **Visual observation 2**: The implementation `CodeViewer` code text is horizontally truncated (e.g. `for (let nb of graph[node]) {` is cut off to `for (let nb of graph[n...`) and does not scroll horizontally on mobile.

### E. Linear & Binary Search Visualizer (`/search`)
* **File**: `src/features/search/components/SearchVisualizer.tsx` (Lines 300-303, 319-321)
```typescript
          <div
            id="sorting-visualizer-container"
            className="flex items-end justify-center gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-8 h-48 min-w-[280px]"
          >
```
and bar widths:
```typescript
                <div
                  key={idx}
                  className="array-bar w-12 transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end text-base font-mono font-bold text-charcoal pb-2 h-full relative"
```
* **Visual observation**: In `scratch/search-mobile.png`, the 9 array bars (width `w-12` (48px) + `gap-2` (8px) = 56px each; total width > 500px) overflow the rounded border of the container. Because the container is `justify-center` and lacks `overflow-x-auto`, the bars on the far left and far right overflow the bounds of the gray sandbox card and are clipped.

---

## 2. Logic Chain

1. **Table of Contents Blockage**: Placing a 500px tall navigation element in a `flex-col` wrapper before the workspace pushes the interactive interface entirely off-screen on mobile. If we make the TableOfContents sidebar collapsible or hidden on mobile, users will immediately see the interactive visualizer when loading the page.
2. **BST Node Text Legibility**: Monospace text inside a scaled-down vector graphics SVG becomes unreadable when its computed screen height is under 9px. If the SVG is given a fixed minimum width of `600px` and the outer wrapper has horizontal scroll enabled (`overflow-x-auto`), the SVG will not compress below `600px`, maintaining a readable font size of 13px.
3. **Hash Table Left-Clipping**: According to CSS specifications, when a container with `overflow-x-auto` uses `justify-content: center`, any overflow content that extends to the left of the container's starting boundary is not scrollable. By changing the container to `justify-start` (optionally reverting to `md:justify-center` when no overflow is active), the scroll container starts at index 0 and allows scrolling to the right.
4. **Graph Node Text and Code Overflow**: High-contrast labels inside a `100x80` viewBox require a proportional `fontSize` increase (e.g. `fontSize="5.2"`). For the code viewer truncation, missing layout constraints like `min-w-0` on flex items prevent `overflow-x-auto` from working correctly. Adding `min-w-0` or wrapping long code blocks fixes the overflow behavior.
5. **Search Array Bar Overflow**: On a `375px` screen, a total array content width of >500px will inevitably overflow. If we reduce the bar width on mobile to `w-8` (32px) and the gap to `gap-1` (4px), the total width for 9 bars becomes 324px. Adding `p-4` layout padding fits the entire array perfectly within `356px`, avoiding the need for scrolling while maintaining full visibility.

---

## 3. Caveats

* **Browser Support**: The scroll origin layout behavior with `justify-center` applies to standard Blink/Gecko/WebKit layout engines (which includes Safari, Chrome, and Firefox). Standard workarounds rely on `justify-start md:justify-center` classes.
* **Array Lengths**: For `/search`, if the user has custom inputs that can change the array length to be much larger (though currently fixed at 9 elements), fixed width adjustments might still overflow, so adding `overflow-x-auto` to the parent container is recommended as a secondary safety net.

---

## 4. Conclusion

The visualizer pages suffer from significant usability, aesthetic, and responsiveness issues on mobile viewports due to layout choices (flex row-to-column behavior, CSS scroll origins, scaling vectors, and rigid grid sizes).

### Actionable Fix Strategies

#### 1. Main Layout Sidebar Collapse
* **Target File**: `src/layouts/MainLayout.tsx`
* **Change**: Wrap the TableOfContents container in a collapsible details element or use a toggle state on viewports below `md`.
```typescript
        {/* Example approach: */}
        <aside className="w-full md:w-72 shrink-0 md:pr-6 border-b md:border-b-0 md:border-r border-charcoal/10 py-4 md:py-0">
          <details className="md:hidden group">
            <summary className="font-sans font-bold uppercase tracking-wider text-charcoal/60 cursor-pointer py-2 px-4 bg-paper-dark rounded-xl select-none list-none flex justify-between items-center">
              <span>Handbook Chapters / Outline</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-4">
              <TableOfContents activeLesson={activeLesson} onSelectLesson={onSelectLesson} isSidebar={true} />
            </div>
          </details>
          <div className="hidden md:block md:sticky md:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            <TableOfContents activeLesson={activeLesson} onSelectLesson={onSelectLesson} isSidebar={true} />
          </div>
        </aside>
```

#### 2. BST SVG Scrollable Container
* **Target File**: `src/features/tree/components/TreeVisualizer.tsx`
* **Change**: Apply `min-w-[650px]` directly to the SVG element, and add `overflow-x-auto` to the parent wrapper card:
```typescript
      <div className="bg-paper-dark border border-charcoal/10 rounded-3xl p-6 overflow-x-auto flex items-center justify-start md:justify-center">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-auto max-h-[480px] min-w-[650px]"
        >
```

#### 3. Hash Table Buckets Flex Alignment
* **Target File**: `src/features/hash-table/components/HashTableVisualizer.tsx`
* **Change**: Change the flex container classes from `justify-center` to `justify-start md:justify-center`:
```typescript
      {/* Bucket columns */}
      <div className="flex gap-4 justify-start md:justify-center items-start overflow-x-auto py-4 ...">
```

#### 4. Graph Visualizer Node Text Size & Code Viewer Fixes
* **Target File 1**: `src/features/graph/components/GraphVisualizer.tsx`
* **Change 1**: Increase text `fontSize` from `4.2` to `5.2` and increase node circle radius to `7` or wrap the SVG container in a scrollable frame.
* **Target File 2**: `src/features/graph/components/GraphWorkspace.tsx`
* **Change 2**: Add `min-w-0` to the flex container parent of the CodeViewer to enable horizontal scrolling:
```typescript
        {!isCodeCollapsed ? (
          <div className="w-full lg:w-[390px] shrink-0 bg-paper border ... flex flex-col min-w-0 transition-all ...">
```

#### 5. Search Visualizer Array Responsiveness
* **Target File**: `src/features/search/components/SearchVisualizer.tsx`
* **Change**: Update container layout class to support `overflow-x-auto justify-start sm:justify-center`, and update the array bar widths to fit standard mobile viewports natively:
```typescript
          <div
            id="sorting-visualizer-container"
            className="flex items-end justify-start sm:justify-center gap-1 sm:gap-2 bg-paper-dark border border-charcoal/10 rounded-3xl p-4 sm:p-8 h-48 overflow-x-auto min-w-[280px]"
          >
```
and change the array-bar width inside the loop:
```typescript
                <div
                  key={idx}
                  className="array-bar w-8 sm:w-12 transition-all duration-200 rounded-t-lg flex flex-col items-center justify-end text-sm sm:text-base font-mono font-bold text-charcoal pb-2 h-full relative"
```

---

## 5. Verification Method

To verify these issues independently:

1. **Start the Dev Server**:
   ```bash
   npx vite --port 5173 --host 127.0.0.1
   ```
2. **Inspect the Visual Layouts**:
   Open a browser (using device inspection tools) and resize the viewport to `375x667` for each route:
   * `/tree`: Verify node value labels are readable.
   * `/hash-table`: Verify index `[0]` and `[1]` are scrollable/visible.
   * `/graph`: Verify text labels are readable and the implementation code scrolls rather than truncating.
   * `/search`: Verify all 9 bars fit within the screen bounds or can be scrolled, and pointer markers do not overlap.
3. **Execute E2E Auditing Suite**:
   Run the included Playwright tests:
   ```bash
   npx playwright test --project=chromium
   ```
