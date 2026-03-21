import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private readonly usernameInput = '#user-name';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#login-button';
    private readonly errorMessage = '[data-test="error"]';

    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        await this.open('https://www.saucedemo.com');
    }

    async login(user: string, pass: string) {
        await this.page.fill(this.usernameInput, user);
        await this.page.fill(this.passwordInput, pass);
        await this.page.click(this.loginButton);
    }

    async getErrorMessage() {
        return this.page.locator(this.errorMessage);
    }
}
