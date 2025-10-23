// import { test } from '@playwright/test';
// import { run3AgentFlow } from '../../agents';

// test.describe('3-agent PoC', () => {
//   test('poc-agent: run coordinator in dry-run and log', async ({ page }) => {
//     // use a small inline HTML to avoid external network and make test deterministic
//     const html = `
//       <!doctype html>
//       <html>
//         <head><meta charset="utf-8"><title>PoC</title></head>
//         <body>
//           <div id="exists">I exist</div>
//         </body>
//       </html>
//     `;
//     await page.setContent(html, { waitUntil: 'load' });

//     // craft a fake failure event for PoC that should trigger Generator
//     const evt = {
//       testId: 'poc-1',
//       action: 'click',
//       selector: "#non-existent-abc",
//       // Planner heuristics: avoid 'not visible' or 'timeout' so it falls back to askGenerator
//       errorMessage: 'element not found',
//       domSnapshot: await page.content(),
//     };

//     const res = await run3AgentFlow(page as any, evt as any, 'pages/samplePage.ts', evt.selector);
//     console.log('[tests/poc] 3-agent result:', JSON.stringify(res, null, 2));
//   });
// });
