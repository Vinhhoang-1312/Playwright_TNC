import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
        // Thiết lập đường dẫn file nguồn để AI biết sửa đúng file
        this.sourceFile = __filename;
    }
    
    static locators = {
        accountButton: "//a[contains(@class,'item') and contains(@class,'account')]//span[contains(@class,'hover-txt')]",
        loginPopup: "#js-form-holder",
        emailField: "//input[@id='js-login-email']",        
        // emailField: "//input[@id='js-logihoangn-email']",        
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
        await this.waitForVisible(LoginPage.locators.loginPopup, 5000);
    }

    async setEmail(email: string) {
        await this.fill(LoginPage.locators.emailField, email);
    }

    async setPassword(password: string) {
        await this.fill(LoginPage.locators.passwordField, password);
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
        await super.open('/');
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


    async getLoginError(): Promise<string> {
        return this.getFirstVisibleText([
            LoginPage.locators.emailError,
            LoginPage.locators.passwordError,
            LoginPage.locators.generalError
        ]);
    }
}
