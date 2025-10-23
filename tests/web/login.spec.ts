import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { allure } from 'allure-playwright';

test.describe('Login - Valid Data', () => {
    test('Valid login for all valid users', async ({ loginPage, userData }) => {
        const validData = userData.filter(row => row.caseType === 'valid');
        for (const [idx, data] of validData.entries()) {
            await allure.step(`Valid login #${idx + 1}: Mở trang login`, async () => {
                await loginPage.open();
            });
            await allure.step(`Valid login #${idx + 1}: Đăng nhập và kiểm tra thành công`, async () => {
                await loginPage.performLogin(data.email, data.password);
                expect(await loginPage.isLoginSuccessful()).toBeTruthy();
            });
        }
    });
});

// test.describe('Login - Invalid Data', () => {
//     invalidData.forEach((data, idx) => {
//         test(`Invalid login #${idx + 1}`, async ({ page }) => {
//             const loginPage = new LoginPage(page);
//             await allure.step('Step 1: Mở trang login', async () => {
//                 await loginPage.open();
//             });
//             await allure.step('Step 2: Đăng nhập invalid và kiểm tra tài khoản mặc định', async () => {
//                 await loginPage.performLogin(data.email, data.password);
//                 expect(await loginPage.isDefaultAccountText()).toBeTruthy();
//             });
//         });
//     });
// });


