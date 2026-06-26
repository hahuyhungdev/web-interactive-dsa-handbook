import { test, expect } from '@playwright/test';

test.describe('Adversarial Test Suite 2 - Practice Section & Code Runner Sandbox', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Open the Arrays chapter to access practice challenge
    const arrayBtn = page.locator('#chapter-btn-arrays');
    if (await arrayBtn.getAttribute('aria-expanded') !== 'true') {
      await arrayBtn.click();
    }
    
    // Open the challenge section
    const challengeLesson = page.locator('#chapter-panel-arrays [role="button"]:has-text("Challenge: Two Sum")');
    await challengeLesson.click();
  });

  // =========================================================================
  // 1. Sandbox Safety & Isolation
  // =========================================================================
  test.describe('Sandbox Safety & Isolation', () => {

    test('Sandbox should block constructor-based access to real global context (e.g. fetch)', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // Attempting to retrieve unshadowed fetch from real global scope via Function constructor
      const maliciousCode = `
        function twoSum(nums, target) {
          const realGlobal = Function("return this")();
          if (realGlobal && typeof realGlobal.fetch === 'function') {
            throw new Error('SEC_ERR_FETCH_ACCESSIBLE');
          }
          return [0, 1];
        }
      `;
      await editor.fill(maliciousCode);
      await runBtn.click();

      // If the sandbox is secure, 'fetch' or global context access should be prevented,
      // and we shouldn't see our custom security error string in the results.
      await expect(results).not.toContainText('SEC_ERR_FETCH_ACCESSIBLE');
    });

    test('Sandbox should block indirect eval access to real globals (e.g. self, fetch)', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // Attempting indirect eval which executes in global scope
      const maliciousCode = `
        function twoSum(nums, target) {
          const realFetch = (0, eval)("fetch");
          if (typeof realFetch === 'function') {
            throw new Error('SEC_ERR_INDIRECT_EVAL_FETCH');
          }
          return [0, 1];
        }
      `;
      await editor.fill(maliciousCode);
      await runBtn.click();

      await expect(results).not.toContainText('SEC_ERR_INDIRECT_EVAL_FETCH');
    });

    test('Sandbox should prevent prototype pollution from leaking across test cases within a single run', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // Malicious code that pollutes Object.prototype in the first test case
      // and expects the pollution to fail the second test case.
      const maliciousCode = `
        function twoSum(nums, target) {
          if (Object.prototype.pollutedByMaliciousCode) {
            throw new Error('SEC_ERR_PROTOTYPE_POLLUTED');
          }
          Object.prototype.pollutedByMaliciousCode = true;
          return [0, 1];
        }
      `;
      await editor.fill(maliciousCode);
      await runBtn.click();

      await expect(results).not.toContainText('SEC_ERR_PROTOTYPE_POLLUTED');
    });
  });

  // =========================================================================
  // 2. Sandbox Performance & Robustness
  // =========================================================================
  test.describe('Sandbox Performance & Robustness', () => {

    test('Sandbox should handle circular structure return values without crashing the main thread', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // Return circular reference object
      const maliciousCode = `
        function twoSum(nums, target) {
          const obj = {};
          obj.self = obj;
          return obj;
        }
      `;
      await editor.fill(maliciousCode);
      await runBtn.click();

      // Verify the application did not crash into a white screen of death
      const results = page.locator('#test-results-drawer');
      await expect(results).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    });

    test('Sandbox should terminate infinite loops and remain responsive for subsequent runs', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // 1. Submit infinite loop
      await editor.fill(`function twoSum(nums, target) { while(true) {} }`);
      await runBtn.click();
      
      // Expect timeout to catch the infinite loop
      await expect(summary).toHaveText(/Timeout/i, { timeout: 5000 });

      // 2. Immediately run a correct submission to verify responsiveness
      const correctCode = `
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
      await editor.fill(correctCode);
      await runBtn.click();
      await expect(summary).toHaveText(/All Tests Passed/i);
    });

    test('Sandbox should handle extremely large output strings without freezing the UI', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const results = page.locator('#test-results-drawer');

      // Wait for Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // Return a 1MB string
      const largeOutputCode = `
        function twoSum(nums, target) {
          return "A".repeat(1000000);
        }
      `;
      await editor.fill(largeOutputCode);
      await runBtn.click();

      // Verify that results are displayed and UI is responsive
      await expect(results).toBeVisible();
      await expect(page.locator('h1')).toBeVisible();
    });
  });

  // =========================================================================
  // 3. Challenge Correctness Evaluation
  // =========================================================================
  test.describe('Challenge Correctness Evaluation', () => {

    test('Challenge: Two Sum - evaluation correctness', async ({ page }) => {
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');

      // Wait for default Two Sum boilerplate to load
      await expect(editor).toHaveValue(/function twoSum/);

      // 1. Valid Solution
      const correctCode = `
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
      await editor.fill(correctCode);
      await runBtn.click();
      await expect(summary).toHaveText(/All Tests Passed/i);

      // 2. Semantic Error (always returns [0, 1])
      const incorrectCode = `
        function twoSum(nums, target) {
          return [0, 1];
        }
      `;
      await editor.fill(incorrectCode);
      await runBtn.click();
      await expect(summary).toHaveText(/Tests Failed/i);

      // 3. Syntax error
      await editor.fill(`function twoSum(nums, target) { { syntax error }`);
      await runBtn.click();
      await expect(summary).toHaveText(/Tests Failed/i);
    });

    test('Challenge: Reverse Linked List - evaluation correctness', async ({ page }) => {
      await page.locator('#challenge-tab-reverse-list').click();
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');

      // Wait for Reverse List boilerplate to load
      await expect(editor).toHaveValue(/function reverseList/);

      // 1. Valid Solution
      const correctCode = `
        function reverseList(head) {
          let prev = null;
          let curr = head;
          while (curr) {
            let next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
          }
          return prev;
        }
      `;
      await editor.fill(correctCode);
      await runBtn.click();
      await expect(summary).toHaveText(/All Tests Passed/i);

      // 2. Semantic Error (returns head unmodified)
      const incorrectCode = `
        function reverseList(head) {
          return head;
        }
      `;
      await editor.fill(incorrectCode);
      await runBtn.click();
      await expect(summary).toHaveText(/Tests Failed/i);
    });

    test('Challenge: Find Max - evaluation correctness', async ({ page }) => {
      await page.locator('#challenge-tab-find-max').click();
      const editor = page.locator('#code-editor');
      const runBtn = page.locator('#btn-run-code');
      const summary = page.locator('#test-summary');

      // Wait for Find Max boilerplate to load
      await expect(editor).toHaveValue(/function findMax/);

      // 1. Valid Solution
      const correctCode = `
        function findMax(arr) {
          if (arr.length === 0) return null;
          let max = arr[0];
          for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
          }
          return max;
        }
      `;
      await editor.fill(correctCode);
      await runBtn.click();
      await expect(summary).toHaveText(/All Tests Passed/i);

      // 2. Semantic Error (returns first element)
      const incorrectCode = `
        function findMax(arr) {
          return arr[0];
        }
      `;
      await editor.fill(incorrectCode);
      await runBtn.click();
      await expect(summary).toHaveText(/Tests Failed/i);
    });
  });
});
