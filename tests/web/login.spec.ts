import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC01 - Login', () => {
    test('TC01_1: Login thành công với tài khoản hợp lệ', async ({ page }) => {
        await allure.step('Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });

        await allure.step('Nhập thông tin đăng nhập', async () => {
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
        });

        await allure.step('Click Login và kiểm tra chuyển trang', async () => {
            await page.click('#login-button');
            await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
        });
    });

    test('TC01_2: Login thất bại với mật khẩu sai', async ({ page }) => {
        await allure.step('Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });

        await allure.step('Nhập mật khẩu sai', async () => {
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'wrong_password');
            await page.click('#login-button');
        });

        await allure.step('Kiểm tra thông báo lỗi hiển thị', async () => {
            await expect(page.locator('[data-test="error"]')).toBeVisible();
        });
    });
});
