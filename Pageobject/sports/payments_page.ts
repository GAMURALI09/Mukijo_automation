import type { Page } from '@playwright/test';
import paymentsLocators = require('../../Locators/sports/payments_locators');

class PaymentsPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await paymentsLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = paymentsLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openPayments(): Promise<void> {
		await paymentsLocators(this.page).paymentsSidebarLink.click();
	}

	async openRequestPayment(): Promise<void> {
		await paymentsLocators(this.page).requestPaymentLink.click();
	}

	async createPaymentRequest(request: {
		group: string;
		title: string;
		amount: number;
		dueDate: string;
		description: string;
	}): Promise<void> {
		const locators = paymentsLocators(this.page);
		await locators.groupSelect.click();
		await this.page.getByRole('option', { name: request.group, exact: true }).click();
		await locators.paymentTitle.fill(request.title);
		await locators.paymentAmount.fill(String(request.amount));
		await locators.paymentDueDate.fill(request.dueDate);
		await locators.paymentDescription.fill(request.description);
		await locators.createRequestButton.click();
	}
}

export = PaymentsPage;
