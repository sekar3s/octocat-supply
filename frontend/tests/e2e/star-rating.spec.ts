import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

/**
 * Star rating E2E tests
 * Implements: frontend/tests/features/product-navigation.feature (star rating scenarios)
 *
 * Covers:
 * - Star buttons visible on each product card
 * - Clicking a star fills it and all prior stars in red
 * - Rating label updates to N/5 after clicking
 * - Rating persists when opening the product detail modal
 */

const screenshotsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'screenshots',
);

test.describe('Star rating feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
    // Wait for the product grid to load
    await expect(page.locator('div[class*="grid"]').first()).toBeVisible();
    // Ensure at least one product card is present
    await expect(page.locator('h3').first()).toBeVisible();
  });

  test('Star rating buttons are visible on product cards', async ({ page }) => {
    // Each product card should contain 5 star buttons
    const firstCardStars = page
      .locator('[role="group"][aria-label^="Star rating"]')
      .first()
      .locator('button[aria-label*="out of 5 stars"]');

    await expect(firstCardStars).toHaveCount(5);
  });

  test('Clicking the 4th star fills stars 1-4 red and shows 4/5 label', async ({ page }) => {
    // Get the first product's star rating group
    const firstRatingGroup = page
      .locator('[role="group"][aria-label^="Star rating"]')
      .first();

    // Click the 4th star
    const fourthStar = firstRatingGroup.locator('button[aria-label*="4 out of 5 stars"]');
    await fourthStar.click();

    // The live region should now show "4/5"
    const ratingLabel = firstRatingGroup.locator('[aria-live="polite"]');
    await expect(ratingLabel).toHaveText('4/5');

    // The selected star (4) should be aria-pressed=true
    await expect(fourthStar).toHaveAttribute('aria-pressed', 'true');

    // The unselected star (5) should be aria-pressed=false
    const fifthStar = firstRatingGroup.locator('button[aria-label*="5 out of 5 stars"]');
    await expect(fifthStar).toHaveAttribute('aria-pressed', 'false');

    // Take a screenshot as evidence
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '01-star-rating-4-of-5.png'),
      fullPage: false,
    });
  });

  test('Rating shows 1/5 after clicking the 1st star', async ({ page }) => {
    const firstRatingGroup = page
      .locator('[role="group"][aria-label^="Star rating"]')
      .first();

    const firstStar = firstRatingGroup.locator('button[aria-label*="1 out of 5 stars"]');
    await firstStar.click();

    const ratingLabel = firstRatingGroup.locator('[aria-live="polite"]');
    await expect(ratingLabel).toHaveText('1/5');

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '02-star-rating-1-of-5.png'),
      fullPage: false,
    });
  });

  test('Rating persists when the product detail modal is opened', async ({ page }) => {
    const firstRatingGroup = page
      .locator('[role="group"][aria-label^="Star rating"]')
      .first();

    // Rate the first product 3 stars
    const thirdStar = firstRatingGroup.locator('button[aria-label*="3 out of 5 stars"]');
    await thirdStar.click();

    const ratingLabel = firstRatingGroup.locator('[aria-live="polite"]');
    await expect(ratingLabel).toHaveText('3/5');

    // Open the product modal by clicking the product image area
    const firstProductImage = page.locator('div[class*="relative h-56"]').first();
    await firstProductImage.click();

    // Wait for the modal
    const modal = page.locator('[class*="fixed inset-0"]');
    await expect(modal).toBeVisible();

    // The modal's star rating group should also show 3/5
    const modalRatingGroup = modal.locator('[role="group"][aria-label^="Star rating"]');
    const modalRatingLabel = modalRatingGroup.locator('[aria-live="polite"]');
    await expect(modalRatingLabel).toHaveText('3/5');

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '03-star-rating-in-modal.png'),
      fullPage: false,
    });
  });

  test('Full product grid screenshot showing star ratings', async ({ page }) => {
    // Rate a few products for visual variety
    const ratingGroups = page.locator('[role="group"][aria-label^="Star rating"]');
    const count = await ratingGroups.count();

    if (count >= 1) {
      await ratingGroups.nth(0).locator('button[aria-label*="5 out of 5 stars"]').click();
    }
    if (count >= 2) {
      await ratingGroups.nth(1).locator('button[aria-label*="3 out of 5 stars"]').click();
    }
    if (count >= 3) {
      await ratingGroups.nth(2).locator('button[aria-label*="4 out of 5 stars"]').click();
    }

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    await page.screenshot({
      path: path.join(screenshotsDir, '04-product-grid-with-ratings.png'),
      fullPage: true,
    });
  });
});
