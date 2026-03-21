import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
    testDir: './tests',
    timeout: 60000,
    expect: { timeout: 8000 },
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'reports/html-report' }],
        ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true }],
    ],
    use: {
        baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
        trace: 'on-first-retry',
        screenshot: 'on',          // Chụp screenshot cho TẤT CẢ test (pass & fail)
        video: 'retain-on-failure', // Quay video khi fail
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});

