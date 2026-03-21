import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    private readonly firstName = '[data-test="firstName"]';
    private readonly lastName = '[data-test="lastName"]';
    private readonly postalCode = '[data-test="postalCode"]';
    private readonly continueBtn = '[data-test="continue"]';
    private readonly finishBtn = '[data-test="finish"]';
    private readonly summaryInfo = '.summary_info';
    private readonly thankYouHeader = '[data-test="complete-header"]';

    constructor(page: Page) {
        super(page);
    }

    async fillInformation(first: string, last: string, zip: string) {
        await this.page.fill(this.firstName, first);
        await this.page.fill(this.lastName, last);
        await this.page.fill(this.postalCode, zip);
        await this.page.click(this.continueBtn);
    }

    async isSummaryVisible() {
        return this.page.locator(this.summaryInfo);
    }

    async finishCheckout() {
        await this.page.click(this.finishBtn);
    }

    async getSuccessHeader() {
        return this.page.locator(this.thankYouHeader);
    }
}
