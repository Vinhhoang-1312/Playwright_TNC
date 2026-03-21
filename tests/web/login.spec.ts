import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('TC01 - Login (POM)', () => {

    test('TC01_1: Login thành công với tài khoản hợp lệ', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await allure.epic('Website Authentication');
        await allure.feature('Login Flow');
        await allure.story('Valid Login');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await loginPage.navigate();
        });
        await step(page, '2. Nhập username và password hợp lệ', async () => {
            await loginPage.login('standard_user', 'secret_sauce');
        });
        await step(page, '3. Kiểm tra chuyển sang trang Products', async () => {
            await inventoryPage.isPageVisible();
        });
    });

    test('TC01_2: Login thất bại với mật khẩu sai', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await allure.epic('Website Authentication');
        await allure.feature('Login Flow');
        await allure.story('Invalid Password');

        await step(page, '1. Mở trang SauceDemo', async () => {
            await loginPage.navigate();
        });
        await step(page, '2. Nhập mật khẩu sai', async () => {
            await loginPage.login('standard_user', 'wrong_password');
        });
        await step(page, '3. Kiểm tra error message hiển thị', async () => {
            const error = await loginPage.getErrorMessage();
            await expect(error).toBeVisible();
        });
    });
});
