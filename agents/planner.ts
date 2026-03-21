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
    confidence: number;
    reason?: string;
};

export class Planner {
    async makePlan(evt: FailureEvent): Promise<Plan> {
        // Luôn gọi generator để demo Antigravity Fix UI
        return { action: 'askGenerator', confidence: 1.0, reason: 'Demo Antigravity Auto Fix' };
    }

    // compatibility alias
    async decide(evt: FailureEvent, _page?: any): Promise<Plan> {
        return this.makePlan(evt);
    }
}

export default Planner;
