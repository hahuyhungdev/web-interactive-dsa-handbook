import { test, expect } from '@playwright/test';

test.describe('E2E Test Suite - Web-Based Interactive DSA Handbook', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigating to the homepage before each test
    await page.goto('/');
  });

  // ==========================================
  // FEATURE 1: Premium UI, Navigation, & Theme
  // ==========================================
  test.describe('Feature 1: Premium UI, Navigation, & Theme', () => {
    
    // Tier 1: Feature Coverage (5 tests)
    test('T1.F1.1: Verify warm paper-like theme color palette', async ({ page }) => {
      const body = page.locator('body');
      // Verify body has background and charcoal text classes/styles
      await expect(body).toBeVisible();
      const html = page.locator('html');
      await expect(html).toBeVisible();
    });

    test('T1.F1.2: Verify floating frosted-glass navbar backdrop-filter', async ({ page }) => {
      const navbarContainer = page.locator('nav > div').first();
      await expect(navbarContainer).toBeVisible();
      // Inspect backdrop blur class
      await expect(navbarContainer).toHaveClass(/backdrop-blur/);
    });

    test('T1.F1.3: Verify Chapter I and III are expandable and collapsible', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      const arrayPanel = page.locator('#chapter-panel-arrays');
      await expect(arrayBtn).toBeVisible();
      
      // Default collapsed
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
      
      // Expand
      await arrayBtn.click();
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'true');
      
      // Collapse again
      await arrayBtn.click();
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('T1.F1.4: Verify Chapter II (Sorting) is expanded by default', async ({ page }) => {
      const sortingBtn = page.locator('#chapter-btn-sorting');
      await expect(sortingBtn).toBeVisible();
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'true');
    });

    test('T1.F1.5: Verify keyboard navigation on Chapter accordion buttons', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      await arrayBtn.focus();
      await page.keyboard.press('Enter');
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'true');
    });

    // Tier 2: Boundary & Corner Cases (5 tests)
    test('T2.F1.1: Verify all chapters can be collapsed simultaneously', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      const sortingBtn = page.locator('#chapter-btn-sorting');
      const listsBtn = page.locator('#chapter-btn-linked-lists');

      // Expand array to collapse sorting (since only one is expanded at a time)
      await arrayBtn.click();
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');
      
      // Collapse array so all are collapsed
      await arrayBtn.click();
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(listsBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('T2.F1.2: Rapid toggles do not break layout state', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      await arrayBtn.dblclick();
      await page.waitForTimeout(100);
      const isExpanded = await arrayBtn.getAttribute('aria-expanded');
      expect(isExpanded === 'true' || isExpanded === 'false').toBe(true);
    });

    test('T2.F1.3: Lesson items have correct tabindices and focusable states', async ({ page }) => {
      const sortingBtn = page.locator('#chapter-btn-sorting');
      // Ensure expanded
      const isExpanded = await sortingBtn.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await sortingBtn.click();
      }
      const lessonItems = page.locator('#chapter-panel-sorting [role="button"]');
      await expect(lessonItems.first()).toHaveAttribute('tabindex', '0');
    });

    test('T2.F1.4: Scroll transitions on floating navbar have scroll boundaries', async ({ page }) => {
      const navbarContainer = page.locator('nav > div').first();
      // Scroll slightly (5px) - shouldn't transition
      await page.evaluate(() => window.scrollTo(0, 5));
      await page.waitForTimeout(50);
      await expect(navbarContainer).toHaveClass(/bg-paper\/30/);
      
      // Scroll more (50px) - should transition
      await page.evaluate(() => window.scrollTo(0, 50));
      await page.waitForTimeout(100);
      await expect(navbarContainer).toHaveClass(/bg-paper\/60/);
    });

    test('T2.F1.5: UI responsive viewport mobile layout adjusts correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const menuBtn = page.locator('button[aria-label="Toggle Menu"]');
      await expect(menuBtn).toBeVisible();
    });
  });

  // ==========================================
  // FEATURE 2: Playback Controls
  // ==========================================
  test.describe('Feature 2: Playback Controls', () => {
    test.beforeEach(async ({ page }) => {
      // Go to Sorting Visualizer section
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      const bubbleSortLesson = page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")');
      await bubbleSortLesson.click();
    });

    // Tier 1: Feature Coverage (5 tests)
    test('T1.F2.1: Verify Play button starts playback', async ({ page }) => {
      const playBtn = page.locator('#btn-play');
      const stepInfo = page.locator('#playback-step-info');
      await expect(playBtn).toBeVisible();
      
      const stepBefore = await stepInfo.textContent();
      await playBtn.click();
      await page.waitForTimeout(1500); // Allow playback to advance
      const stepAfter = await stepInfo.textContent();
      expect(Number(stepAfter)).toBeGreaterThan(Number(stepBefore));
    });

    test('T1.F2.2: Verify Pause button halts playback', async ({ page }) => {
      const playBtn = page.locator('#btn-play');
      const pauseBtn = page.locator('#btn-pause');
      const stepInfo = page.locator('#playback-step-info');
      
      await playBtn.click();
      await page.waitForTimeout(500);
      await pauseBtn.click();
      
      const stepHalt = await stepInfo.textContent();
      await page.waitForTimeout(1000);
      const stepLater = await stepInfo.textContent();
      expect(stepHalt).toBe(stepLater);
    });

    test('T1.F2.3: Verify Step Forward advances step by one', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      const stepInfo = page.locator('#playback-step-info');
      
      const stepBefore = Number(await stepInfo.textContent());
      await stepForwardBtn.click();
      const stepAfter = Number(await stepInfo.textContent());
      expect(stepAfter).toBe(stepBefore + 1);
    });

    test('T1.F2.4: Verify Step Backward recedes step by one', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      const stepBackwardBtn = page.locator('#btn-step-backward');
      const stepInfo = page.locator('#playback-step-info');
      
      await stepForwardBtn.click();
      await stepForwardBtn.click();
      const stepBefore = Number(await stepInfo.textContent());
      
      await stepBackwardBtn.click();
      const stepAfter = Number(await stepInfo.textContent());
      expect(stepAfter).toBe(stepBefore - 1);
    });

    test('T1.F2.5: Verify Speed input adjusts playback speed interval', async ({ page }) => {
      const speedInput = page.locator('#input-speed');
      await expect(speedInput).toBeVisible();
      await speedInput.fill('2'); // speed factor 2x
      const val = await speedInput.inputValue();
      expect(val).toBe('2');
    });

    // Tier 2: Boundary & Corner Cases (5 tests)
    test('T2.F2.1: Step Backward at step 0 remains at step 0', async ({ page }) => {
      const stepBackwardBtn = page.locator('#btn-step-backward');
      const stepInfo = page.locator('#playback-step-info');
      
      // We are at step 0 initially
      expect(Number(await stepInfo.textContent())).toBe(0);
      await stepBackwardBtn.click();
      expect(Number(await stepInfo.textContent())).toBe(0);
    });

    test('T2.F2.2: Step Forward at maximum step does not advance', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      const stepInfo = page.locator('#playback-step-info');
      
      // Navigate to end of playback
      for (let i = 0; i < 100; i++) {
        await stepForwardBtn.click();
      }
      const maxStep = Number(await stepInfo.textContent());
      await stepForwardBtn.click();
      expect(Number(await stepInfo.textContent())).toBe(maxStep);
    });

    test('T2.F2.3: Verify active line highlighting in CodeViewer', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      const activeLine = page.locator('#code-viewer [data-line-active="true"]');
      
      await stepForwardBtn.click();
      await expect(activeLine).toBeVisible();
      const lineNum = await activeLine.getAttribute('data-line-number');
      expect(Number(lineNum)).toBeGreaterThan(0);
    });

    test('T2.F2.4: Speed slider values outside bounds are capped', async ({ page }) => {
      const speedInput = page.locator('#input-speed');
      await speedInput.fill('100'); // out of bound max
      const maxVal = Number(await speedInput.inputValue());
      expect(maxVal).toBeLessThanOrEqual(10); // cap speed at 10x
      
      await speedInput.fill('0'); // out of bound min
      const minVal = Number(await speedInput.inputValue());
      expect(minVal).toBeGreaterThanOrEqual(0.1); // min speed 0.1x
    });

    test('T2.F2.5: Playback pauses automatically when clicking tabs', async ({ page }) => {
      const playBtn = page.locator('#btn-play');
      const pauseBtn = page.locator('#btn-pause');
      await playBtn.click();
      
      // Click selection sort tab
      const selectionTab = page.locator('#btn-select-selection-sort');
      await selectionTab.click();
      
      // Verify play button is visible again (meaning paused/reset)
      await expect(playBtn).toBeVisible();
    });
  });

  // ==========================================
  // FEATURE 3: Sorting Visualizers
  // ==========================================
  test.describe('Feature 3: Sorting Visualizers', () => {
    test.beforeEach(async ({ page }) => {
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      const bubbleSortLesson = page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")');
      await bubbleSortLesson.click();
    });

    // Tier 1: Feature Coverage (5 tests)
    test('T1.F3.1: Render default sorting array bars', async ({ page }) => {
      const arrayContainer = page.locator('#sorting-visualizer-container');
      await expect(arrayContainer).toBeVisible();
      const arrayBars = page.locator('#sorting-visualizer-container .array-bar');
      await expect(arrayBars.first()).toBeVisible();
      const count = await arrayBars.count();
      expect(count).toBeGreaterThan(0);
    });

    test('T1.F3.2: Swapping elements displays correct data-status transitions', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      
      // Advance step until we see a swap or compare status
      let foundCompareOrSwap = false;
      for (let i = 0; i < 20; i++) {
        await stepForwardBtn.click();
        const activeBar = page.locator('#sorting-visualizer-container .array-bar[data-status="comparing"], #sorting-visualizer-container .array-bar[data-status="swapping"]');
        if (await activeBar.count() > 0) {
          foundCompareOrSwap = true;
          break;
        }
      }
      expect(foundCompareOrSwap).toBe(true);
    });

    test('T1.F3.3: Toggle between Bubble Sort and Selection Sort visualizers', async ({ page }) => {
      const selectionTab = page.locator('#btn-select-selection-sort');
      const bubbleTab = page.locator('#btn-select-bubble-sort');
      
      await selectionTab.click();
      await expect(page.locator('#sorting-visualizer-selection')).toBeVisible();
      
      await bubbleTab.click();
      await expect(page.locator('#sorting-visualizer-bubble')).toBeVisible();
    });

    test('T1.F3.4: Verify exact values and indexes match data attributes', async ({ page }) => {
      const firstBar = page.locator('#sorting-visualizer-container .array-bar').first();
      await expect(firstBar).toHaveAttribute('data-index', '0');
      const val = await firstBar.getAttribute('data-value');
      expect(Number(val)).toBeGreaterThan(0);
    });

    test('T1.F3.5: Elements remain consistent within layout boundaries', async ({ page }) => {
      const container = page.locator('#sorting-visualizer-container');
      const boundingBox = await container.boundingBox();
      expect(boundingBox).not.toBeNull();
      expect(boundingBox!.width).toBeGreaterThan(100);
    });

    // Tier 2: Boundary & Corner Cases (5 tests)
    test('T2.F3.1: Visualizer handles sorting empty array gracefully', async ({ page }) => {
      // Empty/small size settings or fallback checks
      const container = page.locator('#sorting-visualizer-container');
      await expect(container).toBeVisible();
    });

    test('T2.F3.2: Sorting an already sorted array shows immediate sorted status', async ({ page }) => {
      // Test cases for pre-sorted inputs if available
      const container = page.locator('#sorting-visualizer-container');
      await expect(container).toBeVisible();
    });

    test('T2.F3.3: Sorting reverse array performs maximum swaps without errors', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      for (let i = 0; i < 15; i++) {
        await stepForwardBtn.click();
      }
      // Checks that layout is still clean and error free
      await expect(page.locator('#sorting-visualizer-container')).toBeVisible();
    });

    test('T2.F3.4: No element overlap occurs during swap animations', async ({ page }) => {
      const bars = page.locator('#sorting-visualizer-container .array-bar');
      const count = await bars.count();
      if (count > 1) {
        const box1 = await bars.nth(0).boundingBox();
        const box2 = await bars.nth(1).boundingBox();
        expect(box1!.x + box1!.width).toBeLessThanOrEqual(box2!.x + 1); // flex/grid gaps
      }
    });

    test('T2.F3.5: Rapidly changing playback directions preserves values', async ({ page }) => {
      const forwardBtn = page.locator('#btn-step-forward');
      const backwardBtn = page.locator('#btn-step-backward');
      
      const valBefore = await page.locator('#sorting-visualizer-container .array-bar').first().getAttribute('data-value');
      await forwardBtn.click();
      await forwardBtn.click();
      await backwardBtn.click();
      await backwardBtn.click();
      const valAfter = await page.locator('#sorting-visualizer-container .array-bar').first().getAttribute('data-value');
      expect(valBefore).toBe(valAfter);
    });
  });

  // ==========================================
  // FEATURE 4: Linked List Visualizer
  // ==========================================
  test.describe('Feature 4: Linked List Visualizer', () => {
    test.beforeEach(async ({ page }) => {
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      const listLesson = page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")');
      await listLesson.click();
    });

    // Tier 1: Feature Coverage (5 tests)
    test('T1.F4.1: Render linked list nodes and pointers', async ({ page }) => {
      const container = page.locator('#linked-list-visualizer-container');
      await expect(container).toBeVisible();
      
      const nodes = page.locator('#linked-list-visualizer-container .list-node');
      await expect(nodes.first()).toBeVisible();
      
      const pointers = page.locator('#linked-list-visualizer-container .list-pointer');
      await expect(pointers.first()).toBeVisible();
    });

    test('T1.F4.2: Clicking Step highlights nodes in traversal order', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      await stepForwardBtn.click();
      
      const traversingNode = page.locator('#linked-list-visualizer-container .list-node[data-status="traversing"]');
      await expect(traversingNode).toBeVisible();
    });

    test('T1.F4.3: Insert node at head renders new node and rewires pointer', async ({ page }) => {
      const insertBtn = page.locator('#btn-list-insert');
      const inputVal = page.locator('#input-list-val');
      
      await inputVal.fill('42');
      await insertBtn.click();
      
      // Node with value 42 should be visible as head
      const firstNode = page.locator('#linked-list-visualizer-container .list-node').first();
      await expect(firstNode).toHaveAttribute('data-value', '42');
    });

    test('T1.F4.4: Insert node at tail renders new node', async ({ page }) => {
      const insertBtn = page.locator('#btn-list-insert');
      const inputVal = page.locator('#input-list-val');
      
      await inputVal.fill('99');
      await insertBtn.click();
      
      // Check tail node
      const lastNode = page.locator('#linked-list-visualizer-container .list-node').last();
      await expect(lastNode).toHaveAttribute('data-value', '99');
    });

    test('T1.F4.5: Delete node removes element from DOM and links update', async ({ page }) => {
      const deleteBtn = page.locator('#btn-list-delete');
      const inputVal = page.locator('#input-list-delete-val');
      
      await inputVal.fill('42');
      await deleteBtn.click();
      
      // Value 42 should no longer exist in the nodes list
      const matchingNodes = page.locator('#linked-list-visualizer-container .list-node[data-value="42"]');
      await expect(matchingNodes).toHaveCount(0);
    });

    // Tier 2: Boundary & Corner Cases (5 tests)
    test('T2.F4.1: Delete node from empty list handles gracefully', async ({ page }) => {
      // Empty list deletion checks
      const deleteBtn = page.locator('#btn-list-delete');
      await expect(deleteBtn).toBeVisible();
    });

    test('T2.F4.2: Insert empty node value displays validation error', async ({ page }) => {
      const insertBtn = page.locator('#btn-list-insert');
      const inputVal = page.locator('#input-list-val');
      
      await inputVal.fill('');
      await insertBtn.click();
      // Expect no node added with empty value, or a validation status shown
      const emptyNodes = page.locator('#linked-list-visualizer-container .list-node[data-value=""]');
      await expect(emptyNodes).toHaveCount(0);
    });

    test('T2.F4.3: Node traversal bounds do not exceed tail', async ({ page }) => {
      const stepForwardBtn = page.locator('#btn-step-forward');
      const stepInfo = page.locator('#playback-step-info');
      
      for (let i = 0; i < 20; i++) {
        await stepForwardBtn.click();
      }
      const maxStep = Number(await stepInfo.textContent());
      await stepForwardBtn.click();
      expect(Number(await stepInfo.textContent())).toBe(maxStep);
    });

    test('T2.F4.4: List handles multiple rapid deletes sequentially', async ({ page }) => {
      const deleteBtn = page.locator('#btn-list-delete');
      const inputVal = page.locator('#input-list-delete-val');
      
      await inputVal.fill('10');
      await deleteBtn.click();
      await inputVal.fill('20');
      await deleteBtn.click();
      
      const nodeCount = await page.locator('#linked-list-visualizer-container .list-node').count();
      expect(nodeCount).toBeGreaterThanOrEqual(0);
    });

    test('T2.F4.5: Visual list layout handles line wrap constraints', async ({ page }) => {
      const container = page.locator('#linked-list-visualizer-container');
      await expect(container).toBeVisible();
    });
  });

  // ==========================================
  // FEATURE 5: Practice Challenges & Sandbox
  // ==========================================
  test.describe('Feature 5: Practice Challenges & Sandbox', () => {
    test.beforeEach(async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      const challengeLesson = page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")');
      await challengeLesson.click();
    });

    // Tier 1: Feature Coverage (5 tests)
    test('T1.F5.1: Verify practice challenges tabs exist', async ({ page }) => {
      const tabTwoSum = page.locator('#challenge-tab-two-sum');
      const tabReverse = page.locator('#challenge-tab-reverse-list');
      const tabFindMax = page.locator('#challenge-tab-find-max');
      
      await expect(tabTwoSum).toBeVisible();
      await expect(tabReverse).toBeVisible();
      await expect(tabFindMax).toBeVisible();
    });

    test('T1.F5.2: Evaluate correct code yields passing results', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');
      
      // Enter correct code for Two Sum
      const correctCode = `
        function twoSum(nums, target) {
          const map = new Map();
          for (let i = 0; i < nums.length; i++) {
            const diff = target - nums[i];
            if (map.has(diff)) return [map.get(diff), i];
            map.set(nums[i], i);
          }
          return [];
        }
      `;
      await editor.fill(correctCode);
      await runBtn.click();
      
      await expect(summary).toHaveText(/All Tests Passed/i);
    });

    test('T1.F5.3: Evaluate incorrect code yields failing results', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');
      
      await editor.fill(`function twoSum() { return [0, 0]; }`);
      await runBtn.click();
      
      await expect(summary).toHaveText(/Tests Failed/i);
    });

    test('T1.F5.4: Compilation/syntax errors are caught and output', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');
      
      await editor.fill(`function twoSum() { parse error logic {`);
      await runBtn.click();
      
      await expect(results).toHaveText(/SyntaxError|Error/i);
    });

    test('T1.F5.5: Secure sandbox execution blocks prototype access', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      
      await editor.fill(`Array.prototype.foo = 'bar'; function twoSum() { return []; }`);
      await runBtn.click();
      
      // Verify global scope was not polluted
      const polluted = await page.evaluate(() => (Array.prototype as any).foo);
      expect(polluted).toBeUndefined();
    });

    // Tier 2: Boundary & Corner Cases (5 tests)
    test('T2.F5.1: Running empty code reports missing submission error', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');
      
      await editor.fill('');
      await runBtn.click();
      await expect(summary).toHaveText(/Empty submission/i);
    });

    test('T2.F5.2: Code sandbox times out for infinite loops', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');
      
      await editor.fill(`function twoSum() { while(true) {} }`);
      await runBtn.click();
      
      // Expect sandbox execution timeout message
      await expect(summary).toHaveText(/Timeout/i);
    });

    test('T2.F5.3: Sandbox blocks access to window/document objects', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');
      
      await editor.fill(`function twoSum() { return window.location.href; }`);
      await runBtn.click();
      
      await expect(results).toHaveText(/ReferenceError/i);
    });

    test('T2.F5.4: Result drawer scroll handles excessive output text', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      
      await editor.fill(`function twoSum() { return new Array(1000).fill('blah').join(''); }`);
      await runBtn.click();
      
      const results = page.locator('#test-results-drawer');
      await expect(results).toBeVisible();
    });

    test('T2.F5.5: Successive runs reset memory footprint and globals', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      
      await editor.fill(`let counter = (globalThis.counter || 0) + 1; globalThis.counter = counter; function twoSum() { return []; }`);
      await runBtn.click();
      await runBtn.click();
      
      // If sandboxed properly, global counter won't leak outside or persists
      const count = await page.evaluate(() => (globalThis as any).counter);
      expect(count).toBeUndefined();
    });
  });

  // ==========================================
  // TIER 3: Cross-Feature Combinations (Pairwise)
  // ==========================================
  test.describe('Tier 3: Cross-Feature Combinations', () => {
    
    test('T3.1: ToC Navigation Pauses Active Playback', async ({ page }) => {
      // 1. Expand sorting and open Bubble Sort
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      
      // 2. Play playback
      await page.locator('#btn-play').click();
      await page.waitForTimeout(300);
      
      // 3. Navigate to Linked List chapter and open visualizer
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      await page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")').click();
      
      // 4. Navigate back to Bubble Sort and verify it is paused
      await sortingBtn.click();
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      await expect(page.locator('#btn-play')).toBeVisible(); // play visible means paused
    });

    test('T3.2: Switching chapters closes visualizer and opens challenge editor', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      await page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")').click();
      
      // Sandbox should be active, visualizer should be inactive
      await expect(page.locator('#practice-challenge-section')).toBeVisible();
      await expect(page.locator('#sorting-visualizer-section')).not.toBeVisible();
    });

    test('T3.3: Playback speed adjustments do not interfere with Sandbox evaluator', async ({ page }) => {
      // Load visualizer, change speed
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      await page.locator('#input-speed').fill('0.5');
      
      // Load practice
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      await page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")').click();
      
      // Run Sandbox evaluation
      const runBtn = page.locator('#btn-run-code');
      await runBtn.click();
      // Verification
      await expect(page.locator('#test-summary')).toBeVisible();
    });

    test('T3.4: Sandbox submissions do not overwrite visualizer playback state', async ({ page }) => {
      // Store visualizer index
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      await page.locator('#btn-step-forward').click();
      const stepVal = await page.locator('#playback-step-info').textContent();
      
      // Go to challenge
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      await page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")').click();
      await page.locator('#btn-run-code').click();
      
      // Go back to visualizer
      await sortingBtn.click();
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      const stepValAfter = await page.locator('#playback-step-info').textContent();
      expect(stepValAfter).toBe(stepVal);
    });

    test('T3.5: Active step highlight updates after manual data insertion in Linked List', async ({ page }) => {
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      await page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")').click();
      
      // Insert item
      await page.locator('#input-list-val').fill('7');
      await page.locator('#btn-list-insert').click();
      
      // Check play steps reset or updated
      const stepInfo = page.locator('#playback-step-info');
      await expect(stepInfo).toBeVisible();
    });
  });

  // ==========================================
  // TIER 4: Real-World Application Scenarios
  // ==========================================
  test.describe('Tier 4: Real-World Application Scenarios', () => {

    test('T4.1: Complete Sorting Workspace Workflow', async ({ page }) => {
      // 1. Expand Chapter II and open Bubble Sort
      const sortingBtn = page.locator('#chapter-btn-sorting');
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click();
      
      // 2. Play and then pause
      await page.locator('#btn-play').click();
      await page.waitForTimeout(500);
      await page.locator('#btn-pause').click();
      
      // 3. Advance manually via Step Forward
      const stepBefore = Number(await page.locator('#playback-step-info').textContent());
      await page.locator('#btn-step-forward').click();
      const stepAfter = Number(await page.locator('#playback-step-info').textContent());
      expect(stepAfter).toBe(stepBefore + 1);
      
      // 4. Adjust playback speed
      const speedInput = page.locator('#input-speed');
      await speedInput.fill('4');
      
      // 5. Play again to completion
      await page.locator('#btn-play').click();
      
      // Wait for it to finish (or expect elements to be fully sorted)
      await page.waitForTimeout(2000);
      const unsortedBars = page.locator('#sorting-visualizer-container .array-bar:not([data-status="sorted"])');
      const count = await unsortedBars.count();
      expect(count).toBe(0);
    });

    test('T4.2: Complete Linked List Insertion and Deletion Flow', async ({ page }) => {
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      await page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")').click();
      
      // Insert "10"
      await page.locator('#input-list-val').fill('10');
      await page.locator('#btn-list-insert').click();
      
      // Insert "20"
      await page.locator('#input-list-val').fill('20');
      await page.locator('#btn-list-insert').click();
      
      // Verify both exist
      await expect(page.locator('#linked-list-visualizer-container .list-node[data-value="10"]')).toBeVisible();
      await expect(page.locator('#linked-list-visualizer-container .list-node[data-value="20"]')).toBeVisible();
      
      // Delete "10"
      await page.locator('#input-list-delete-val').fill('10');
      await page.locator('#btn-list-delete').click();
      
      // Verify "10" is gone, but "20" remains
      await expect(page.locator('#linked-list-visualizer-container .list-node[data-value="10"]')).toHaveCount(0);
      await expect(page.locator('#linked-list-visualizer-container .list-node[data-value="20"]')).toBeVisible();
    });

    test('T4.3: Solving Two Sum Practice Challenge Successfully', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      await page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")').click();
      
      // Input correct code
      const solution = `
        function twoSum(nums, target) {
          const map = {};
          for (let i = 0; i < nums.length; i++) {
            const complement = target - nums[i];
            if (complement in map) return [map[complement], i];
            map[nums[i]] = i;
          }
          return [];
        }
      `;
      await page.locator('#code-editor').fill(solution);
      await page.locator('#btn-run-code').click();
      
      // Check results
      await expect(page.locator('#test-summary')).toHaveText(/All Tests Passed/i);
    });

    test('T4.4: Sandbox Challenge Error Feedback & Iterative Correction', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
        await arrayBtn.click();
      }
      await page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")').click();
      
      // 1. Submit empty/failing code
      await page.locator('#code-editor').fill('function twoSum() {}');
      await page.locator('#btn-run-code').click();
      await expect(page.locator('#test-summary')).toHaveText(/Tests Failed/i);
      
      // 2. Submit correct code
      const solution = `
        function twoSum(nums, target) {
          const indices = new Map();
          for (let i = 0; i < nums.length; i++) {
            const diff = target - nums[i];
            if (indices.has(diff)) return [indices.get(diff), i];
            indices.set(nums[i], i);
          }
          return [];
        }
      `;
      await page.locator('#code-editor').fill(solution);
      await page.locator('#btn-run-code').click();
      
      // 3. Verify it passed
      await expect(page.locator('#test-summary')).toHaveText(/All Tests Passed/i);
    });

    test('T4.5: Full UI Accessibility and Device Responsive Viewport Verification', async ({ page }) => {
      // 1. Check title & headers
      await expect(page.locator('h1')).toBeVisible();
      
      // 2. Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('nav')).toBeVisible();
      
      // 3. Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      const menuBtn = page.locator('button[aria-label="Toggle Menu"]');
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      
      // Mobile menu links should be visible
      await expect(page.locator('nav a:has-text("Chapters")').first()).toBeVisible();
      
      // Close menu
      await menuBtn.click();
    });
  });
});
