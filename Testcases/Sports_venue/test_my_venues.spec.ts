import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import venueData = require('../../TestData/venue.json');
import MyVenuesPage = require('../../Pageobject/Sports_venue/my_venues_page');
import myVenuesLocators = require('../../Locators/Sports_venue/My_Venues_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

type VenueTestData = {
	venue: {
		namePrefix: string;
		description: string;
		sport: string;
		address: string;
		city: string;
		contactName: string;
		contactPhonePrefix: string;
		openingTime: string;
		closingTime: string;
	};
	slots: {
		daysUntilStart: number;
		daysAfterStart: number;
		startTime: string;
		endTime: string;
		durationMinutes: number;
		price: number;
	};
};

function getVenueOwnerLogin(): LoginRecord {
	const venueOwnerLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Venue Owner');
	if (!venueOwnerLogin) {
		throw new Error('A Venue Owner login record is required in login.json.');
	}
	return venueOwnerLogin;
}

const { email: venueOwnerEmail, password: venueOwnerPassword } = getVenueOwnerLogin();

test.use({ baseURL: configuration.config.baseURL.trim() });

async function signInAndOpenMyVenues(page: Page): Promise<MyVenuesPage> {
	const myVenuesPage = new MyVenuesPage(page);
	await myVenuesPage.openLandingPage();
	await myVenuesPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await myVenuesPage.signIn(venueOwnerEmail, venueOwnerPassword);
	await expect(page).toHaveURL(/\/sports(?:[/?#]|$)/);
	await page.goto('/sports/owner/venues');
	await myVenuesPage.openMyVenues();
	await expect(page).toHaveURL(/\/sports\/owner\/venues(?:[/?#]|$)/);
	return myVenuesPage;
}

test('Venue Owner can create and publish a venue with generated slots', async ({ page }) => {
	test.setTimeout(60000);
	const myVenuesPage = await signInAndOpenMyVenues(page);
	const locators = myVenuesLocators(page);
	const data = venueData as VenueTestData;
	await expect(locators.myVenuesLink).toHaveAttribute('aria-current', 'page');
	await expect(locators.myVenuesHeading).toBeVisible();

	const timestamp = Date.now();
	const uniqueNameSuffix = String(timestamp)
		.split('')
		.map((digit) => String.fromCharCode(65 + Number(digit)))
		.join('');
	const venueName = `${data.venue.namePrefix} ${uniqueNameSuffix}`;
	expect(venueName).toMatch(/^[A-Za-z ]+$/);
	const phoneSuffix = String(timestamp).slice(-5).padStart(data.venue.contactPhonePrefix.length, '0');
	await myVenuesPage.createVenue({
		name: venueName,
		description: data.venue.description,
		sport: data.venue.sport,
		address: data.venue.address,
		city: data.venue.city,
		contactName: data.venue.contactName,
		contactPhone: `${data.venue.contactPhonePrefix}${phoneSuffix}`,
		openingTime: data.venue.openingTime,
		closingTime: data.venue.closingTime,
	});

	await expect(page).toHaveURL(/\/sports\/owner\/venues(?:[/?#]|$)/);
	await expect(locators.venueHeading(venueName)).toBeVisible();
	await myVenuesPage.openVenueDetails(venueName);
	await expect(page).toHaveURL(/\/sports\/owner\/venues\/[^/?#]+(?:[/?#]|$)/);

	const startDate = new Date();
	startDate.setDate(startDate.getDate() + data.slots.daysUntilStart);
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + data.slots.daysAfterStart);
	const toDateInputValue = (date: Date): string =>
		[
			date.getFullYear(),
			String(date.getMonth() + 1).padStart(2, '0'),
			String(date.getDate()).padStart(2, '0'),
		].join('-');

	await myVenuesPage.generateSlots({
		startDate: toDateInputValue(startDate),
		endDate: toDateInputValue(endDate),
		startTime: data.slots.startTime,
		endTime: data.slots.endTime,
		durationMinutes: data.slots.durationMinutes,
		price: data.slots.price,
	});
	await expect(locators.generatedSlotTime.first()).toBeVisible();

	await myVenuesPage.publishVenue();
	await expect(locators.publishedStatus).toBeVisible();
	await myVenuesPage.goBackToMyVenues();
	await expect(page).toHaveURL(/\/sports\/owner\/venues(?:[/?#]|$)/);
	await expect(locators.myVenuesHeading).toBeVisible();
	await expect(locators.venueHeading(venueName)).toBeVisible();
});