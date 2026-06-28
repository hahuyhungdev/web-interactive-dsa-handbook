import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'http://localhost:5175';
const OUT = 'docs/audit-screenshots';
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

const consoleLogs = [];
const pageErrors = [];

async function runAudit() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    console.log(`\n=== Auditing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    page.on('console', msg => {
      const txt = msg.text();
      const type = msg.type();
      if (type === 'error' || type === 'warning' || txt.toLowerCase().includes('error')) {
        consoleLogs.push({ viewport: vp.name, type, text: txt });
        console.log(`[PAGE ${type.toUpperCase()}] ${txt}`);
      }
    });

    page.on('pageerror', err => {
      pageErrors.push({ viewport: vp.name, error: err.message, stack: err.stack });
      console.error(`[PAGE UNCAUGHT ERROR]: ${err.message}`);
    });

    // 1. Audit /sorting
    console.log('Navigating to /sorting...');
    await page.goto(`${BASE}/sorting`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Take initial screenshot
    await page.screenshot({ path: `${OUT}/sorting_${vp.name}_init.png` });

    if (vp.name === 'desktop') {
      // Let's test the 5 algorithms
      const algos = ['bubble', 'selection', 'insertion', 'quick', 'merge'];
      for (const algo of algos) {
        console.log(`Testing algorithm tab: ${algo}`);
        const btnId = `#btn-select-${algo}-sort`;
        await page.click(btnId);
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${OUT}/sorting_desktop_tab_${algo}.png` });

        // Let's press play
        await page.click('#btn-play');
        console.log('Clicked Play...');
        await page.waitForTimeout(400); // Wait 400ms (plays ~4 frames)
        
        // Check if steps increased
        const stepsText = await page.locator('#playback-step-info').textContent();
        console.log(`Steps after play: ${stepsText}`);
        
        // Pause if still playing
        const pauseBtn = page.locator('#btn-pause');
        if (await pauseBtn.isVisible()) {
          await pauseBtn.click();
          console.log('Clicked Pause...');
        } else {
          console.log('Already paused or finished.');
        }
        await page.waitForTimeout(200);
        
        // Reset
        await page.click('#btn-reset');
        console.log('Clicked Reset...');
        await page.waitForTimeout(500);
        
        const stepsResetText = await page.locator('#playback-step-info').textContent();
        console.log(`Steps after reset: ${stepsResetText}`);
      }
    }

    // 2. Audit /linked-list
    console.log('Navigating to /linked-list...');
    await page.goto(`${BASE}/linked-list`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Initial LinkedList view
    await page.screenshot({ path: `${OUT}/linked_list_${vp.name}_init.png` });

    if (vp.name === 'desktop') {
      // Test insert at tail (default)
      console.log('Inserting value 99 at tail...');
      await page.fill('#input-list-val', '99');
      await page.selectOption('#select-list-position', 'tail');
      await page.click('#btn-list-insert');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/linked_list_desktop_insert_tail.png` });

      // Test insert at head
      console.log('Inserting value 5 at head...');
      await page.fill('#input-list-val', '5');
      await page.selectOption('#select-list-position', 'head');
      await page.click('#btn-list-insert');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/linked_list_desktop_insert_head.png` });

      // Test insert at index
      console.log('Inserting value 42 at index 2...');
      await page.fill('#input-list-val', '42');
      await page.selectOption('#select-list-position', 'index');
      await page.fill('#input-list-index', '2');
      await page.click('#btn-list-insert');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/linked_list_desktop_insert_index.png` });

      // Test delete node
      console.log('Deleting node with value 30...');
      await page.fill('#input-list-delete-val', '30');
      await page.click('#btn-list-delete');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/linked_list_desktop_delete.png` });

      // Test find / traverse animation
      console.log('Searching for node with value 99...');
      await page.fill('#input-list-find-val', '99');
      await page.click('#btn-list-find');
      // Wait for playback of traverse to run (about 1.5 seconds)
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${OUT}/linked_list_desktop_find_animate.png` });
    }

    // 3. Audit /stack-queue
    console.log('Navigating to /stack-queue...');
    await page.goto(`${BASE}/stack-queue`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Initial stack view
    await page.screenshot({ path: `${OUT}/stack_queue_${vp.name}_init_stack.png` });

    if (vp.name === 'desktop') {
      // Play through Stack sequence
      console.log('Playing Stack sequence...');
      await page.click('#btn-play');
      await page.waitForTimeout(500);
      const pauseBtn = page.locator('#btn-pause');
      if (await pauseBtn.isVisible()) {
        await pauseBtn.click();
        console.log('Clicked Pause...');
      } else {
        console.log('Already paused or finished.');
      }
      await page.screenshot({ path: `${OUT}/stack_queue_desktop_stack_playing.png` });

      // Switch to Queue
      console.log('Switching to Queue mode...');
      await page.click('#btn-select-queue');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/stack_queue_desktop_queue_init.png` });

      // Play through Queue sequence
      console.log('Playing Queue sequence...');
      await page.click('#btn-play');
      await page.waitForTimeout(500);
      const pauseBtnQueue = page.locator('#btn-pause');
      if (await pauseBtnQueue.isVisible()) {
        await pauseBtnQueue.click();
        console.log('Clicked Pause...');
      } else {
        console.log('Already paused or finished.');
      }
      await page.screenshot({ path: `${OUT}/stack_queue_desktop_queue_playing.png` });
    }

    await context.close();
  }

  await browser.close();

  // Print results
  console.log('\n=== AUDIT COMPLETE ===');
  console.log(`Total console warnings/errors detected: ${consoleLogs.length}`);
  console.log(`Total uncaught page errors detected: ${pageErrors.length}`);

  // Write log findings
  const logsReport = {
    consoleLogs,
    pageErrors
  };
  writeFileSync('docs/audit-screenshots/audit-logs.json', JSON.stringify(logsReport, null, 2));
  console.log('Saved log report to docs/audit-screenshots/audit-logs.json');
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
