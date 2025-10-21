import { Planner, FailureEvent } from './planner';
import { Generator } from './generator';
import { Healer } from './healer';
import { Page } from '@playwright/test';

export async function run3AgentFlow(page: Page, evt: FailureEvent, sourceFile: string, oldSelector: string) {
    const planner = new Planner();
    const plan = await planner.makePlan(evt);
    console.log('[3Agent] Planner decided:', plan);
    if (plan.action === 'dismissPopup') {
        // caller (basePage) should attempt dismiss; here we just return plan
        return { plan };
    }
    if (plan.action === 'retry') {
        return { plan };
    }
    if (plan.action === 'askGenerator') {
        const generator = new Generator();
        const candidates = await generator.generateCandidates(evt.errorMessage || '', evt.domSnapshot || '', sourceFile, oldSelector);
        console.log('[3Agent] Generator candidates:', candidates);
        if (!candidates || candidates.length === 0) return { plan, candidates: [] };
        const healer = new Healer();
        // pick top candidate
        const candidate = candidates[0].selector;
        const dryRun = process.env.AUTO_FIX_DRY_RUN === 'true';
        const applyResult = await healer.applyCandidate(sourceFile, oldSelector, candidate, dryRun);
        return { plan, candidates, applyResult };
    }
    return { plan };
}
