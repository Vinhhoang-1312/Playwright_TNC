import { Page } from '@playwright/test';
import fs from 'fs';
import { FileLocatorFixer } from '../mcp/locatorFixerStrategy';

export type HealResult = {
    applied: boolean;
    verified: boolean;
    message?: string;
};

export class Healer {
    constructor() {}

    async verifyCandidate(page: Page, selector: string): Promise<boolean> {
        try {
            const el = page.locator(selector);
            // quick existence + visible check
            const cnt = await el.count();
            if (cnt === 0) return false;
            return await el.first().isVisible();
        } catch (e) {
            return false;
        }
    }

    async applyCandidate(sourceFile: string, oldSelector: string, candidate: string, dryRun = true): Promise<HealResult> {
        // backup/patch via existing fixer
        try {
            const enableAutoFix = process.env.ENABLE_AUTO_FIX === 'true';
            const fixer = new FileLocatorFixer(enableAutoFix, dryRun);
            fixer.fixLocator(sourceFile, oldSelector, candidate);
            if (dryRun) {
                return { applied: false, verified: true, message: 'dry-run; fixer logged the diff' };
            }
            // verify that file now contains candidate
            const absPath = require('path').isAbsolute(sourceFile) ? sourceFile : require('path').join(process.cwd(), sourceFile);
            if (fs.existsSync(absPath)) {
                const content = fs.readFileSync(absPath, 'utf8');
                const verified = content.includes(candidate);
                return { applied: verified, verified, message: verified ? 'patched' : 'patched but not found in file' };
            }
            return { applied: false, verified: false, message: 'target file not found after patch' };
        } catch (e) {
            return { applied: false, verified: false, message: String(e) };
        }
    }

    // compatibility alias: verify and apply in one call
    async verifyAndApply(page: Page, candidate: any, opts: { dryRun?: boolean; sourceFile?: string; oldSelector?: string } = { dryRun: true }): Promise<HealResult> {
        const selector = typeof candidate === 'string' ? candidate : (candidate.selector || '');
        const ok = await this.verifyCandidate(page, selector);
        if (!ok) return { applied: false, verified: false, message: 'verification failed' };
        return this.applyCandidate(opts.sourceFile || '', opts.oldSelector || '', selector, !!opts.dryRun);
    }
}

export default Healer;
