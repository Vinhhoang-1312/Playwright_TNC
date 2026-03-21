export type Candidate = {
    selector: string;
    confidence?: number;
    rationale?: string;
};

export class Generator {
    async generateCandidates(errorMessage: string, domSnapshot: string, sourceFile: string, oldSelector: string): Promise<Candidate[]> {
        console.log('[Generator] Analyzing failure for selector:', oldSelector);

        let newSelector = '';

        // 1. Try Heuristic for the demo (Saucedemo specific)
        if (oldSelector.includes('username123') || oldSelector.includes('user_name')) {
            newSelector = "//input[@id='user-name']";
        } else if (oldSelector.includes('password') || oldSelector.includes('pwd')) {
            newSelector = "//input[@id='password']";
        } else if (oldSelector.includes('login') || oldSelector.includes('submit')) {
            newSelector = "//input[@id='login-button']";
        }

        // 2. Here we would call the Antigravity model (API not directly available in Node.js script)
        if (!newSelector) {
            console.log('[Generator] 🛑 No heuristic match. Chờ Antigravity AI hỗ trợ sửa locator này!');
            // User can pause the demo here and ask the Antigravity Agent in the IDE chat to fix it.
        }

        if (newSelector) {
            console.log(`[Generator] Suggesting new selector: ${newSelector}`);
            return [{ selector: newSelector, confidence: 0.9, rationale: 'Heuristic match' }];
        }

        console.warn('[Generator] Could not generate a fix.');
        return [];
    }

    // compatibility alias: accept either (errorMessage, dom, sourceFile, oldSelector) or a single event object
    async generate(arg1: any, arg2?: any, arg3?: any, arg4?: any): Promise<Candidate[]> {
        if (typeof arg1 === 'object' && arg1 !== null) {
            const evt = arg1;
            return this.generateCandidates(evt.errorMessage || '', evt.domSnapshot || '', evt.sourceFile || '', evt.oldSelector || '');
        }
        return this.generateCandidates(arg1 || '', arg2 || '', arg3 || '', arg4 || '');
    }
}

export async function suggestLocatorFix(errorMessage: string, domSnapshot: string, sourceFile: string, oldSelector: string): Promise<string | null> {
    const generator = new Generator();
    const candidates = await generator.generateCandidates(errorMessage, domSnapshot, sourceFile, oldSelector);
    return candidates[0]?.selector || null;
}

export default Generator;
