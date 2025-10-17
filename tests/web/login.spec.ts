import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { getDataRows } from '../../utils/dataProvider';

const allData = getDataRows('data/users.xlsx', 'data/sample_users.json', 'Sheet1');
const validData = allData.filter(row => row.caseType === 'valid');
const invalidData = allData.filter(row => row.caseType === 'invalid');

test.describe('Login - Valid Data', () => {
    validData.forEach((data, idx) => {
        test(`Valid login #${idx + 1}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.performLogin(data.email, data.password);
            expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        });
    });
});

test.describe('Login - Invalid Data', () => {
    invalidData.forEach((data, idx) => {
        test(`Invalid login #${idx + 1}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.performLogin(data.email, data.password);
            expect(await loginPage.isDefaultAccountText()).toBeTruthy();
        });
    });
});

