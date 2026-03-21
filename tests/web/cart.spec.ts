import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('TC02 - Cart (POM)', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    test('TC02_1: Thêm sản phẩm vào giỏ hàng', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        await allure.epic('E-Commerce Core');
        await allure.feature('Shopping Cart');
        await allure.story('Add Item To Cart');

        await step(page, '1. Click "Add to cart" sản phẩm đầu tiên', async () => {
            await inventoryPage.addItemToCart(0);
        });
        await step(page, '2. Vào giỏ hàng và kiểm tra có 1 sản phẩm', async () => {
            await inventoryPage.goToCart();
            expect(await cartPage.getCartItemCount()).toBe(1);
        });
    });

    test('TC02_2: Xóa sản phẩm khỏi giỏ hàng', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);

        await allure.epic('E-Commerce Core');
        await allure.feature('Shopping Cart');
        await allure.story('Remove Item From Cart');

        await step(page, '1. Thêm sản phẩm vào giỏ', async () => {
            await inventoryPage.addItemToCart(0);
        });
        await step(page, '2. Vào giỏ hàng', async () => {
            await inventoryPage.goToCart();
            expect(await cartPage.getCartItemCount()).toBe(1);
        });
        await step(page, '3. Xóa sản phẩm và kiểm tra giỏ rỗng', async () => {
            await cartPage.removeItem(0);
            expect(await cartPage.getCartItemCount()).toBe(0);
        });
    });
});
