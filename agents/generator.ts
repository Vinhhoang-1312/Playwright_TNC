import { suggestLocatorFix } from '../mcp/openaiAgent';

export type Candidate = {
    selector: string;
    confidence?: number;
    rationale?: string;
};

export class Generator {
    async generateCandidates(errorMessage: string, domSnapshot: string, sourceFile: string, oldSelector: string): Promise<Candidate[]> {
        // Reuse existing suggestLocatorFix which returns a selector string or empty
        try {
            const result = await suggestLocatorFix(errorMessage, domSnapshot, sourceFile, oldSelector);
            if (!result) return [];
            return [{ selector: result, confidence: 0.6, rationale: 'from openaiAgent' }];
        } catch (e) {
            console.warn('[Generator] openaiAgent failed:', e);
            return [];
        }
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

export default Generator;
