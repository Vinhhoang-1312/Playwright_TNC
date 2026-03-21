import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC03 - Checkout', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.waitForSelector('.inventory_list');
        await page.locator('.btn_inventory').first().click();
        await page.click('.shopping_cart_link');
    });

    test('TC03_1: Hoàn thành quy trình Checkout', async ({ page }) => {
        await allure.step('Click Checkout', async () => {
            await page.click('[data-test="checkout"]');
        });

        await allure.step('Điền thông tin giao hàng', async () => {
            await page.fill('[data-test="firstName"]', 'Vinh');
            await page.fill('[data-test="lastName"]', 'Hoang');
            await page.fill('[data-test="postalCode"]', '70000');
            await page.click('[data-test="continue"]');
        });

        await allure.step('Xác nhận thông tin và hoàn tất đơn hàng', async () => {
            await expect(page.locator('.summary_info')).toBeVisible();
            await page.click('[data-test="finish"]');
            await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you');
        });
    });
});
