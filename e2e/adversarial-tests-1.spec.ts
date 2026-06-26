import { test, expect } from '@playwright/test';

test.describe('Adversarial Test Suite - Visualizers & UI', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app homepage
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // 1. Linked List Visualizer: Empty/Boundary values, Insertions, Deletions
  // =========================================================================
  test.describe('Linked List Visualizer - Adversarial Cases', () => {
    test.beforeEach(async ({ page }) => {
      // Open Singly Linked List Visualizer
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      await expect(listsBtn).toBeVisible();
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      const listLesson = page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")');
      await expect(listLesson).toBeVisible();
      await listLesson.click();
      await expect(page.locator('#linked-list-visualizer-container')).toBeVisible();
    });

    test('Empty/whitespace input validation on insert', async ({ page }) => {
      const insertInput = page.locator('#input-list-val');
      const insertBtn = page.locator('#btn-list-insert');
      const warning = page.locator('#list-validation-warning');

      // Check validation on completely empty input
      await insertInput.fill('');
      await insertBtn.click();
      await expect(warning).toHaveText('Value cannot be empty');

      // Check validation on whitespace-only input
      await insertInput.fill('   ');
      await insertBtn.click();
      await expect(warning).toHaveText('Value cannot be empty');

      // Typing a valid character should clear the warning
      await insertInput.fill('A');
      await expect(warning).not.toBeVisible();
    });

    test('Special inputs: prepend via "42" and standard append', async ({ page }) => {
      const insertInput = page.locator('#input-list-val');
      const insertBtn = page.locator('#btn-list-insert');

      // Initial list nodes: "15", "30", "45"
      // Prepend "42"
      await insertInput.fill('42');
      await insertBtn.click();

      // First node should now be "42"
      const firstNode = page.locator('#linked-list-visualizer-container .list-node').first();
      await expect(firstNode).toHaveAttribute('data-value', '42');

      // Append "99" (standard behavior)
      await insertInput.fill('99');
      await insertBtn.click();

      // Last node should now be "99"
      const lastNode = page.locator('#linked-list-visualizer-container .list-node').last();
      await expect(lastNode).toHaveAttribute('data-value', '99');
    });

    test('Graceful handling of deleting non-existent values', async ({ page }) => {
      const deleteInput = page.locator('#input-list-delete-val');
      const deleteBtn = page.locator('#btn-list-delete');

      const initialCount = await page.locator('#linked-list-visualizer-container .list-node').count();

      // Try deleting a value that is not in the list
      await deleteInput.fill('nonexistent');
      await deleteBtn.click();

      // List length should remain unchanged
      const newCount = await page.locator('#linked-list-visualizer-container .list-node').count();
      expect(newCount).toBe(initialCount);

      // The input field should NOT be cleared if deletion did not happen (as per source code)
      await expect(deleteInput).toHaveValue('nonexistent');
    });

    test('Empty list transition, traversal, and boundary checks', async ({ page }) => {
      const deleteInput = page.locator('#input-list-delete-val');
      const deleteBtn = page.locator('#btn-list-delete');
      const container = page.locator('#linked-list-visualizer-container');

      // The list starts with 3 elements: "15", "30", "45"
      // Delete all three elements
      for (const val of ['15', '30', '45']) {
        await deleteInput.fill(val);
        await deleteBtn.click();
      }

      // Verify the list displays "Empty Linked List" placeholder
      await expect(container).toHaveText('Empty Linked List');
      await expect(page.locator('#linked-list-visualizer-container .list-node')).toHaveCount(0);

      // Verify that traversal works correctly on empty list
      const playBtn = page.locator('#btn-play');
      const stepInfo = page.locator('#playback-step-info');
      const activeCodeLine = page.locator('#code-viewer [data-line-active="true"]');

      // At step 0, line 2 should be highlighted (let current = head;)
      expect(Number(await stepInfo.textContent())).toBe(0);
      await expect(activeCodeLine).toHaveAttribute('data-line-number', '2');

      // Play to completion (should take 2 steps since empty frames has size 2)
      await playBtn.click();
      await page.waitForTimeout(500);

      // Playback should stop automatically at step 1
      expect(Number(await stepInfo.textContent())).toBe(1);
      // Play button should be visible again (meaning paused/ended)
      await expect(playBtn).toBeVisible();
      // Final frame has highlighted line 8
      const finalCodeLine = page.locator('#code-viewer [data-line-active="true"]');
      await expect(finalCodeLine).toHaveAttribute('data-line-number', '8');
    });

    test('Rapid insertions and node ID collision avoidance', async ({ page }) => {
      const insertInput = page.locator('#input-list-val');
      const insertBtn = page.locator('#btn-list-insert');

      // Rapidly insert 5 values sequentially
      const vals = ['V1', 'V2', 'V3', 'V4', 'V5'];
      for (const val of vals) {
        await insertInput.fill(val);
        await insertBtn.click();
      }

      // Ensure all inserted values are visible in the DOM
      for (const val of vals) {
        const node = page.locator(`#linked-list-visualizer-container .list-node[data-value="${val}"]`);
        await expect(node).toBeVisible();
      }

      // Check total node count is 3 (default) + 5 = 8
      const totalNodes = page.locator('#linked-list-visualizer-container .list-node');
      await expect(totalNodes).toHaveCount(8);
    });
  });

  // =========================================================================
  // 2. Playback Controls & Speed Inputs (Sorting Visualizer)
  // =========================================================================
  test.describe('Playback & Speed Inputs - Adversarial Cases', () => {
    test.beforeEach(async ({ page }) => {
      // Open Bubble Sort Visualizer
      const sortingBtn = page.locator('#chapter-btn-sorting');
      await expect(sortingBtn).toBeVisible();
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      const bubbleSortLesson = page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")');
      await expect(bubbleSortLesson).toBeVisible();
      await bubbleSortLesson.click();
      await expect(page.locator('#sorting-visualizer-container')).toBeVisible();
    });

    test('Speed input bounding: high value is capped', async ({ page }) => {
      const speedInput = page.locator('#input-speed');
      await speedInput.fill('150'); // Exceeds max 10
      await speedInput.press('Enter');

      // The field value gets capped at 10
      await expect(speedInput).toHaveValue('10');
    });

    test('Speed input bounding: negative or low value is capped', async ({ page }) => {
      const speedInput = page.locator('#input-speed');

      await speedInput.fill('-5'); // Under min 0.1
      await speedInput.press('Enter');
      await expect(speedInput).toHaveValue('0.1');

      await speedInput.fill('0.02'); // Under min 0.1
      await speedInput.press('Enter');
      await expect(speedInput).toHaveValue('0.1');
    });

    test('Speed input bounding: empty or non-numeric blurs to default 1', async ({ page }) => {
      const speedInput = page.locator('#input-speed');

      // Fill empty
      await speedInput.fill('');
      await speedInput.blur(); // Trigger onBlur

      await expect(speedInput).toHaveValue('1');

      // For non-numeric text, focus and type to bypass Playwright's fill validation
      await speedInput.focus();
      await page.keyboard.type('abc');
      await speedInput.blur();

      await expect(speedInput).toHaveValue('1');
    });

    test('Switching tabs/sub-visualizers mid-playback pauses and resets', async ({ page }) => {
      const playBtn = page.locator('#btn-play');
      const stepInfo = page.locator('#playback-step-info');

      // 1. Start playback on Bubble Sort
      await playBtn.click();
      await page.waitForTimeout(300); // let it advance
      
      const stepValue = Number(await stepInfo.textContent());
      expect(stepValue).toBeGreaterThan(0);

      // 2. Click Selection Sort tab mid-playback
      const selectionTab = page.locator('#btn-select-selection-sort');
      await selectionTab.click();

      // 3. Verify it is paused (play button visible again) and reset (step = 0)
      await expect(playBtn).toBeVisible();
      await expect(stepInfo).toHaveText('0');
    });

    test('Switching lessons via ToC mid-playback pauses', async ({ page }) => {
      const playBtn = page.locator('#btn-play');

      // 1. Play
      await playBtn.click();
      await page.waitForTimeout(300);

      // 2. Switch lesson in ToC to Singly Linked List
      const listsBtn = page.locator('#chapter-btn-linked-lists');
      if (await listsBtn.getAttribute('aria-expanded') !== 'true') {
        await listsBtn.click();
      }
      await page.locator('#chapter-panel-linked-lists [role="button"]:has-text("Singly Linked List Visualizer")').click({ force: true });

      // 3. Return to Bubble Sort
      await page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")').click({ force: true });

      // 4. Verify it was paused
      await expect(playBtn).toBeVisible();
    });

    test('Rapid step forward and step backward transitions without crash', async ({ page }) => {
      const stepForward = page.locator('#btn-step-forward');
      const stepBackward = page.locator('#btn-step-backward');
      const stepInfo = page.locator('#playback-step-info');

      // Perform 15 step forwards rapidly
      for (let i = 0; i < 15; i++) {
        await stepForward.click();
      }
      let stepValue = Number(await stepInfo.textContent());
      expect(stepValue).toBe(15);

      // Perform 10 step backwards rapidly
      for (let i = 0; i < 10; i++) {
        await stepBackward.click();
      }
      stepValue = Number(await stepInfo.textContent());
      expect(stepValue).toBe(5);

      // Verify that code viewer is active and highlights correctly
      const activeLine = page.locator('#code-viewer [data-line-active="true"]');
      await expect(activeLine).toBeVisible();
    });
  });

  // =========================================================================
  // 3. Visual State Updates in DOM Elements (Sorting Visualizer)
  // =========================================================================
  test.describe('Visual State DOM Updates', () => {
    test.beforeEach(async ({ page }) => {
      // Open Bubble Sort
      const sortingBtn = page.locator('#chapter-btn-sorting');
      await expect(sortingBtn).toBeVisible();
      if (await sortingBtn.getAttribute('aria-expanded') !== 'true') {
        await sortingBtn.click();
      }
      const bubbleSortLesson = page.locator('#chapter-panel-sorting [role="button"]:has-text("Bubble Sort Visualizer")');
      await expect(bubbleSortLesson).toBeVisible();
      await bubbleSortLesson.click();
      await expect(page.locator('#sorting-visualizer-container')).toBeVisible();
    });

    test('Array bars and CodeViewer highlight sync during step execution', async ({ page }) => {
      const stepForward = page.locator('#btn-step-forward');
      const stepInfo = page.locator('#playback-step-info');

      let foundComparing = false;
      let foundSwapping = false;

      // Step forward until we find comparing and swapping states
      for (let i = 0; i < 30; i++) {
        await stepForward.click();
        const currentStep = Number(await stepInfo.textContent());

        // Check if any bar is in 'comparing' state
        const comparingBar = page.locator('#sorting-visualizer-container .array-bar[data-status="comparing"]');
        if (await comparingBar.count() > 0) {
          foundComparing = true;
          // Verify that comparing state corresponds to line 6 in CodeViewer (Comparing elements)
          const activeLine = page.locator('#code-viewer [data-line-active="true"]');
          await expect(activeLine).toHaveAttribute('data-line-number', '6');
        }

        // Check if any bar is in 'swapping' state
        const swappingBar = page.locator('#sorting-visualizer-container .array-bar[data-status="swapping"]');
        if (await swappingBar.count() > 0) {
          foundSwapping = true;
          // Verify that swapping state corresponds to line 8 or 10 in CodeViewer (Swapping/swap call)
          const activeLine = page.locator('#code-viewer [data-line-active="true"]');
          const lineNum = Number(await activeLine.getAttribute('data-line-number'));
          expect(lineNum === 8 || lineNum === 10).toBe(true);
        }

        if (foundComparing && foundSwapping) break;
      }

      expect(foundComparing).toBe(true);
      expect(foundSwapping).toBe(true);
    });
  });

  // =========================================================================
  // 4. UI Components (Navbar, TableOfContents)
  // =========================================================================
  test.describe('UI Components - Adversarial Cases', () => {
    test('Mobile navbar toggle menu closes on link click', async ({ page }) => {
      // Set to mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const menuToggle = page.locator('button[aria-label="Toggle Menu"]');
      const mobilePanel = page.locator('nav .animate-fade-in');

      // Click menu toggle to open
      await menuToggle.click();
      await expect(mobilePanel).toBeVisible();

      // Click a link inside the mobile panel (e.g. Chapters) using .first() to avoid strict-mode ambiguity
      const chaptersLink = page.locator('nav .animate-fade-in a[href="#handbook"]').first();
      await chaptersLink.click();

      // Mobile panel should close automatically
      await expect(mobilePanel).not.toBeVisible();
    });

    test('Table of Contents exclusive accordion expansion', async ({ page }) => {
      const arrayBtn = page.locator('#chapter-btn-arrays');
      const sortingBtn = page.locator('#chapter-btn-sorting');
      const listsBtn = page.locator('#chapter-btn-linked-lists');

      // 1. Initial State: sorting is expanded, others collapsed
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(listsBtn).toHaveAttribute('aria-expanded', 'false');

      // 2. Expand Arrays chapter
      await arrayBtn.click();

      // 3. Verify Arrays is expanded, Sorting is collapsed
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'true');
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(listsBtn).toHaveAttribute('aria-expanded', 'false');

      // 4. Collapse Arrays chapter (so all are collapsed)
      await arrayBtn.click();
      await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');
      await expect(listsBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
