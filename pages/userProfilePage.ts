import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class UserProfilePage extends BasePage {
	static locators = {
		profileLink: "//a[@href='?view=change-info']",
		addressInput: "#address",
		saveButton: "button.btn-submit",
		addressField: "#profile-address"
	};

	constructor(page: Page) {
		super(page);
		this.sourceFile = __filename;
	}

	async navigateToProfile() {
		await this.click(UserProfilePage.locators.profileLink);
		await this.waitForVisible(UserProfilePage.locators.addressInput, 5000);
	}

	async updateAddress(address: string) {
		await this.fill(UserProfilePage.locators.addressInput, address);
		await this.click(UserProfilePage.locators.saveButton);
	}

	async getAddress(): Promise<string> {
		const locator = this.page.locator(UserProfilePage.locators.addressField);
		await locator.waitFor({ state: 'visible', timeout: 5000 });
		return (await locator.inputValue?.()) || (await locator.textContent?.()) || '';
	}
}
