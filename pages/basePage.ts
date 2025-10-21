import { Page } from '@playwright/test';
import { suggestLocatorFix } from '../mcp/openaiAgent';
import { run3AgentFlow } from '../agents';
import { PopupHandler } from '../utils/popupHandler';
import path from 'path';

export class BasePage {
    protected page: Page;
    protected sourceFile: string; // Lưu file path của class con
    
    constructor(page: Page) {
        this.page = page;
        // Mặc định là basePage, sẽ được override bởi class con
        this.sourceFile = __filename;
    }

    /**
     * Wrapper cho mọi thao tác với locator, thử dismiss popup rồi gọi agent AI khi lỗi.
     */
    async safeLocatorAction(action: () => Promise<any>, locator: string) {
        const popupHandler = new PopupHandler(this.page);
        try {
            await popupHandler.dismissAllPopups();
            await action();
        } catch (error) {
            console.log(`[safeLocatorAction] Action failed for locator: ${locator}`);
            await popupHandler.dismissAllPopups();
            // Lấy DOM và gọi AI agent
            let domHtml = '';
            try {
                if (!this.page.isClosed()) {
                    domHtml = await this.page.content();
                    console.log(`[safeLocatorAction] DOM size: ${domHtml.length} chars`);
                } else {
                    console.warn('[safeLocatorAction] Page đã đóng, sẽ dùng heuristic fallback');
                }
            } catch (e) {
                console.warn('[safeLocatorAction] Không lấy được DOM content:', e);
            }
            try {
                console.log(`[safeLocatorAction] Calling AI agent to fix locator in file: ${this.sourceFile}`);
                const enable3 = process.env.ENABLE_3AGENT === 'true';
                if (enable3) {
                    const evt = { testId: undefined, action: undefined, selector: locator, errorMessage: (error as Error).message, domSnapshot: domHtml };
                    const res = await run3AgentFlow(this.page, evt, this.sourceFile, locator);
                    console.log('[safeLocatorAction] 3-agent flow result:', res);
                } else {
                    const suggestion = await suggestLocatorFix(
                        (error as Error).message,
                        domHtml,
                        this.sourceFile,
                        locator
                    );
                    console.log(`[safeLocatorAction] AI suggestion: ${suggestion}`);
                    if (suggestion && suggestion !== locator) {
                        console.log('[safeLocatorAction] ✅ AI fixed locator. Đã sửa file, hãy chạy lại test!');
                    } else {
                        console.warn('[safeLocatorAction] AI không đề xuất locator mới hoặc trùng với cũ');
                    }
                }
            } catch (aiErr) {
                console.error('[safeLocatorAction] AI suggestion failed:', aiErr);
            }
            // Luôn throw error để test runner dừng lại, user chạy lại test sẽ pass
            throw error;
        }
    }

    async getFirstVisibleText(locators: string[]): Promise<string> {
        for (const selector of locators) {
            const el = this.page.locator(selector);
            if (await el.isVisible()) {
                return (await el.textContent())?.trim() || '';
            }
        }
        return '';
    }

    isDefaultAccountTextSync(text: string): boolean {
        const t = (text || '').toLowerCase().replace(/\s+/g, '');
        return t === 'tàikhoản'.replace(/\s+/g, '') || t === 'taikhoan' || t === 'account';
    }
    async open(url: string) {
        await this.page.goto(url, { waitUntil: 'load' });
    }

    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async click(selector: string) {
        await this.safeLocatorAction(
            () => this.page.locator(selector).click({ timeout: 10000 }),
            selector
        );
    }

    async waitForVisible(selector: string, timeout = 5000) {
        await this.safeLocatorAction(
            () => this.page.locator(selector).waitFor({ state: 'visible', timeout }),
            selector
        );
    }

    async fill(selector: string, value: string) {
        await this.safeLocatorAction(
            () => this.page.locator(selector).fill(value ?? '', { timeout: 10000 }),
            selector
        );
    }
}
