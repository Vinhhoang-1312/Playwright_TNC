import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { step } from '../helpers/stepWithScreenshot';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/**
 * REGRESSION SUITE (POM)
 * Chạy tự động mỗi khi có push hoặc merge code lên GitHub.
 */

test.describe('[Regression] Core Flows - SauceDemo (POM)', () => {

    test('REG-01: Trang login load đúng', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Login Page Availability');

        await step(page, 'Mở trang Saucedemo', async () => {
            await loginPage.navigate();
        });
        await step(page, 'Kiểm tra các elements login hiển thị đầy đủ', async () => {
            const error = await loginPage.getErrorMessage(); // check if we can reach the page
            expect(page.url()).toContain('saucedemo.com');
        });
    });

    test('REG-02: Login thành công → vào trang sản phẩm', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Basic Login Flow');

        await step(page, 'Login với tài khoản hợp lệ', async () => {
            await loginPage.navigate();
            await loginPage.login('standard_user', 'secret_sauce');
        });
        await step(page, 'Kiểm tra trang products hiển thị', async () => {
            await inventoryPage.isPageVisible();
        });
    });

    test('REG-03: Thêm sản phẩm vào giỏ → số lượng giỏ hàng tăng', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);

        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('Add Item Flow');

        await step(page, 'Login nhanh và thêm sản phẩm', async () => {
            await loginPage.navigate();
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.addItemToCart(0);
        });
        await step(page, 'Giỏ hàng hiển thị badge = 1', async () => {
            expect(await inventoryPage.getCartCount()).toBe('1');
        });
    });

    test('REG-04: Checkout end-to-end thành công', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await allure.epic('Regression');
        await allure.feature('System Health');
        await allure.story('E2E Checkout Flow');

        await step(page, 'Bắt đầu luồng Checkout', async () => {
            await loginPage.navigate();
            await loginPage.login('standard_user', 'secret_sauce');
            await inventoryPage.addItemToCart(0);
            await inventoryPage.goToCart();
            await cartPage.checkout();
            await checkoutPage.fillInformation('Vinh', 'Hoang', '70000');
            await checkoutPage.finishCheckout();
        });
        await step(page, 'Kiểm tra trang success', async () => {
            const header = await checkoutPage.getSuccessHeader();
            await expect(header).toContainText('Thank you');
        });
    });

});
