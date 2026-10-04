import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import paymentData = require('../../TestData/Registration_data/payments.json');
import PaymentsPage = require('../../Pageobject/sports/payments_page');
import paymentsLocators = require('../../Locators/sports/payments_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

type PaymentRecord = {
	group: string;
	title: string;
	amount: number;
	daysUntilDue: number;
	description: string;
};

function getClubAdminLogin(): LoginRecord {
	const clubAdminLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Club Admin');
	if (!clubAdminLogin) {
		throw new Error('A Club Admin login record is required in login.json.');
	}
	return clubAdminLogin;
}

const { email: clubAdminEmail, password: clubAdminPassword } = getClubAdminLogin();

test.use({ baseURL: configuration.config.baseURL.trim() });

async function signInAndOpenPayments(page: Page): Promise<PaymentsPage> {
	const paymentsPage = new PaymentsPage(page);
	await paymentsPage.openLandingPage();
	await paymentsPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await paymentsPage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await paymentsPage.openPayments();
	await expect(page).toHaveURL(/\/sports\/payments(?:[/?#]|$)/);
	return paymentsPage;
}

test('Club Admin can create a payment request', async ({ page }) => {
	const paymentsPage = await signInAndOpenPayments(page);
	const locators = paymentsLocators(page);
	await expect(locators.paymentsSidebarLink).toHaveAttribute('aria-current', 'page');
	await expect(locators.paymentsHeading).toBeVisible();
	await paymentsPage.openRequestPayment();
	await expect(page).toHaveURL(/\/sports\/payments\/create(?:[/?#]|$)/);

	const request = paymentData as PaymentRecord;
	const dueDate = new Date();
	dueDate.setDate(dueDate.getDate() + request.daysUntilDue);
	const formattedDueDate = [
		dueDate.getFullYear(),
		String(dueDate.getMonth() + 1).padStart(2, '0'),
		String(dueDate.getDate()).padStart(2, '0'),
	].join('-');
	const title = `${request.title} ${Date.now()}`;

	await paymentsPage.createPaymentRequest({ ...request, title, dueDate: formattedDueDate });
	await expect(page).toHaveURL(/\/sports\/payments(?:[/?#]|$)/);
	await expect(locators.paymentRequest(title)).toBeVisible();
});
