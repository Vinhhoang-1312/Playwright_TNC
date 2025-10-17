import { Page } from '@playwright/test';

export class PopupHandler {
    constructor(private page: Page) {}

    private popupSelectors = [
        "//div[@class='widget-header--inner widget-header--inner--collapsed']//span[@class='widget-header--button-close-icon']",
        "//div[@class='widget-preview--btn-close']",
        "div.widget-header--inner.widget-header--inner--collapsed span.widget-header--button-close-icon",
        ".widget-preview--btn-close",
        ".popup-close, .modal-close, .close, [aria-label='close'], .cookie-accept"
    ];

    async dismissAllPopups() {
        for (const selector of this.popupSelectors) {
            const elements = await this.page.$$(selector);
            for (const el of elements) {
                try {
                    if (await el.isVisible()) {
                        await el.click();
                    }
                } catch (e) {}
            }
        }
    }

    async acceptAlertIfPresent() {
        this.page.on('dialog', async dialog => {
            await dialog.accept();
        });
    }
}
