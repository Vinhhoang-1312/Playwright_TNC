import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
        this.sourceFile = __filename;
    }
    
    static locators = {
        productItems: ".product-list .product-item"
    };

    async open() {
        await super.open('/');
    }

    async clickFirstProduct() {
        const items = await this.page.$$(HomePage.locators.productItems);
        if (items.length > 0) {
            await items[0].click();
        } else {
            throw new Error('Không tìm thấy sản phẩm nào để click');
        }
    }
}
