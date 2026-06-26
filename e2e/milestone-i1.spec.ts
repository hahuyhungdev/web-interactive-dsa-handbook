import { test, expect } from '@playwright/test';

test.describe('Milestone I1 - Premium UI & Accessibility Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local dev server
    await page.goto('/');
  });

  test('Hero section and basic page structure', async ({ page }) => {
    // Verify the main editorial title
    const title = page.locator('h1');
    await expect(title).toContainText('The Art & Mechanics');
    await expect(title).toContainText('of Algorithms');

    // Verify introductory text exists
    const introText = page.locator('header p');
    await expect(introText).toContainText('A tactile textbook designed for visual thinkers');
  });

  test('Navbar frosted glass transition on scroll', async ({ page }) => {
    const navbarContainer = page.locator('nav > div').first();

    // 1. At the top of the page (scrollY = 0)
    // The navbar should have bg-paper/30 and py-4
    await expect(navbarContainer).toHaveClass(/bg-paper\/30/);
    await expect(navbarContainer).toHaveClass(/py-4/);
    await expect(navbarContainer).not.toHaveClass(/bg-paper\/60/);
    await expect(navbarContainer).not.toHaveClass(/py-3/);

    // 2. Scroll down by 100px
    await page.evaluate(() => window.scrollTo(0, 100));
    // Wait for the scroll listener to trigger state changes (124ms transition plus event dispatch)
    await page.waitForTimeout(100);

    // The navbar should transition to bg-paper/60, py-3, and shadow-premium
    await expect(navbarContainer).toHaveClass(/bg-paper\/60/);
    await expect(navbarContainer).toHaveClass(/py-3/);
    await expect(navbarContainer).toHaveClass(/shadow-premium/);
    await expect(navbarContainer).not.toHaveClass(/bg-paper\/30/);
    await expect(navbarContainer).not.toHaveClass(/py-4/);

    // 3. Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);

    // The navbar should revert to bg-paper/30 and py-4
    await expect(navbarContainer).toHaveClass(/bg-paper\/30/);
    await expect(navbarContainer).toHaveClass(/py-4/);
    await expect(navbarContainer).not.toHaveClass(/bg-paper\/60/);
    await expect(navbarContainer).not.toHaveClass(/py-3/);
  });

  test('Table of Contents accordion behavior and default states', async ({ page }) => {
    const arrayBtn = page.locator('#chapter-btn-arrays');
    const sortingBtn = page.locator('#chapter-btn-sorting');
    const listsBtn = page.locator('#chapter-btn-linked-lists');

    const arrayPanel = page.locator('#chapter-panel-arrays');
    const sortingPanel = page.locator('#chapter-panel-sorting');
    const listsPanel = page.locator('#chapter-panel-linked-lists');

    // Chapter II (Sorting) must be expanded by default for showcase
    await expect(sortingBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(sortingPanel).toHaveClass(/max-h-\[600px\]/);

    // Chapters I and III must be collapsed by default
    await expect(arrayBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(arrayPanel).toHaveClass(/max-h-0/);
    await expect(listsBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(listsPanel).toHaveClass(/max-h-0/);

    // Click Chapter I to expand it
    await arrayBtn.click();
    await expect(arrayBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(arrayPanel).toHaveClass(/max-h-\[600px\]/);

    // Sorting should remain expanded (independent accordions rather than single-accordion group)
    // or it toggles independently? Let's check our TableOfContents.jsx:
    // toggleChapter setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
    // Ah, it sets expandedChapter to the clicked one, meaning only one is expanded at a time!
    // Let's verify that sorting becomes collapsed when arrays is expanded:
    await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(sortingPanel).toHaveClass(/max-h-0/);
  });

  test('Table of Contents keyboard accessibility', async ({ page }) => {
    const arrayBtn = page.locator('#chapter-btn-arrays');
    const sortingBtn = page.locator('#chapter-btn-sorting');

    // 1. Focus on Sorting accordion header and collapse it via keyboard Enter
    await sortingBtn.focus();
    await page.keyboard.press('Enter');
    await expect(sortingBtn).toHaveAttribute('aria-expanded', 'false');

    // 2. Focus on Array accordion header and expand it via keyboard Space
    await arrayBtn.focus();
    await page.keyboard.press(' ');
    await expect(arrayBtn).toHaveAttribute('aria-expanded', 'true');

    // 3. Verify keyboard nav inside the expanded panel
    const lessonItem = page.locator('#chapter-panel-arrays [role="button"]').first();
    await expect(lessonItem).toHaveAttribute('tabindex', '0');
    
    // Trigger action via Enter on the lesson
    await lessonItem.focus();
    await page.keyboard.press('Enter');
  });

  test('Premium editorial visual elements', async ({ page }) => {
    // 1. Roman numerals
    const romanNumerals = page.locator('span.font-editorial.italic.text-3xl');
    await expect(romanNumerals).toHaveCount(3);
    await expect(romanNumerals.nth(0)).toHaveText('I');
    await expect(romanNumerals.nth(1)).toHaveText('II');
    await expect(romanNumerals.nth(2)).toHaveText('III');

    // 2. Badges: Theory, Interactive, Challenge
    const theoryBadge = page.locator('span:has-text("Theory")').first();
    const interactiveBadge = page.locator('span:has-text("Interactive")').first();
    const challengeBadge = page.locator('span:has-text("Challenge")').first();

    await expect(theoryBadge).toBeVisible();
    await expect(interactiveBadge).toBeVisible();
    await expect(challengeBadge).toBeVisible();

    // Verify high-contrast styling on interactive/challenge badges (WCAG AA compliance)
    await expect(interactiveBadge).toHaveClass(/text-coral-dark/);
    await expect(challengeBadge).toHaveClass(/text-emerald-700/);

    // 3. Clock durations
    const clockIcons = page.locator('svg.lucide-clock');
    // Chapter II has 4 lessons, Chapter I has 3, Chapter III has 3 (Total 10 lessons)
    await expect(clockIcons).toHaveCount(10);
  });
});
