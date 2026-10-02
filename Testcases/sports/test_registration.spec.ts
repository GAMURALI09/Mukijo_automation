import playwrightTest = require('@playwright/test');
import process = require('node:process');
import configuration = require('../../Config/config');
import registrationData = require('../../TestData/Registration_data/registration.json');
import registrationLocators = require('../../Locators/sports/registration_locator');
import RegistrationPage = require('../../Pageobject/sports/registration_page');

const { test, expect } = playwrightTest;

type RegistrationRecord = {
	fullName: string;
	serverId: string;
	email: string;
	password: string;
	confirmPassword: string;
	accountType: string;
};

const registrationRecords = registrationData as RegistrationRecord[];

test.use({ baseURL: configuration.config.baseURL.trim() });

function requiredEnvironmentVariable(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Set the ${name} environment variable before running this test.`);
	}
	return value;
}

function getProfileInitials(fullName: string): string {
	const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
	const firstInitial = nameParts[0]?.[0];
	const lastInitial = nameParts.at(-1)?.[0];

	if (!firstInitial || !lastInitial) {
		throw new Error('Registration fullName must not be empty.');
	}

	return `${firstInitial}${lastInitial}`.toUpperCase();
}

async function getEmailVerificationCode(
	apiKey: string,
	serverId: string,
	recipient: string,
	receivedAfter: Date,
): Promise<string> {
	const { default: MailosaurClient } = await import('mailosaur');
	const mailosaur = new MailosaurClient(apiKey);
	const message = await mailosaur.messages.get(
		serverId,
		{ sentTo: recipient },
		{ receivedAfter, timeout: 60000 },
	);
	const code = [...(message.text?.codes ?? []), ...(message.html?.codes ?? [])]
		.map((entry) => entry.value)
		.find((value): value is string => value !== undefined && /^\d{6}$/.test(value));

	if (!code) {
		throw new Error(`No six-digit verification code was found in the email sent to ${recipient}.`);
	}

	return code;
}

for (const [index, record] of registrationRecords.entries()) {
	test(`guest can register and sign in with data set ${index + 1}`, async ({ page }) => {
		test.setTimeout(90000);
		const registrationPage = new RegistrationPage(page);
		const apiKey = requiredEnvironmentVariable('MAILOSAUR_API_KEY');
		const serverId = record.serverId;
		const email = record.email
			.replace('{timestamp}', `${Date.now()}-${index}`)
			.replace('{serverId}', serverId);

		await registrationPage.openLandingPage();
		await registrationPage.clickEnterSports();

		await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
		await registrationPage.clickCreateOne();
		await expect(page).toHaveURL(/\/register\?callbackUrl=%2Fsports$/);
		await registrationPage.fillRegistrationForm({ ...record, email });

		const locators = registrationLocators(page);
		await expect(locators.fullName).toHaveValue(record.fullName);
		await expect(locators.email).toHaveValue(email);
		await expect(locators.password).toHaveValue(record.password);
		await expect(locators.confirmPassword).toHaveValue(record.confirmPassword);
		await expect(locators.accountType).toContainText(record.accountType);
		await expect(locators.createAccount).toBeVisible();

		const emailRequestedAt = new Date();
		await registrationPage.clickCreateAccount();
		await expect(locators.verificationHeading).toBeVisible();
		await expect(locators.verificationCode).toBeVisible();
		await expect(locators.verifyAndCreateAccount).toBeVisible();

		const verificationCode = await getEmailVerificationCode(
			apiKey,
			serverId,
			email,
			emailRequestedAt,
		);
		await registrationPage.verifyEmail(verificationCode);
		await expect(locators.verificationHeading).toBeHidden();
		await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);

		await registrationPage.signIn(email, record.password);
		await expect(page).toHaveURL(/\/sports(?:[/?#]|$)/);

		await registrationPage.openProfileMenu(getProfileInitials(record.fullName));
		await expect(registrationLocators(page).logout).toBeVisible();
		await page.waitForTimeout(3000);
		await registrationPage.logout();
		await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports%2Fdashboard$/);
        
		await page.waitForTimeout(3000);
		await registrationPage.clickBackToHome();
		await expect(page).toHaveURL(/\/$/);
		await page.waitForTimeout(3000);
	});
}
