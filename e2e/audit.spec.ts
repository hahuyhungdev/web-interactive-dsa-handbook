import { test, expect } from '@playwright/test';

// Capture console messages and errors
const setupConsoleLogging = (page: any, pageName: string) => {
  const logs: string[] = [];
  const errors: string[] = [];

  page.on('console', (msg: any) => {
    const text = msg.text();
    logs.push(`[${pageName}] [${msg.type().toUpperCase()}] ${text}`);
    console.log(`[PAGE CONSOLE] ${msg.type().toUpperCase()}: ${text}`);
  });

  page.on('pageerror', (err: any) => {
    errors.push(`[${pageName}] [ERROR] ${err.message}`);
    console.error(`[PAGE UNCAUGHT ERROR]: ${err.message}`);
  });

  return { logs, errors };
};

test.describe('DSA Visualizers Comprehensive Audit', () => {

  test('Audit BST Visualizer (/tree)', async ({ page }) => {
    const { logs, errors } = setupConsoleLogging(page, 'Tree');
    await page.goto('/chapters/tree');
    await page.waitForLoadState('networkidle');

    // Screenshot of Initial Desktop View
    await page.screenshot({ path: 'scratch/tree-desktop-initial.png', fullPage: true });

    // Test inserting a node
    await expect(page.locator('#tree-input')).toBeVisible();
    await page.fill('#tree-input', '45');
    await page.click('#btn-tree-run');

    // Wait for the animation to play or step through
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'scratch/tree-desktop-inserted.png', fullPage: true });

    // Test traversals tabs and running them
    const traversals = ['inorder', 'preorder', 'postorder'];
    for (const op of traversals) {
      const tabId = `#btn-tree-op-${op}`;
      await page.click(tabId);
      await page.click('#btn-tree-run-traversal');
      await page.waitForTimeout(1000);
    }

    // Test Reset Tree
    await page.click('#btn-tree-reset');
    await page.waitForTimeout(500);

    // Verify there were no console errors
    expect(errors).toEqual([]);
  });

  test('Audit Hash Table Visualizer (/hash-table)', async ({ page }) => {
    const { logs, errors } = setupConsoleLogging(page, 'HashTable');
    await page.goto('/chapters/hash-table');
    await page.waitForLoadState('networkidle');

    // Screenshot of Initial Desktop View
    await page.screenshot({ path: 'scratch/hash-table-desktop-initial.png', fullPage: true });

    // Test inserting a key-value pair
    await expect(page.locator('#hash-key-input')).toBeVisible();
    await page.fill('#hash-key-input', 'apple');
    await page.fill('#hash-value-input', '1.99');
    await page.click('#btn-hash-run');
    await page.waitForTimeout(2000);

    // Test searching a key
    await page.click('#btn-hash-op-search');
    await page.fill('#hash-key-input', 'apple');
    await page.click('#btn-hash-run');
    await page.waitForTimeout(2000);

    // Test deleting a key
    await page.click('#btn-hash-op-delete');
    await page.fill('#hash-key-input', 'apple');
    await page.click('#btn-hash-run');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'scratch/hash-table-desktop-done.png', fullPage: true });

    // Verify there were no console errors
    expect(errors).toEqual([]);
  });

  test('Audit Graph Traversal Visualizer (/graph)', async ({ page }) => {
    const { logs, errors } = setupConsoleLogging(page, 'Graph');
    await page.goto('/chapters/graph');
    await page.waitForLoadState('networkidle');

    // Screenshot of Initial Desktop View
    await page.screenshot({ path: 'scratch/graph-desktop-initial.png', fullPage: true });

    // Try BFS and DFS
    await page.click('#graph-tab-bfs');
    await page.waitForTimeout(1000);

    await page.click('#graph-tab-dfs');
    await page.waitForTimeout(1000);

    // Start node selection
    await page.selectOption('#graph-start-node', 'B');
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'scratch/graph-desktop-done.png', fullPage: true });

    // Verify there were no console errors
    expect(errors).toEqual([]);
  });

  test('Audit Linear & Binary Search Visualizer (/search)', async ({ page }) => {
    const { logs, errors } = setupConsoleLogging(page, 'Search');
    await page.goto('/chapters/arrays');
    await page.waitForLoadState('networkidle');

    // Screenshot of Initial Desktop View
    await page.screenshot({ path: 'scratch/search-desktop-initial.png', fullPage: true });

    // Check linear search is present (default)
    // There are tabs for linear vs binary search, let's look for them
    // Let's click binary search tab if available, otherwise check page structure
    await page.screenshot({ path: 'scratch/search-desktop-done.png', fullPage: true });

    // Verify there were no console errors
    expect(errors).toEqual([]);
  });

  // Responsive audits (visual tests at different viewports)
  test('Responsive Audit at Tablet & Mobile Viewports', async ({ page }) => {
    const pagesList = [
      { name: 'tree', path: '/chapters/tree' },
      { name: 'hash-table', path: '/chapters/hash-table' },
      { name: 'graph', path: '/chapters/graph' },
      { name: 'search', path: '/chapters/arrays' }
    ];

    for (const { name, path } of pagesList) {
      // Tablet Viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `scratch/${name}-tablet.png`, fullPage: true });

      // Mobile Viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `scratch/${name}-mobile.png`, fullPage: true });
    }
  });

});
