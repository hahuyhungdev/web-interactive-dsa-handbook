import { test, expect } from '@playwright/test';

const testCases = [
  // Chapter 1: Arrays
  { chapter: 'arrays', challenge: 'two-sum' },
  { chapter: 'arrays', challenge: 'binary-search' },
  { chapter: 'arrays', challenge: 'remove-duplicates' },
  { chapter: 'arrays', challenge: 'merge-sorted-array' },
  { chapter: 'arrays', challenge: 'max-subarray' },
  // Chapter 2: Sorting
  { chapter: 'sorting', challenge: 'find-max' },
  { chapter: 'sorting', challenge: 'sort-colors' },
  { chapter: 'sorting', challenge: 'kth-largest' },
  { chapter: 'sorting', challenge: 'top-k-frequent' },
  { chapter: 'sorting', challenge: 'intersection-arrays' },
  // Chapter 3: Linked Lists
  { chapter: 'linked-lists', challenge: 'reverse-list' },
  { chapter: 'linked-lists', challenge: 'merge-two-lists' },
  { chapter: 'linked-lists', challenge: 'linked-list-cycle' },
  { chapter: 'linked-lists', challenge: 'middle-list' },
  { chapter: 'linked-lists', challenge: 'remove-nth-node' },
  // Chapter 4: Stacks & Queues
  { chapter: 'stack-queue', challenge: 'valid-parentheses' },
  { chapter: 'stack-queue', challenge: 'queue-using-stacks' },
  { chapter: 'stack-queue', challenge: 'min-stack' },
  { chapter: 'stack-queue', challenge: 'evaluate-rpn' },
  { chapter: 'stack-queue', challenge: 'next-greater-element' }
];

for (const { chapter, challenge } of testCases) {
  test(`Challenge: ${challenge} under chapter ${chapter} runs successfully and passes tests`, async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 900 });

    await page.goto(`http://localhost:5173/chapters/${chapter}/practice/${challenge}`);
    
    // Click "Run Code" button
    const runBtn = page.locator('button:has-text("Run Code")');
    await runBtn.click();
    
    // Expect "All Tests Passed" summary to be visible
    await expect(page.locator('text="All Tests Passed"')).toBeVisible({ timeout: 15000 });
  });
}
