import { Page, Locator } from '@playwright/test';
import { run3AgentFlow } from '../agents';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open(path: string = '') {
        await this.page.goto(path);
    }

    /**
     * AI-Powered Action Wrapper (Heuristic + LLM)
     * Nếu hành động (Click, Fill,...) fail vì lỗi locator, nó sẽ gọi 3-Agent AI để tìm cách fix.
     */
    async safeAction(selector: string, action: (locator: Locator) => Promise<void>) {
        try {
            const locator = this.page.locator(selector);
            await action(locator);
        } catch (error: any) {
            console.warn(`[AI-Healing] Action failed on selector: ${selector}. Attempting healing...`);

            // Lấy thông tin về file gọi action để AI biết đường mà fix source code
            const sourceFile = Error().stack?.split('\n')[2]?.match(/\((.*):\d+:\d+\)/)?.[1] || 'unknown.ts';

            // Gọi 3-Agent AI Flow
            const result = await run3AgentFlow(this.page, { errorMessage: error.message }, sourceFile, selector);

            if (result.applyResult?.applied) {
                console.info(`[AI-Healing] Successfully patched ${sourceFile}. Please re-run test.`);
                throw new Error(`AI has patched the locator in ${sourceFile}. Please stop and re-run.`);
            } else {
                throw error;
            }
        }
    }
}
