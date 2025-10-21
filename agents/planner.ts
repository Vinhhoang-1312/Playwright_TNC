import { Page } from '@playwright/test';

export type FailureEvent = {
    testId?: string;
    action?: string;
    selector?: string;
    errorMessage?: string;
    domSnapshot?: string;
};

export type Plan = {
    action: 'retry' | 'dismissPopup' | 'askGenerator' | 'manual';
    confidence: number; // 0..1
    reason?: string;
};

/**
 * Very small Planner: classifies a failure and returns a simple plan.
 * This is a conservative default: prefers dismissing popups or manual when unsure.
 */
export class Planner {
    async makePlan(evt: FailureEvent): Promise<Plan> {
        // Simple heuristics: if error mentions "not visible" or "detached" -> retry
        const msg = (evt.errorMessage || '').toLowerCase();
        if (msg.includes('not visible') || msg.includes('hidden') || msg.includes('detached')) {
            return { action: 'retry', confidence: 0.7, reason: 'element possibly hidden/detached' };
        }
        if (msg.includes('timeout') || msg.includes('waiting')) {
            return { action: 'dismissPopup', confidence: 0.6, reason: 'maybe overlay or popup' };
        }
        // default: ask generator for a candidate
        return { action: 'askGenerator', confidence: 0.5, reason: 'fallback to generator' };
    }

    // compatibility alias used by tests
    async decide(evt: FailureEvent, _page?: any): Promise<Plan> {
        // ignore page for now, keep signature compatible
        return this.makePlan(evt);
    }
}

export default Planner;
