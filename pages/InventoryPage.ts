import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    private readonly inventoryList = '.inventory_list';
    private readonly addToCartButtons = '.btn_inventory';
    private readonly cartBadge = '.shopping_cart_badge';
    private readonly cartLink = '.shopping_cart_link';

    constructor(page: Page) {
        super(page);
    }

    async isPageVisible() {
        await expect(this.page.locator(this.inventoryList)).toBeVisible();
    }

    async addItemToCart(index: number = 0) {
        await this.page.locator(this.addToCartButtons).nth(index).click();
    }

    async getCartCount() {
        return await this.page.locator(this.cartBadge).innerText();
    }

    async goToCart() {
        await this.page.click(this.cartLink);
    }
}
