import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    private readonly cartItems = '.cart_item';
    private readonly removeButtons = '.cart_button';
    private readonly checkoutButton = '[data-test="checkout"]';

    constructor(page: Page) {
        super(page);
    }

    async getCartItemCount() {
        return await this.page.locator(this.cartItems).count();
    }

    async removeItem(index: number = 0) {
        await this.page.locator(this.removeButtons).nth(index).click();
    }

    async checkout() {
        await this.page.click(this.checkoutButton);
    }
}
