import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { step } from '../helpers/stepWithScreenshot';

/**
 * REGRESSION SUITE
 * Chạy tự động mỗi khi có push hoặc merge code lên GitHub.
 */

const BASE_URL = 'https://www.saucedemo.com';

async function quickLogin(page: any) {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForSelector('.inventory_list');
}

test.describe('[Regression] Core Flows - SauceDemo', () => {

    test('REG-01: Trang login load đúng', async ({ page }) => {
        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Login Page Availability');

        await step(page, 'Mở trang Saucedemo', async () => {
            await page.goto(BASE_URL);
        });
        await step(page, 'Kiểm tra các elements login hiển thị đầy đủ', async () => {
            await expect(page.locator('#user-name')).toBeVisible();
            await expect(page.locator('#password')).toBeVisible();
            await expect(page.locator('#login-button')).toBeVisible();
        });
    });

    test('REG-02: Login thành công → vào trang sản phẩm', async ({ page }) => {
        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Basic Login Flow');

        await step(page, 'Login với tài khoản hợp lệ', async () => {
            await quickLogin(page);
        });
        await step(page, 'Kiểm tra trang products hiển thị', async () => {
            await expect(page.locator('.inventory_list')).toBeVisible();
            await expect(page).toHaveURL(/inventory/);
        });
    });

    test('REG-03: Thêm sản phẩm vào giỏ → số lượng giỏ hàng tăng', async ({ page }) => {
        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Add Item Flow');

        await step(page, 'Login nhanh', async () => {
            await quickLogin(page);
        });
        await step(page, 'Thêm sản phẩm đầu tiên vào giỏ', async () => {
            await page.locator('.btn_inventory').first().click();
        });
        await step(page, 'Giỏ hàng hiển thị badge = 1', async () => {
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        });
    });

    test('REG-04: Checkout end-to-end thành công', async ({ page }) => {
        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('E2E Checkout Flow');

        await step(page, 'Login và thêm sp vào giỏ', async () => {
            await quickLogin(page);
            await page.locator('.btn_inventory').first().click();
            await page.click('.shopping_cart_link');
        });

        await step(page, 'Bắt đầu checkout', async () => {
            await page.click('[data-test="checkout"]');
            await page.fill('[data-test="firstName"]', 'Vinh');
            await page.fill('[data-test="lastName"]', 'Hoang');
            await page.fill('[data-test="postalCode"]', '70000');
            await page.click('[data-test="continue"]');
        });
        await step(page, 'Hoàn tất và kiểm tra trang success', async () => {
            await page.click('[data-test="finish"]');
            await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you');
        });
    });

});
