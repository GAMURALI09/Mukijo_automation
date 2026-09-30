import type { Page } from '@playwright/test';
import registrationLocators = require('../../Locators/sports/registration_locator');

type RegistrationFormData = {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
	accountType: string;
};

class RegistrationPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async clickEnterSports(): Promise<void> {
		await registrationLocators(this.page).enterSports.click();
	}

	async clickCreateOne(): Promise<void> {
		await registrationLocators(this.page).createOne.click();
	}

	async fillRegistrationForm(data: RegistrationFormData): Promise<void> {
		const locators = registrationLocators(this.page);

		await locators.fullName.fill(data.fullName);
		await locators.email.fill(data.email);
		await locators.password.fill(data.password);
		await locators.confirmPassword.fill(data.confirmPassword);
		await locators.accountType.click();
		await locators.accountTypeOption(data.accountType).click();
	}

	async clickCreateAccount(): Promise<void> {
		await registrationLocators(this.page).createAccount.click();
	}

	async verifyEmail(code: string): Promise<void> {
		const locators = registrationLocators(this.page);

		await locators.verificationCode.fill(code);
		await locators.verifyAndCreateAccount.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = registrationLocators(this.page);

		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openProfileMenu(initials: string): Promise<void> {
		await registrationLocators(this.page).profileAvatar(initials).click();
	}

	async logout(): Promise<void> {
		await registrationLocators(this.page).logout.click();
	}

	async clickBackToHome(): Promise<void> {
		await registrationLocators(this.page).backToHome.click();
	}
}

export = RegistrationPage;
