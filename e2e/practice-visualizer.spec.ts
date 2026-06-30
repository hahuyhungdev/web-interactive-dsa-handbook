import { expect, test } from '@playwright/test';

const setupConsoleLogging = (page: any) => {
  const errors: string[] = [];

  page.on('console', (msg: any) => {
    if (msg.type() === 'error') {
      errors.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', (err: any) => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  return { errors };
};

test.describe('Practice execution visualizer UX', () => {
  test('shows readable execution summary, sandbox, flow, and accessible controls after running code', async ({ page }) => {
    const { errors } = setupConsoleLogging(page);

    await page.goto('/practice/two-sum');
    await page.waitForLoadState('networkidle');

    await page.locator('#btn-run-code').click();

    await expect(page.locator('#test-summary')).toContainText('All Tests Passed');

    await expect(page.getByTestId('execution-visualizer-panel')).toBeVisible();
    await expect(page.getByTestId('execution-kpi-step')).toContainText('Step');
    await expect(page.getByTestId('execution-kpi-line')).toContainText('Line');
    await expect(page.getByTestId('execution-kpi-operation')).toContainText('Operation');
    await expect(page.getByTestId('visual-sandbox-panel')).toBeVisible();
    await expect(page.getByTestId('execution-flow-trace')).toBeVisible();

    const traceItems = page.getByTestId('execution-flow-item');
    await expect(traceItems.first()).toBeVisible();

    const firstTraceBox = await traceItems.first().boundingBox();
    expect(firstTraceBox?.height).toBeGreaterThanOrEqual(40);

    await page.getByRole('button', { name: 'Step forward through execution' }).click();
    await expect(page.getByTestId('execution-kpi-step')).toContainText('1');

    await page.getByRole('button', { name: 'Reset execution timeline' }).click();
    await expect(page.getByTestId('execution-kpi-step')).toContainText('0');

    expect(errors).toEqual([]);
  });

  test('uses default challenge cases with enough execution steps to inspect', async ({ page }) => {
    const tabs = ['two-sum', 'binary-search', 'reverse-list', 'find-max', 'valid-parentheses'];

    await page.goto('/practice/two-sum');
    await page.waitForLoadState('networkidle');

    for (const tab of tabs) {
      await page.locator(`#challenge-tab-${tab}`).click();
      await page.locator('#btn-run-code').click();
      await expect(page.locator('#test-summary')).toContainText('All Tests Passed');

      const traceItems = page.getByTestId('execution-flow-item');
      await expect(traceItems.first()).toBeVisible();

      const traceCount = await traceItems.count();
      expect(traceCount, `${tab} trace count`).toBeGreaterThanOrEqual(15);
      expect(traceCount, `${tab} trace count`).toBeLessThanOrEqual(25);
    }
  });
});
