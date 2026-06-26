import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:5173';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: 'home', path: '/' },
  { name: 'sorting', path: '/sorting?algo=quick' },
  { name: 'practice', path: '/practice/two-sum' },
  { name: 'linked-list', path: '/linked-list' },
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const shot of shots) {
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/${shot.name}.png` });
  console.log(`captured ${shot.name} -> ${OUT}/${shot.name}.png`);
}

await browser.close();
