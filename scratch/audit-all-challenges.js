import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const challenges = [
  { chapter: 'arrays', id: 'two-sum' },
  { chapter: 'arrays', id: 'binary-search' },
  { chapter: 'arrays', id: 'remove-duplicates' },
  { chapter: 'arrays', id: 'merge-sorted-array' },
  { chapter: 'arrays', id: 'max-subarray' },
  { chapter: 'sorting', id: 'find-max' },
  { chapter: 'sorting', id: 'sort-colors' },
  { chapter: 'sorting', id: 'kth-largest' },
  { chapter: 'sorting', id: 'top-k-frequent' },
  { chapter: 'sorting', id: 'intersection-arrays' },
  { chapter: 'linked-lists', id: 'reverse-list' },
  { chapter: 'linked-lists', id: 'merge-two-lists' },
  { chapter: 'linked-lists', id: 'linked-list-cycle' },
  { chapter: 'linked-lists', id: 'middle-list' },
  { chapter: 'linked-lists', id: 'remove-nth-node' },
  { chapter: 'stack-queue', id: 'valid-parentheses' },
  { chapter: 'stack-queue', id: 'queue-using-stacks' },
  { chapter: 'stack-queue', id: 'min-stack' },
  { chapter: 'stack-queue', id: 'evaluate-rpn' },
  { chapter: 'stack-queue', id: 'next-greater-element' },
  { chapter: 'tree', id: 'invert-tree' },
  { chapter: 'hash-table', id: 'contains-duplicate' },
  { chapter: 'graph', id: 'find-center' }
];

const KEYWORDS = {
  "two-sum": "twoSum",
  "binary-search": "binarySearch",
  "remove-duplicates": "removeDuplicates",
  "merge-sorted-array": "merge",
  "max-subarray": "maxSubArray",
  "find-max": "findMax",
  "sort-colors": "sortColors",
  "kth-largest": "findKthLargest",
  "top-k-frequent": "topKFrequent",
  "intersection-arrays": "intersection",
  "reverse-list": "reverseList",
  "merge-two-lists": "mergeTwoLists",
  "linked-list-cycle": "hasCycle",
  "middle-list": "middleNode",
  "remove-nth-node": "removeNthFromEnd",
  "valid-parentheses": "isValid",
  "queue-using-stacks": "MyQueue",
  "min-stack": "MinStack",
  "evaluate-rpn": "evalRPN",
  "next-greater-element": "nextGreaterElement",
  "invert-tree": "invertTree",
  "contains-duplicate": "containsDuplicate",
  "find-center": "findCenter"
};

async function runAudit() {
  console.log('--- Starting All Challenges Visual Audit ---');
  const browser = await chromium.launch({ headless: false, slowMo: 150 });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  
  const results = [];
  
  // Create directories if they don't exist
  if (!fs.existsSync('scratch/audit-screenshots')) {
    fs.mkdirSync('scratch/audit-screenshots', { recursive: true });
  }

  for (const { chapter, id } of challenges) {
    const url = `http://localhost:5173/chapters/${chapter}/practice/${id}`;
    console.log(`Auditing: ${id} (${chapter}) at ${url}`);
    
    try {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Wait for CodeMirror to contain the expected keyword
      const keyword = KEYWORDS[id];
      const editor = page.locator('.cm-content');
      await editor.waitFor({ state: 'visible', timeout: 5000 });
      let editorText = await editor.innerText();
      let retries = 5;
      while (!editorText.includes(keyword) && retries > 0) {
        await page.waitForTimeout(400);
        editorText = await editor.innerText();
        retries--;
      }
      
      // Check if code editor is present
      const editorPresent = await editor.count() > 0;
      
      // Click Run Code
      await page.locator('#btn-run-code').click();
      
      // Wait for test-summary with timeout 5000ms
      const summaryLocator = page.locator('#test-summary');
      await summaryLocator.waitFor({ state: 'visible', timeout: 5000 });
      let summaryText = await summaryLocator.innerText();
      
      // If it still says READY, wait another second and check again
      if (summaryText.toUpperCase().includes('READY')) {
        await page.waitForTimeout(1000);
        summaryText = await summaryLocator.innerText();
      }
      
      console.log(`  => Summary Text: "${summaryText.replace(/\n/g, ' ')}"`);
      const passed = summaryText.toUpperCase().includes('PASS');
      
      // Verify visual sandbox panel is visible
      const sandboxPresent = await page.getByTestId('visual-sandbox-panel').isVisible();
      const executionFlowPresent = await page.getByTestId('execution-flow-trace').isVisible();
      
      // Take a screenshot of the visualizer panel
      const screenshotPath = `scratch/audit-screenshots/${id}.png`;
      await page.screenshot({ path: screenshotPath });
      
      // Linger on the page for 1.5 seconds so the user can watch the visualizer
      await page.waitForTimeout(1500);
      
      results.push({
        id,
        chapter,
        editorPresent,
        passed,
        sandboxPresent,
        executionFlowPresent,
        status: passed && sandboxPresent ? 'SUCCESS' : 'FAILED',
        error: null
      });
      console.log(`  => Status: ${passed && sandboxPresent ? 'SUCCESS' : 'FAILED'}`);
    } catch (err) {
      console.error(`  => Error auditing ${id}:`, err.message);
      results.push({
        id,
        chapter,
        editorPresent: false,
        passed: false,
        sandboxPresent: false,
        executionFlowPresent: false,
        status: 'ERROR',
        error: err.message
      });
    }
  }
  
  await browser.close();
  
  // Write report to markdown
  let report = '# Practice Challenges Audit Report\n\n';
  report += `Date: ${new Date().toISOString()}\n\n`;
  report += '| Challenge | Chapter | Editor | Tests Passed | Sandbox | Status |\n';
  report += '| --- | --- | --- | --- | --- | --- |\n';
  
  for (const r of results) {
    report += `| ${r.id} | ${r.chapter} | ${r.editorPresent ? 'Yes' : 'No'} | ${r.passed ? 'Yes' : 'No'} | ${r.sandboxPresent ? 'Yes' : 'No'} | **${r.status}** |\n`;
  }
  
  fs.writeFileSync('scratch/challenges-audit-report.md', report);
  console.log('--- Audit Finished! Report written to scratch/challenges-audit-report.md ---');
}

runAudit();
