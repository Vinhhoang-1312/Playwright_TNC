import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC02 - Cart', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.waitForSelector('.inventory_list');
    });

    test('TC02_1: Thêm sản phẩm vào giỏ hàng', async ({ page }) => {
        await allure.step('Click "Add to cart" sản phẩm đầu tiên', async () => {
            await page.locator('.btn_inventory').first().click();
        });

        await allure.step('Vào giỏ hàng và kiểm tra sản phẩm', async () => {
            await page.click('.shopping_cart_link');
            await expect(page.locator('.cart_item')).toHaveCount(1);
        });
    });

    test('TC02_2: Xóa sản phẩm khỏi giỏ hàng', async ({ page }) => {
        await allure.step('Thêm sản phẩm vào giỏ', async () => {
            await page.locator('.btn_inventory').first().click();
            await page.click('.shopping_cart_link');
        });

        await allure.step('Xóa sản phẩm và kiểm tra giỏ rỗng', async () => {
            await page.locator('.cart_button').first().click();
            await expect(page.locator('.cart_item')).toHaveCount(0);
        });
    });
});
