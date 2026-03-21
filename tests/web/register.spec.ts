import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC02 - Register / Invalid Login', () => {
    test('TC02_1: Tài khoản bị khóa không thể đăng nhập', async ({ page }) => {
        await allure.step('Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });

        await allure.step('Đăng nhập với tài khoản bị khóa', async () => {
            await page.fill('#user-name', 'locked_out_user');
            await page.fill('#password', 'secret_sauce');
            await page.click('#login-button');
        });

        await allure.step('Kiểm tra thông báo tài khoản bị khóa', async () => {
            const errorMsg = page.locator('[data-test="error"]');
            await expect(errorMsg).toBeVisible();
            await expect(errorMsg).toContainText('locked out');
        });
    });
});
