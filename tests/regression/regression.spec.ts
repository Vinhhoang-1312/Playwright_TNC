import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * REGRESSION SUITE
 * Chạy tự động mỗi khi có push hoặc merge code lên GitHub.
 * Kiểm tra các luồng cốt lõi của SauceDemo không bị hư sau mỗi lần deploy.
 */

const BASE_URL = 'https://www.saucedemo.com';

// Helper: login nhanh, dùng chung trong regression
async function quickLogin(page: any) {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForSelector('.inventory_list');
}

test.describe('[Regression] Core Flows - SauceDemo', () => {

    test('REG-01: Trang login load đúng', async ({ page }) => {
        await allure.step('Mở trang Saucedemo', async () => {
            await page.goto(BASE_URL);
        });
        await allure.step('Kiểm tra các elements login hiển thị đầy đủ', async () => {
            await expect(page.locator('#user-name')).toBeVisible();
            await expect(page.locator('#password')).toBeVisible();
            await expect(page.locator('#login-button')).toBeVisible();
        });
    });

    test('REG-02: Login thành công → vào trang sản phẩm', async ({ page }) => {
        await allure.step('Login với tài khoản hợp lệ', async () => {
            await quickLogin(page);
        });
        await allure.step('Kiểm tra trang products hiển thị', async () => {
            await expect(page.locator('.inventory_list')).toBeVisible();
            await expect(page).toHaveURL(/inventory/);
        });
    });

    test('REG-03: Thêm sản phẩm vào giỏ → số lượng giỏ hàng tăng', async ({ page }) => {
        await quickLogin(page);
        await allure.step('Thêm sản phẩm đầu tiên vào giỏ', async () => {
            await page.locator('.btn_inventory').first().click();
        });
        await allure.step('Giỏ hàng hiển thị badge = 1', async () => {
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });
    });

    test('REG-04: Checkout end-to-end thành công', async ({ page }) => {
        await quickLogin(page);
        await page.locator('.btn_inventory').first().click();
        await page.click('.shopping_cart_link');

        await allure.step('Bắt đầu checkout', async () => {
            await page.click('[data-test="checkout"]');
            await page.fill('[data-test="firstName"]', 'Vinh');
            await page.fill('[data-test="lastName"]', 'Hoang');
            await page.fill('[data-test="postalCode"]', '70000');
            await page.click('[data-test="continue"]');
        });
        await allure.step('Hoàn tất và kiểm tra trang success', async () => {
            await page.click('[data-test="finish"]');
            await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you');
        });
    });

});
