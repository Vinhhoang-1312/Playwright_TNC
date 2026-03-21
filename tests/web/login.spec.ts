import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC01 - Login', () => {

    test('TC01_1: Login thành công với tài khoản hợp lệ', async ({ page }) => {
        await allure.epic('Website Authentication');
        await allure.feature('Login Flow');
        await allure.story('Valid Login');
        await allure.label('severity', 'critical');
        await allure.owner('Vinh Hoang');
        await allure.tag('smoke', 'login');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });
        await step(page, '2. Nhập username và password hợp lệ', async () => {
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'secret_sauce');
        });
        await step(page, '3. Click Login và kiểm tra chuyển sang trang Products', async () => {
            await page.click('#login-button');
            await expect(page.locator('.inventory_list')).toBeVisible({ timeout: 10000 });
        });
    });

    test('TC01_2: Login thất bại với mật khẩu sai', async ({ page }) => {
        await allure.epic('Website Authentication');
        await allure.feature('Login Flow');
        await allure.story('Invalid Password');
        await allure.label('severity', 'normal');
        await allure.owner('Vinh Hoang');
        await allure.tag('negative', 'login');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });
        await step(page, '2. Nhập mật khẩu sai', async () => {
            await page.fill('#user-name', 'standard_user');
            await page.fill('#password', 'wrong_password');
        });
        await step(page, '3. Click Login và kiểm tra error message', async () => {
            await page.click('#login-button');
            await expect(page.locator('[data-test="error"]')).toBeVisible();
        });
    });
});
