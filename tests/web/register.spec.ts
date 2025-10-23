import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { allure } from 'allure-playwright';
import { User } from '../../models/user';

test.describe('Register', () => {
    test('Register with invalid data', async ({ registerPage, userData }) => {
        const invalidData: User[] = userData.filter(row => row.caseType === 'invalid');
        for (const [idx, data] of invalidData.entries()) {
            await allure.step(`Register invalid #${idx + 1}: Mở trang đăng ký`, async () => {
                await registerPage.open();
            });
            await allure.step(`Register invalid #${idx + 1}: Đăng ký và kiểm tra thất bại`, async () => {
                await registerPage.performRegister(data.email, data.password, data.fullname);
                expect(await registerPage.isRegisterSuccessful()).toBeFalsy();
            });
        }
    });
});
