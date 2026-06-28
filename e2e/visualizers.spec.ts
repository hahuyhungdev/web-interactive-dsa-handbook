import { test, expect } from '@playwright/test';

// Capture console messages and errors
const setupConsoleLogging = (page: any, pageName: string) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg: any) => {
    const text = msg.text();
    logs.push(`[${pageName}] [${msg.type().toUpperCase()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(`[${pageName}] [CONSOLE ERROR] ${text}`);
    }
  });

  page.on('pageerror', (err: any) => {
    errors.push(`[${pageName}] [ERROR] ${err.message}`);
  });

  return { logs, errors };
};

test.describe('DSA Visualizers Interactive E2E Tests', () => {

  test('1. Playback Controls on /sorting', async ({ page }) => {
    const { errors } = setupConsoleLogging(page, 'Playback');
    await page.goto('/sorting');
    await page.waitForLoadState('networkidle');

    const stepInfo = page.locator('#playback-step-info');
    await expect(stepInfo).toBeVisible();

    // Verify initial step is 0
    await expect(stepInfo).toHaveText('0');

    // 1.1 Verify step forward and backward buttons
    const btnStepForward = page.locator('#btn-step-forward');
    const btnStepBackward = page.locator('#btn-step-backward');
    const btnPlay = page.locator('#btn-play');
    const btnPause = page.locator('#btn-pause');
    const btnReset = page.locator('#btn-reset');
    const inputSpeed = page.locator('#input-speed');

    await btnStepForward.click();
    await expect(stepInfo).toHaveText('1');

    await btnStepForward.click();
    await expect(stepInfo).toHaveText('2');

    await btnStepBackward.click();
    await expect(stepInfo).toHaveText('1');

    // 1.2 Verify play and pause functionality
    // Set speed to 3 so steps increment quickly enough to verify pausing
    await inputSpeed.fill('3');
    await inputSpeed.press('Enter');

    await btnPlay.click();
    await expect(btnPause).toBeVisible();
    await expect(btnPlay).not.toBeVisible();

    // Wait a bit for steps to increment
    await page.waitForTimeout(600);
    await btnPause.click();
    await expect(btnPlay).toBeVisible();

    const pausedStep = parseInt(await stepInfo.innerText(), 10);
    expect(pausedStep).toBeGreaterThan(1);

    // Wait and verify it stopped incrementing
    await page.waitForTimeout(400);
    const stoppedStep = parseInt(await stepInfo.innerText(), 10);
    expect(stoppedStep).toBe(pausedStep);

    // 1.3 Verify resetting the playback state
    await btnReset.click();
    await expect(stepInfo).toHaveText('0');

    // 1.4 Verify speed slider and values
    await inputSpeed.fill('2');
    await inputSpeed.press('Enter');
    await expect(inputSpeed).toHaveValue('2');

    // Reset back to 1 for consistency
    await inputSpeed.fill('1');
    await inputSpeed.press('Enter');
    await inputSpeed.blur();

    // 1.5 Verify hotkeys
    // Space to play
    await page.keyboard.press('Space');
    await expect(btnPause).toBeVisible();
    await page.waitForTimeout(300);
    // Space to pause
    await page.keyboard.press('Space');
    await expect(btnPlay).toBeVisible();
    const hotkeyPausedStep = parseInt(await stepInfo.innerText(), 10);

    // ArrowRight to step forward
    await page.keyboard.press('ArrowRight');
    await expect(stepInfo).toHaveText(String(hotkeyPausedStep + 1));

    // ArrowLeft to step backward
    await page.keyboard.press('ArrowLeft');
    await expect(stepInfo).toHaveText(String(hotkeyPausedStep));

    // End to jump to end
    await page.keyboard.press('End');
    const lastStepText = await stepInfo.innerText();
    expect(parseInt(lastStepText, 10)).toBeGreaterThan(0);

    // Home to jump to start (0)
    await page.keyboard.press('Home');
    await expect(stepInfo).toHaveText('0');

    // R to reset
    await page.keyboard.press('ArrowRight');
    await expect(stepInfo).toHaveText('1');
    await page.keyboard.press('r');
    await expect(stepInfo).toHaveText('0');

    expect(errors).toEqual([]);
  });

  test('2. Sorting Visualizer Algorithms & Execution', async ({ page }) => {
    const { errors } = setupConsoleLogging(page, 'Sorting');
    await page.goto('/sorting');
    await page.waitForLoadState('networkidle');

    // 2.1 Verify selecting different sorting algorithms renders their views
    const algos = ['bubble', 'selection', 'insertion', 'quick', 'merge'];
    for (const algo of algos) {
      const tabBtn = page.locator(`#btn-select-${algo}-sort`);
      await expect(tabBtn).toBeVisible();
      await tabBtn.click();
      await page.waitForTimeout(200);

      // Verify the visualizer container specific to that algo is visible
      const visualizerSub = page.locator(`#sorting-visualizer-${algo}`);
      await expect(visualizerSub).toBeVisible();
    }

    // Switch back to bubble sort
    await page.locator('#btn-select-bubble-sort').click();
    await page.waitForTimeout(200);

    // 2.2 Verify playing a sort execution updates array bar statuses and syncs CodeViewer active line
    const container = page.locator('#sorting-visualizer-container');
    await expect(container).toBeVisible();

    const arrayBars = container.locator('[data-element-type="array-item"]');
    const barCount = await arrayBars.count();
    expect(barCount).toBeGreaterThan(0);

    // Initial statuses
    for (let i = 0; i < barCount; i++) {
      const status = await arrayBars.nth(i).getAttribute('data-status');
      expect(status).toBe('default');
    }

    // Step forward, check status change
    const btnStepForward = page.locator('#btn-step-forward');
    
    // We step forward until we see comparing/swapping/sorted status or just check after several steps
    let hasUpdatedStatus = false;
    let codeViewerHasActiveLine = false;

    for (let step = 0; step < 15; step++) {
      await btnStepForward.click();
      await page.waitForTimeout(50);

      // Check if any bar is comparing or swapping or pivot
      for (let i = 0; i < barCount; i++) {
        const status = await arrayBars.nth(i).getAttribute('data-status');
        if (status && status !== 'default') {
          hasUpdatedStatus = true;
        }
      }

      // Check if code viewer has highlighted active line
      const activeLine = page.locator('#code-viewer .code-line-active');
      if (await activeLine.count() > 0) {
        codeViewerHasActiveLine = true;
      }
    }

    expect(hasUpdatedStatus).toBe(true);
    expect(codeViewerHasActiveLine).toBe(true);

    expect(errors).toEqual([]);
  });

  test('3. Linked List Visualizer Operations', async ({ page }) => {
    const { errors } = setupConsoleLogging(page, 'LinkedList');
    await page.goto('/linked-list');
    await page.waitForLoadState('networkidle');

    // 3.1 Verify inserting nodes at head
    const inputVal = page.locator('#input-list-val');
    const selectPos = page.locator('#select-list-position');
    const btnInsert = page.locator('#btn-list-insert');
    const listContainer = page.locator('#linked-list-visualizer-container');

    // Insert '99' at head
    await inputVal.fill('99');
    await selectPos.selectOption('head');
    await btnInsert.click();
    await page.waitForTimeout(500); // let transition play/pause

    // Playback handles insertion, let's step to the end or click Play to finish
    await page.locator('#btn-play').click();
    await page.waitForTimeout(2000); // wait for insertion animation to complete

    // Verify '99' is at index 0 (the head)
    const firstNode = listContainer.locator('.list-node').first();
    await expect(firstNode).toHaveAttribute('data-value', '99');

    // Insert '100' at tail
    await inputVal.fill('100');
    await selectPos.selectOption('tail');
    await btnInsert.click();
    await page.waitForTimeout(500);
    await page.locator('#btn-play').click();
    await page.waitForTimeout(2000);

    const lastNode = listContainer.locator('.list-node').last();
    await expect(lastNode).toHaveAttribute('data-value', '100');

    // Insert '50' at index 1
    await inputVal.fill('50');
    await selectPos.selectOption('index');
    const inputIndex = page.locator('#input-list-index');
    await inputIndex.fill('1');
    await btnInsert.click();
    await page.waitForTimeout(500);
    await page.locator('#btn-play').click();
    await page.waitForTimeout(2500);

    const secondNode = listContainer.locator('.list-node').nth(1);
    await expect(secondNode).toHaveAttribute('data-value', '50');

    // 3.2 Verify deleting a node triggers the delete animation and removes the node
    const inputDeleteVal = page.locator('#input-list-delete-val');
    const btnDelete = page.locator('#btn-list-delete');

    // Delete '50'
    await inputDeleteVal.fill('50');
    await btnDelete.click();
    await page.waitForTimeout(300);

    // Verify there is a node with status 'deleted' or 'traversing' during delete execution
    let hasDeleteAnimationState = false;

    // Step through the deletion process to see the traversal or delete status
    const btnStepForward = page.locator('#btn-step-forward');
    for (let step = 0; step < 10; step++) {
      await btnStepForward.click();
      await page.waitForTimeout(100);
      const statuses = await listContainer.locator('.list-node').evaluateAll(
        elements => elements.map(el => el.getAttribute('data-status'))
      );
      if (statuses.some(status => status === 'deleted' || status === 'traversing')) {
        hasDeleteAnimationState = true;
      }
    }
    expect(hasDeleteAnimationState).toBe(true);

    // Let it run to the end, verifying the node is removed
    await page.locator('#btn-play').click();
    await page.waitForTimeout(1500);

    const postDeleteNodes = listContainer.locator('.list-node');
    const postCount = await postDeleteNodes.count();
    for (let i = 0; i < postCount; i++) {
      const val = await postDeleteNodes.nth(i).getAttribute('data-value');
      expect(val).not.toBe('50');
    }

    // 3.3 Verify finding a node triggers traversal search animation
    const inputFindVal = page.locator('#input-list-find-val');
    const btnFind = page.locator('#btn-list-find');

    // Find '30'
    await inputFindVal.fill('30');
    await btnFind.click();
    await page.waitForTimeout(50);

    let hasTraversingState = false;
    for (let step = 0; step < 8; step++) {
      await btnStepForward.click();
      await page.waitForTimeout(100);
      const findStatuses = await listContainer.locator('.list-node').evaluateAll(
        elements => elements.map(el => el.getAttribute('data-status'))
      );
      if (findStatuses.some(status => status === 'traversing' || status === 'active')) {
        hasTraversingState = true;
      }
    }
    expect(hasTraversingState).toBe(true);

    expect(errors).toEqual([]);
  });

  test('4. Stack & Queue Visualizer Operations', async ({ page }) => {
    const { errors } = setupConsoleLogging(page, 'StackQueue');
    await page.goto('/stack-queue');
    await page.waitForLoadState('networkidle');

    // 4.1 Verify Stack push and pop operations
    // Select Stack mode
    await page.locator('#btn-select-stack').click();
    await page.waitForTimeout(200);

    // Default frames in generateStackPushPopFrames step through stack push/pop
    const stepInfo = page.locator('#playback-step-info');
    const container = page.locator('#sq-visualizer-stack');
    await expect(container).toBeVisible();

    // Step 0: init
    await expect(stepInfo).toHaveText('0');
    await expect(container).toContainText('Empty Stack');

    // Step 1: push(10)
    const btnStepForward = page.locator('#btn-step-forward');
    await btnStepForward.click();
    await expect(stepInfo).toHaveText('1');
    const stackElements = container.locator('[data-value="10"]');
    await expect(stackElements).toBeVisible();
    await expect(stackElements).toHaveAttribute('data-status', 'added');

    // Step 2: settle
    await btnStepForward.click();
    await expect(stackElements).toHaveAttribute('data-status', 'default');

    // Step forward to index 8 (empty check / 30 removing)
    for (let step = 2; step < 8; step++) {
      await btnStepForward.click();
    }
    await expect(stepInfo).toHaveText('8');
    // Verify 30 has status 'removing'
    const popElement = container.locator('[data-value="30"]');
    await expect(popElement).toHaveAttribute('data-status', 'removing');

    // Step forward to index 9
    await btnStepForward.click();
    await expect(stepInfo).toHaveText('9');
    // Verify 30 is no longer present in the stack
    await expect(container.locator('[data-value="30"]')).not.toBeVisible();

    // 4.2 Verify Queue enqueue and dequeue operations
    // Select Queue mode
    await page.locator('#btn-select-queue').click();
    await page.waitForTimeout(200);

    const qContainer = page.locator('#sq-visualizer-queue');
    await expect(qContainer).toBeVisible();
    await expect(stepInfo).toHaveText('0');
    await expect(qContainer).toContainText('Empty Queue');

    // Step forward to step 1: enqueue(10)
    await btnStepForward.click();
    await expect(stepInfo).toHaveText('1');
    const qElements = qContainer.locator('[data-value="10"]');
    await expect(qElements).toBeVisible();
    await expect(qElements).toHaveAttribute('data-status', 'added');

    // Step forward to step 8: dequeue (10 removing)
    for (let step = 1; step < 8; step++) {
      await btnStepForward.click();
    }
    await expect(stepInfo).toHaveText('8');
    await expect(qElements).toHaveAttribute('data-status', 'removing');

    // Step forward to step 9: 10 removed
    await btnStepForward.click();
    await expect(stepInfo).toHaveText('9');
    await expect(qContainer.locator('[data-value="10"]')).not.toBeVisible();

    expect(errors).toEqual([]);
  });

});
