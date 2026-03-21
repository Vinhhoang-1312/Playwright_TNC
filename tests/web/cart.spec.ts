import { test, expect } from '@playwright/test';
import { step } from '../helpers/stepWithScreenshot';
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
        await allure.epic('E-Commerce Core');
        await allure.feature('Shopping Cart');
        await allure.story('Add Item To Cart');
        await allure.label('severity', 'critical');
        await allure.owner('Vinh Hoang');
        await allure.tag('cart', 'smoke');

        await step(page, '1. Trang Products hiển thị', async () => {
            await expect(page.locator('.inventory_list')).toBeVisible();
        });
        await step(page, '2. Click "Add to cart" sản phẩm đầu tiên', async () => {
            await page.locator('.btn_inventory').first().click();
        });
        await step(page, '3. Vào giỏ hàng và kiểm tra có 1 sản phẩm', async () => {
            await page.click('.shopping_cart_link');
            await expect(page.locator('.cart_item')).toHaveCount(1);
        });
    });

    test('TC02_2: Xóa sản phẩm khỏi giỏ hàng', async ({ page }) => {
        await allure.epic('E-Commerce Core');
        await allure.feature('Shopping Cart');
        await allure.story('Remove Item From Cart');
        await allure.label('severity', 'normal');
        await allure.owner('Vinh Hoang');
        await allure.tag('cart', 'negative');

        await step(page, '1. Thêm sản phẩm vào giỏ', async () => {
            await page.locator('.btn_inventory').first().click();
        });
        await step(page, '2. Vào giỏ hàng', async () => {
            await page.click('.shopping_cart_link');
            await expect(page.locator('.cart_item')).toHaveCount(1);
        });
        await step(page, '3. Xóa sản phẩm và kiểm tra giỏ rỗng', async () => {
            await page.locator('.cart_button').first().click();
            await expect(page.locator('.cart_item')).toHaveCount(0);
        });
    });
});
