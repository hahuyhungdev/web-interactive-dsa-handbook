import { test, expect } from '@playwright/test';

let consoleErrors: string[] = [];
let pageErrors: string[] = [];

test.beforeEach(({ page }) => {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[CONSOLE ERROR] [${page.url()}]: ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    pageErrors.push(`[PAGE ERROR] [${page.url()}]: ${err.message}`);
  });
});

test.describe('Vite App Comprehensive Audit', () => {

  test('Navbar, Sidebar, Theme Toggle, and Keyboard Shortcuts Overlay', async ({ page }) => {
    console.log('--- Auditing Navigation, Theme Toggle, and Keyboard Shortcuts ---');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Theme Toggle
    console.log('Testing Theme Toggle...');
    const themeBtn = page.locator('button').filter({ hasText: /theme|mode|light|dark/i }).or(page.locator('[aria-label*="theme" i]'));
    const count = await themeBtn.count();
    console.log(`Found theme toggle buttons: ${count}`);
    let themeToggleFound = false;
    for (let i = 0; i < count; i++) {
      const btn = themeBtn.nth(i);
      if (await btn.isVisible()) {
        themeToggleFound = true;
        const htmlElement = page.locator('html');
        const initialClass = await htmlElement.getAttribute('class') || '';
        console.log(`Initial html class: "${initialClass}"`);
        await btn.click();
        await page.waitForTimeout(500);
        const newClass = await htmlElement.getAttribute('class') || '';
        console.log(`Class after toggle: "${newClass}"`);
        break;
      }
    }
    if (!themeToggleFound) {
      console.log('Warning: No visible theme toggle button found on home page.');
    }

    // 2. Keyboard Shortcuts Overlay
    console.log('Testing Keyboard Shortcuts Overlay (pressing "?")...');
    // Keyboard shortcuts overlay responds to shift+slash ('?')
    await page.keyboard.press('?');
    await page.waitForTimeout(500);
    const overlay = page.locator('[role="dialog"]').or(page.locator('#keyboard-help-title')).or(page.locator('text=/shortcuts|keyboard/i'));
    const overlayCount = await overlay.count();
    let overlayVisible = false;
    for (let i = 0; i < overlayCount; i++) {
      if (await overlay.nth(i).isVisible()) {
        overlayVisible = true;
        const text = await overlay.nth(i).innerText();
        console.log(`Shortcuts overlay is visible: Yes. Text: "${text.substring(0, 100).replace(/\n/g, ' ')}..."`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        break;
      }
    }
    if (!overlayVisible) {
      console.log('Warning: Shortcuts overlay NOT visible after pressing "?".');
    }

    // 3. Sidebar and Table of Contents Accordions
    console.log('Testing Sidebar Chapter Accordions...');
    const chapterButtons = page.locator('[id^="chapter-btn-"]');
    const buttonCount = await chapterButtons.count();
    console.log(`Found chapter buttons: ${buttonCount}`);
    for (let i = 0; i < buttonCount; i++) {
      const btn = chapterButtons.nth(i);
      const btnId = await btn.getAttribute('id');
      const ariaExpanded = await btn.getAttribute('aria-expanded');
      console.log(`Button ID: ${btnId}, aria-expanded: ${ariaExpanded}`);
      if (ariaExpanded === 'false') {
        await btn.click();
        await page.waitForTimeout(300);
        const nextExpanded = await btn.getAttribute('aria-expanded');
        console.log(`-> Clicked. New aria-expanded: ${nextExpanded}`);
      }
    }
  });

  test('Theory Guides Audit', async ({ page }) => {
    console.log('--- Auditing Theory Guides ---');
    const theoryLessons = [
      'contiguous-memory',
      'sorting-taxonomy',
      'pointers-references',
      'stack-queue-intro',
      'bst-intro',
      'hash-table-intro',
      'graph-intro'
    ];

    for (const lesson of theoryLessons) {
      const url = `/theory/${lesson}`;
      console.log(`Navigating to theory guide: ${url}`);
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const title = await page.locator('h1, h2').first().innerText();
      const contentText = await page.locator('body').innerText();
      const hasContent = contentText.length > 500;
      console.log(`[Theory: ${lesson}] Title: "${title}", Text length: ${contentText.length}, Has Content: ${hasContent ? 'Yes' : 'No'}`);
    }
  });

  test('Practice Challenges Audit & Interaction', async ({ page }) => {
    console.log('--- Auditing Practice Challenges ---');
    const practiceChallenges = [
      'two-sum',
      'find-max',
      'reverse-list',
      'binary-search',
      'valid-parentheses'
    ];

    for (const challenge of practiceChallenges) {
      const url = `/practice/${challenge}`;
      console.log(`Navigating to practice challenge: ${url}`);
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // 1. Verify page details
      const title = await page.locator('h1, h2').first().innerText();
      console.log(`[Practice: ${challenge}] Title: "${title}"`);

      // 2. Check for CodeMirror editor
      const editor = page.locator('.cm-editor, #code-editor, textarea');
      const editorCount = await editor.count();
      console.log(`[Practice: ${challenge}] Code editor count: ${editorCount}`);
      
      if (editorCount > 0) {
        const firstEditorId = await editor.first().getAttribute('id');
        const firstEditorClass = await editor.first().getAttribute('class');
        console.log(`[Practice: ${challenge}] Editor details -> ID: ${firstEditorId}, Class: ${firstEditorClass}`);

        // Try to trigger Cmd/Ctrl+Enter
        console.log(`[Practice: ${challenge}] Triggering code run via Cmd+Enter / Ctrl+Enter shortcut...`);
        await editor.first().click();
        await page.waitForTimeout(200);

        await page.keyboard.press('Control+Enter');
        await page.waitForTimeout(1000); // wait for run output

        // Look for test results drawer or container using valid CSS selector
        const resultsDrawer = page.locator('#test-results-drawer, [data-test-status]');
        const resultsCount = await resultsDrawer.count();
        console.log(`[Practice: ${challenge}] Found test result element(s) count: ${resultsCount}`);
        
        if (resultsCount > 0) {
          const summaryText = await resultsDrawer.first().innerText();
          console.log(`[Practice: ${challenge}] Result summary/text: "${summaryText.replace(/\n/g, ' ')}"`);
        } else {
          console.log(`[Practice: ${challenge}] Warning: No test results shown after Ctrl+Enter.`);
        }

        // Click Run/Evaluate button to see if it works
        const runBtn = page.locator('button').filter({ hasText: /run|evaluate|submit/i }).or(page.locator('#btn-run-code'));
        if (await runBtn.count() > 0) {
          console.log(`[Practice: ${challenge}] Found Run button. Clicking it...`);
          await runBtn.click();
          await page.waitForTimeout(1000);
          
          const newSummaryCount = await page.locator('#test-summary, [id*="summary"], .test-summary').count();
          if (newSummaryCount > 0) {
            const summaryText = await page.locator('#test-summary, [id*="summary"], .test-summary').first().innerText();
            console.log(`[Practice: ${challenge}] Summary after Run button click: "${summaryText.replace(/\n/g, ' ')}"`);
          } else {
            console.log(`[Practice: ${challenge}] Warning: No summary shown after clicking Run button.`);
          }
        } else {
          console.log(`[Practice: ${challenge}] Warning: Run button not found.`);
        }
      }
    }
  });

  test('Responsive and Layout Audit', async ({ page }) => {
    console.log('--- Auditing Responsiveness on Mobile Viewport (375x667) ---');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sidebar = page.locator('aside, .sidebar');
    const sidebarCount = await sidebar.count();
    if (sidebarCount > 0) {
      const isVisible = await sidebar.first().isVisible();
      console.log(`Mobile Viewport (375x667) - Sidebar visible: ${isVisible}`);
    }

    const menuBtn = page.locator('button').filter({ hasText: /menu|nav|open/i }).or(page.locator('[aria-label*="menu" i]')).or(page.locator('button:has(svg)'));
    const menuBtnCount = await menuBtn.count();
    console.log(`Mobile Viewport (375x667) - Menu/Hamburger buttons found: ${menuBtnCount}`);

    await page.goto('/theory/contiguous-memory');
    await page.waitForLoadState('networkidle');
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport (375x667) - doc scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}`);
    if (scrollWidth > clientWidth) {
      console.log(`Warning: Horizontal scroll detected on mobile theory page (scrollWidth ${scrollWidth} > clientWidth ${clientWidth})!`);
    } else {
      console.log(`Nice! No horizontal scroll detected on mobile theory page.`);
    }
  });

});

test.afterAll(() => {
  console.log('--- Audit Summary ---');
  if (consoleErrors.length > 0) {
    console.log('Console Errors Detected during audit:');
    consoleErrors.forEach(err => console.log(' - ' + err));
  } else {
    console.log('Zero Console Errors detected.');
  }

  if (pageErrors.length > 0) {
    console.log('Page/JS Uncaught Errors Detected during audit:');
    pageErrors.forEach(err => console.log(' - ' + err));
  } else {
    console.log('Zero Page/JS Uncaught Errors detected.');
  }
});
