// import { expect } from '@playwright/test';
// import { test } from '../../fixtures';
// import { allure } from 'allure-playwright';
// import { User } from '../../models/user';

// test.describe('UserProfile - Update Address', () => {
//     test('Update address successfully', async ({ loginPage, userData, page }) => {
//         const validUser: User | undefined = userData.find(row => row.caseType === 'valid');
//         if (!validUser) throw new Error('Không tìm thấy user hợp lệ trong dữ liệu test');

//         await allure.step('Step 1: Đăng nhập với tài khoản hợp lệ', async () => {
//             await loginPage.open();
//             await loginPage.performLogin(validUser.email, validUser.password);
//             expect(await loginPage.isLoginSuccessful()).toBeTruthy();
//         });

//         const { UserProfilePage } = await import('../../pages/userProfilePage');
//         const profilePage = new UserProfilePage(page);

//         await allure.step('Step 2: Mở trang user profile', async () => {
//             await profilePage.navigateToProfile();
//         });

//         const newAddress = '123 Test Street, Hanoi';
//         await allure.step('Step 3: Cập nhật địa chỉ', async () => {
//             await profilePage.updateAddress(newAddress);
//         });

//         await allure.step('Step 4: Refresh và kiểm tra địa chỉ', async () => {
//             await page.reload();
//             const actualAddress = await profilePage.getAddress();
//             expect(actualAddress).toBe(newAddress);
//         });
//     });
// });