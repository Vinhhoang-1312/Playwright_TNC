import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class RegisterPage extends BasePage {
    static locators = {
        openRegister: "//input[@type='email'] or //input[@id='username']",
        emailField: "#js-register-email",
        passwordField: "#js-register-password",
        fullnameField: "#js-register-fullname",
        submitButton: "#js-register-submit",
        successMessage: "//div[contains(@class,'register-success')]",
        errorMessage: "//div[contains(@class,'error-message')]"
    };

    constructor(page: Page) {
        super(page);
        this.sourceFile = __filename;
    }

    async open() {
        await this.click(RegisterPage.locators.openRegister);
    }

    async performRegister(email: string, password: string, fullname: string) {
        await this.fill(RegisterPage.locators.emailField, email);
        await this.fill(RegisterPage.locators.passwordField, password);
        await this.fill(RegisterPage.locators.fullnameField, fullname);
        await this.click(RegisterPage.locators.submitButton);
    }

    async isRegisterSuccessful(): Promise<boolean> {
        const locator = this.page.locator(RegisterPage.locators.successMessage);
        return await locator.isVisible();
    }
}
