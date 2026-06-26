import { test, expect } from '@playwright/test';

test.describe('New Algorithm Topics E2E Verification', () => {
  test('Stack & Queue page interactions', async ({ page }) => {
    await page.goto('/stack-queue');
    await expect(page.locator('h2')).toContainText('Stack & Queue Visualizer');

    // Default mode is Stack
    await expect(page.locator('#btn-select-stack')).toHaveAttribute('aria-pressed', 'true');

    // Change to Queue
    await page.click('#btn-select-queue');
    await expect(page.locator('#btn-select-queue')).toHaveAttribute('aria-pressed', 'true');

    // Check code viewer is displayed
    await expect(page.locator('h3:has-text("Implementation")')).toBeVisible();
  });

  test('BST page interactions', async ({ page }) => {
    await page.goto('/tree');
    await expect(page.locator('h2')).toContainText('Binary Search Tree Visualizer');

    // Verify visual sandbox displays the tree SVG specifically
    await expect(page.locator('#tree-visualizer-section svg[viewBox="0 0 800 400"]')).toBeVisible();
    
    // Default BST has exactly 7 nodes (circles with radius 20)
    await expect(page.locator('#tree-visualizer-section svg[viewBox="0 0 800 400"] circle[r="20"]')).toHaveCount(7);

    // Select In-Order tab and run
    await page.click('#btn-tree-op-inorder');
    await page.click('#btn-tree-run-traversal');
  });

  test('Hash Table page interactions', async ({ page }) => {
    await page.goto('/hash-table');
    await expect(page.locator('h2')).toContainText('Hash Table Visualizer');

    // Verify default hash table has elements scoped to visualizer container
    const container = page.locator('#hash-table-visualizer-section');
    await expect(container.getByText('Alice')).toBeVisible();
    await expect(container.getByText('25', { exact: true })).toBeVisible();
    await expect(container.getByText('NYC')).toBeVisible();

    // Run insert operation
    await page.fill('#hash-key-input', 'job');
    await page.fill('#hash-value-input', 'developer');
    await page.click('#btn-hash-run');
  });

  test('Graph page interactions', async ({ page }) => {
    await page.goto('/graph');
    await expect(page.locator('h2')).toContainText('Graph Traversal Visualizer');

    // Change algorithm and start node
    await page.click('#graph-tab-dfs');
    await page.selectOption('#graph-start-node', 'B');

    // Check exactly 7 SVG nodes are present (circles with radius 5)
    await expect(page.locator('#graph-visualizer-section svg circle[r="5"]')).toHaveCount(7);
  });
});
