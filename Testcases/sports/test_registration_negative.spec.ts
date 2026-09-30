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

const duplicateEmail = process.env.REGISTRATION_DUPLICATE_EMAIL;

function getRegistrationRecord(): RegistrationRecord {
	const record = (registrationData as RegistrationRecord[])[0];
	if (!record) {
		throw new Error('At least one registration record is required for negative tests.');
	}
	return record;
}

const record = getRegistrationRecord();

test.use({ baseURL: configuration.config.baseURL.trim() });

async function openRegistration(page: playwrightTest.Page): Promise<RegistrationPage> {
	const registrationPage = new RegistrationPage(page);
	await registrationPage.openLandingPage();
	await registrationPage.clickEnterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await registrationPage.clickCreateOne();
	await expect(page).toHaveURL(/\/register\?callbackUrl=%2Fsports$/);
	return registrationPage;
}

function inlineError(page: playwrightTest.Page, message: string) {
	return page.getByText(message, { exact: true }).first();
}

async function fillValidRegistrationForm(
	registrationPage: RegistrationPage,
	values: { email?: string; password?: string; confirmPassword?: string } = {},
): Promise<void> {
	const email = values.email ?? `negative-${Date.now()}@${record.serverId}.mailosaur.net`;
	await registrationPage.fillRegistrationForm({
		fullName: record.fullName,
		email,
		password: values.password ?? record.password,
		confirmPassword: values.confirmPassword ?? record.confirmPassword,
		accountType: record.accountType,
	});
}

test('shows required-field errors when registration is submitted empty', async ({ page }) => {
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await registrationPage.clickCreateAccount();

	await expect(inlineError(page, 'Must be at least 2 characters')).toBeVisible();
	await expect(inlineError(page, 'Email is required')).toBeVisible();
	await expect(inlineError(page, 'Password must be at least 8 characters')).toBeVisible();
	await expect(inlineError(page, 'Please confirm your password')).toBeVisible();
	await expect(locators.verificationHeading).toBeHidden();
    await page.waitForTimeout(3000);
});


test('rejects an invalid email address', async ({ page }) => {
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage, { email: 'not-an-email' });
	await registrationPage.clickCreateAccount();

	await expect(inlineError(page, 'Enter a valid email address')).toBeVisible();
	await expect(locators.verificationHeading).toBeHidden();
    await page.waitForTimeout(3000);
});

test('rejects a password shorter than eight characters', async ({ page }) => {
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage, {
		password: 'weak',
		confirmPassword: 'weak',
	});
	await registrationPage.clickCreateAccount();

	await expect(inlineError(page, 'Password must be at least 8 characters')).toBeVisible();
	await expect(locators.verificationHeading).toBeHidden();
    await page.waitForTimeout(3000);
});

test('rejects passwords that do not match', async ({ page }) => {
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage, { confirmPassword: 'Different@12345' });
	await registrationPage.clickCreateAccount();

	await expect(inlineError(page, 'Passwords do not match')).toBeVisible();
	await expect(locators.verificationHeading).toBeHidden();
    await page.waitForTimeout(3000);
});

test('requires terms agreement before opening email verification', async ({ page }) => {
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage);
	await locators.termsAgreement.uncheck({ force: true });
	await expect(locators.termsAgreement).not.toBeChecked();

	await registrationPage.clickCreateAccount();

	await expect(locators.termsAgreement).toHaveAttribute('aria-invalid', 'true');
	await expect(locators.verificationHeading).toBeHidden();
});

test('rejects an incorrect email verification code', async ({ page }) => {
	test.setTimeout(60000);
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage);
	await registrationPage.clickCreateAccount();
	await expect(locators.verificationHeading).toBeVisible();
	await expect(locators.verificationCode).toBeVisible();
	await locators.verificationCode.fill('000000');
	await expect(locators.verifyAndCreateAccount).toBeEnabled();
	await locators.verifyAndCreateAccount.click();

	await expect(locators.verificationHeading).toBeVisible();
	await expect(page).toHaveURL(/\/register\?callbackUrl=%2Fsports$/);
    await page.waitForTimeout(3000);
});

test('rejects an email address that already has an account', async ({ page }) => {
	test.skip(!duplicateEmail, 'Set REGISTRATION_DUPLICATE_EMAIL to a dedicated, already-registered test address.');
	const registrationPage = await openRegistration(page);
	const locators = registrationLocators(page);

	await fillValidRegistrationForm(registrationPage, { email: duplicateEmail ?? '' });
	await registrationPage.clickCreateAccount();

	await expect(page.getByText(/email.*(already|registered|exists)|(already|registered|exists).*email/i)).toBeVisible();
	await expect(locators.verificationHeading).toBeHidden();
    await page.waitForTimeout(3000);
});