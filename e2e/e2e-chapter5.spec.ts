import { test, expect } from '@playwright/test';

test.describe('Chapter 5: Binary Search Tree Visualizer', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://localhost:5173/chapters/tree');
  });

  test('should render visualizer interface', async ({ page }) => {
    // Check main title
    await expect(page.locator('h2:has-text("Binary Search Tree Visualizer")')).toBeVisible();

    // Check operation tabs
    await expect(page.locator('#btn-tree-op-insert')).toBeVisible();
    await expect(page.locator('#btn-tree-op-search')).toBeVisible();
    await expect(page.locator('#btn-tree-op-inorder')).toBeVisible();
    await expect(page.locator('#btn-tree-op-preorder')).toBeVisible();
    await expect(page.locator('#btn-tree-op-postorder')).toBeVisible();

    // Check basic controls
    await expect(page.locator('#tree-input')).toBeVisible();
    await expect(page.locator('#btn-tree-run')).toBeVisible();
    await expect(page.locator('#btn-tree-reset')).toBeVisible();
  });

  test('should run BST Insert animation successfully', async ({ page }) => {
    // Type 45 into input
    await page.locator('#tree-input').fill('45');
    
    // Click RUN INSERT
    await page.locator('#btn-tree-run').click();

    // Wait for the playback controls step progress to update
    await expect(page.locator('#playback-step-info')).toHaveText('6', { timeout: 10000 });
  });

  test('should run BST Search animation successfully', async ({ page }) => {
    // Switch to search tab
    await page.locator('#btn-tree-op-search').click();

    // Type 30 into search input
    await page.locator('#tree-input').fill('30');

    // Click RUN SEARCH
    await page.locator('#btn-tree-run').click();

    // Wait for playback steps to register and play
    await expect(page.locator('#playback-step-info')).toHaveText('4', { timeout: 10000 });
  });

  test('should run BST Traversals successfully', async ({ page }) => {
    // Switch to In-Order tab
    await page.locator('#btn-tree-op-inorder').click();

    // Click RUN TRAVERSAL
    await page.locator('#btn-tree-run-traversal').click();

    // Wait for playback steps to register and play
    await expect(page.locator('#playback-step-info')).toHaveText('10', { timeout: 10000 });
  });

  test('should reset the BST successfully', async ({ page }) => {
    // Fill input and run insertion to generate frames
    await page.locator('#tree-input').fill('45');
    await page.locator('#btn-tree-run').click();

    // Click Reset Tree
    await page.locator('#btn-tree-reset').click();

    // Verify input value is cleared and step count is reset to 0 / 0
    await expect(page.locator('#tree-input')).toHaveValue('');
    await expect(page.locator('#playback-step-container')).toContainText('Step:0/0');
  });
});
