
import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomePage } from '../../pages/homePage';

test('Header-mid should match baseline', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();
  await expect(page.locator('.header-mid')).toHaveScreenshot('header-mid.png');
});
