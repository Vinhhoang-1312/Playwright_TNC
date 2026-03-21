import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export type HealResult = {
    applied: boolean;
    verified: boolean;
    message?: string;
};

export class Healer {
    constructor() { }

    async verifyCandidate(page: Page, selector: string): Promise<boolean> {
        try {
            const el = page.locator(selector);
            // quick existence check
            const cnt = await el.count();
            if (cnt === 0) return false;
            return await el.first().isVisible();
        } catch (e) {
            return false;
        }
    }

    async applyCandidate(sourceFile: string, oldSelector: string, candidate: string, dryRun = true): Promise<HealResult> {
        try {
            if (dryRun) {
                console.log(`[Healer] (Dry Run) Would patch file: ${sourceFile}`);
                console.log(`[Healer] Replaced: "${oldSelector}" -> "${candidate}"`);
                return { applied: false, verified: true, message: 'dry-run; logged the diff' };
            }

            const absPath = path.isAbsolute(sourceFile) ? sourceFile : path.join(process.cwd(), sourceFile);
            if (!fs.existsSync(absPath)) {
                return { applied: false, verified: false, message: 'target file not found' };
            }

            let content = fs.readFileSync(absPath, 'utf8');
            if (content.includes(oldSelector)) {
                content = content.replace(oldSelector, candidate);
                fs.writeFileSync(absPath, content, 'utf8');
                console.log(`[Healer] MAGIC! Successfully patched ${sourceFile}`);
                return { applied: true, verified: true, message: 'patched successfully' };
            } else {
                return { applied: false, verified: false, message: 'old selector not found in file' };
            }
        } catch (e) {
            return { applied: false, verified: false, message: String(e) };
        }
    }

    // compatibility alias: verify and apply in one call
    async verifyAndApply(page: Page, candidate: any, opts: { dryRun?: boolean; sourceFile?: string; oldSelector?: string } = { dryRun: true }): Promise<HealResult> {
        const selector = typeof candidate === 'string' ? candidate : (candidate.selector || '');
        console.log(`[Healer] Verifying candidate selector: ${selector} on the actual page...`);
        const ok = await this.verifyCandidate(page, selector);
        if (!ok) {
            console.log(`[Healer] Candidate verification failed! Element not visible.`);
            return { applied: false, verified: false, message: 'verification failed' };
        }
        console.log(`[Healer] Candidate verified! Applying to source code...`);
        return this.applyCandidate(opts.sourceFile || '', opts.oldSelector || '', selector, !!opts.dryRun);
    }
}

export default Healer;
