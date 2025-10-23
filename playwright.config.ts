import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
    testDir: './tests',
    timeout: 120000,
    expect: { timeout: 5000 },
    reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright', { outputFolder: 'reports/allure-results' }]],
    use: {
    baseURL: process.env.BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: false,
        video: 'off',
        actionTimeout: 0,
        launchOptions: {
            args: ['--start-maximized']
        },
        viewport: null,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                viewport: null,
                launchOptions: { args: ['--start-maximized'] }
            }
        },
        {
            name: 'edge',
            use: {
                browserName: 'chromium',
                channel: 'msedge',
                viewport: null,
                launchOptions: {
                    args: [
                        '--start-maximized',
                        '--disable-features=Translate',
                        '--lang=vi'
                    ]
                }
            }
        }
    ],
});
