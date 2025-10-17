import { test as baseTest } from '@playwright/test';
import { allure } from 'allure-playwright';
export async function attachScreenshot(page: any, name = 'screenshot') {
    try {
        const buffer = await page.screenshot();
        allure.attachment(name, buffer, 'image/png');
    }
    catch (e) {
    }
}
export function labelSeverity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial') {
    allure.severity(level);
}
export function labelStory(story: string) {
    allure.story(story);
}
