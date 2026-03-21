import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
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
        await allure.epic('E-Commerce Core');
        await allure.feature('Checkout Process');
        await allure.story('Successful Checkout');
        await allure.label('severity', 'critical');
        await allure.owner('Vinh Hoang');
        await allure.tag('checkout', 'e2e', 'smoke');

        await step(page, '1. Kiểm tra giỏ hàng có sản phẩm', async () => {
            await expect(page.locator('.cart_item')).toHaveCount(1);
        });
        await step(page, '2. Click Checkout', async () => {
            await page.click('[data-test="checkout"]');
        });
        await step(page, '3. Điền thông tin giao hàng', async () => {
            await page.fill('[data-test="firstName"]', 'Vinh');
            await page.fill('[data-test="lastName"]', 'Hoang');
            await page.fill('[data-test="postalCode"]', '70000');
            await page.click('[data-test="continue"]');
        });
        await step(page, '4. Xem tóm tắt đơn hàng', async () => {
            await expect(page.locator('.summary_info')).toBeVisible();
        });
        await step(page, '5. Xác nhận và kiểm tra trang Thank You', async () => {
            await page.click('[data-test="finish"]');
            await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you');
        });
    });
});
