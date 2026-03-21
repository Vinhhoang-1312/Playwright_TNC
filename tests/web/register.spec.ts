import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC02 - Register / Invalid Login', () => {

    test('TC02_1: Tài khoản bị khóa không thể đăng nhập', async ({ page }) => {
        await allure.epic('Website Authentication');
        await allure.feature('Security Tests');
        await allure.story('Locked Out User');
        await allure.label('severity', 'critical');
        await allure.owner('Vinh Hoang');
        await allure.tag('negative', 'security');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await page.goto(BASE_URL);
        });
        await step(page, '2. Đăng nhập với tài khoản bị khóa (locked_out_user)', async () => {
            await page.fill('#user-name', 'locked_out_user');
            await page.fill('#password', 'secret_sauce');
        });
        await step(page, '3. Click Login và kiểm tra thông báo bị khóa', async () => {
            await page.click('#login-button');
            const errorMsg = page.locator('[data-test="error"]');
            await expect(errorMsg).toBeVisible();
            await expect(errorMsg).toContainText('locked out');
        });
    });
});
