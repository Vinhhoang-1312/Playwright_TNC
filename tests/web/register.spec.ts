import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';

test.describe('TC02 - Register / Invalid Login (POM)', () => {

    test('TC02_1: Tài khoản bị khóa không thể đăng nhập', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await allure.epic('Website Authentication');
        await allure.feature('Security Tests');
        await allure.story('Locked Out User');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await loginPage.navigate();
        });
        await step(page, '2. Đăng nhập với tài khoản bị khóa (locked_out_user)', async () => {
            await loginPage.login('locked_out_user', 'secret_sauce');
        });
        await step(page, '3. Kiểm tra thông báo bị khóa hiển thị', async () => {
            const error = await loginPage.getErrorMessage();
            await expect(error).toBeVisible();
            await expect(error).toContainText('locked out');
        });
    });
});
