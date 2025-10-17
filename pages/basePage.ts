import { Page } from '@playwright/test';
export class BasePage {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async open(url: string) {
        await this.page.goto(url, { waitUntil: 'load' });
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async click(selector: string) {
        try {
            await this.page.locator(selector).click();
        } catch (e) {
            const { PopupHandler } = await import('../utils/popupHandler');
            const popupHandler = new PopupHandler(this.page);
            await popupHandler.dismissAllPopups();
            await this.page.locator(selector).click();
        }
    }

    async waitForVisible(selector: string, timeout = 5000) {
        await this.page.locator(selector).waitFor({ state: 'visible', timeout });
    }

    async fill(selector: string, value: string) {
        await this.page.locator(selector).fill(value ?? '');
    }
}
