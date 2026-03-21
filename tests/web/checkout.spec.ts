import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('TC03 - Checkout (POM)', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addItemToCart(0);
        await inventoryPage.goToCart();
    });

    test('TC03_1: Hoàn thành quy trình Checkout', async ({ page }) => {
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await allure.epic('E-Commerce Core');
        await allure.feature('Checkout Process');
        await allure.story('Successful Checkout');

        await step(page, '1. Click Checkout', async () => {
            await cartPage.checkout();
        });
        await step(page, '2. Điền thông tin giao hàng', async () => {
            await checkoutPage.fillInformation('Vinh', 'Hoang', '70000');
        });
        await step(page, '3. Xác nhận và kiểm tra trang Thank You', async () => {
            await checkoutPage.finishCheckout();
            const header = await checkoutPage.getSuccessHeader();
            await expect(header).toContainText('Thank you');
        });
    });
});
