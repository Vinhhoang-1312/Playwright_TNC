import { Page } from '@playwright/test';
import { BasePage } from './basePage';
export class LoginPage extends BasePage {
    static locators = {
        accountButton: "//a[contains(@class,'item') and contains(@class,'account')]//span[contains(@class,'hover-txt')]",
        loginPopup: "#js-form-holder",
        emailField: "//input[@id='js-login-email']",
        passwordField: "//input[@id='js-login-password']",
        loginButton: "//a[@class='btn-submit']",
        logoutLink: "//a[contains(text(),'Đăng xuất') or contains(text(),'Logout')]",
        loggedInUserName: "//span[@class='hover-txt line-clamp-1']",
        popupClose: ".popup-close, .modal-close, .close, [aria-label='close'], .cookie-accept",
        emailError: "//div[contains(text(),'Email đăng nhập không đúng')]",
        passwordError: "//div[contains(text(),'Email đăng nhập không đúng')]",
        generalError: "//div[contains(@class,'error-message')]",
        accountMenu: "//a[@class='item account d-flex align-items']"
    };

    async openLoginPopup() {
        await this.click(LoginPage.locators.accountButton);
        await this.page.locator(LoginPage.locators.loginPopup).waitFor({ state: 'visible', timeout: 5000 });
    }

    async setEmail(email: string) {
        await this.page.locator(LoginPage.locators.emailField).fill(email ?? '');
    }

    async setPassword(password: string) {
        await this.page.locator(LoginPage.locators.passwordField).fill(password ?? '');
    }

    async submitLogin() {
        await this.click(LoginPage.locators.loginButton);
    }

    async performLogin(email: string, password: string) {
        await this.openLoginPopup();
        await this.setEmail(email);
        await this.setPassword(password);
        await this.submitLogin();
    }

    async open() {
        await this.page.goto('/', { waitUntil: 'load' });
    }

    async isLoginSuccessful(): Promise<boolean> {
    const locator = this.page.locator(LoginPage.locators.loggedInUserName);
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    const accountText = (await locator.textContent())?.trim() || '';
    return !!accountText && !this.isDefaultAccountTextSync(accountText);
    }

    async isDefaultAccountText(): Promise<boolean> {
        const locator = this.page.locator(LoginPage.locators.loggedInUserName);
        if (!(await locator.isVisible())) return true;
        const accountText = (await locator.textContent())?.trim() || '';
        return this.isDefaultAccountTextSync(accountText);
    }

    isDefaultAccountTextSync(text: string): boolean {
        const t = (text || '').toLowerCase().replace(/\s+/g, '');
        return t === 'tàikhoản'.replace(/\s+/g, '') || t === 'taikhoan' || t === 'account';
    }

    async getLoginError(): Promise<string> {
        const emailError = await this.page.locator(LoginPage.locators.emailError).isVisible()
            ? (await this.page.locator(LoginPage.locators.emailError).textContent())?.trim() || ''
            : '';
        if (emailError) return emailError;
        const passwordError = await this.page.locator(LoginPage.locators.passwordError).isVisible()
            ? (await this.page.locator(LoginPage.locators.passwordError).textContent())?.trim() || ''
            : '';
        if (passwordError) return passwordError;
        const generalError = await this.page.locator(LoginPage.locators.generalError).isVisible()
            ? (await this.page.locator(LoginPage.locators.generalError).textContent())?.trim() || ''
            : '';
        return generalError;
    }
}
