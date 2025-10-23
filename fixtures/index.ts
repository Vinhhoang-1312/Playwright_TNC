import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { RegisterPage } from '../pages/registerPage';
import { getDataRows } from '../utils/dataProvider';
import { User } from '../models/user';

type MyFixtures = {
  loginPage: LoginPage;
  userData: User[];
  registerPage: RegisterPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  userData: async ({}, use) => {
    const data = getDataRows('data/users.xlsx', '') as User[];
    await use(data);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },
});
