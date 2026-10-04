import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import BookingPage = require('../../Pageobject/sports/booking_page');
import bookingsLocators = require('../../Locators/sports/bookings_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
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

async function signInAndOpenBookings(page: Page): Promise<BookingPage> {
	const bookingPage = new BookingPage(page);
	await bookingPage.openLandingPage();
	await bookingPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await bookingPage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await bookingPage.openBookings();
	await expect(page).toHaveURL(/\/sports\/bookings(?:[/?#]|$)/);
	return bookingPage;
}

test('Club Admin can create a venue booking when test payment fails', async ({ page }) => {
	const bookingPage = await signInAndOpenBookings(page);
	const locators = bookingsLocators(page);
	await expect(locators.bookingsSidebarLink).toHaveAttribute('aria-current', 'page');
	await expect(locators.bookingsHeading).toBeVisible();
	await expect(locators.upcomingBookingCards.first()).toBeVisible();
	await expect(locators.upcomingBookingCount).toHaveText(/^[1-9]\d*$/);
	await expect(locators.allBookingsCount).toHaveText(/^[1-9]\d*$/);
	const initialCounts = await bookingPage.readBookingCounts();

	await bookingPage.browseVenues();
	await expect(page).toHaveURL(/\/sports\/venues(?:[/?#]|$)/);
	const venueName = await bookingPage.openFirstVenue();
	await expect(page).toHaveURL(/\/sports\/venues\/[^/?#]+(?:[/?#]|$)/);
	await bookingPage.selectDateAndAvailableSlot();
	await bookingPage.selectFirstGroup();

	const paymentAlert = await bookingPage.confirmBookingAndAcceptPaymentAlert();
	expect(paymentAlert).toMatch(/Payment Failed/i);

	await bookingPage.openBookings();
	await expect(page).toHaveURL(/\/sports\/bookings(?:[/?#]|$)/);
	await expect(locators.bookingsHeading).toBeVisible();
	await expect(locators.venueName(venueName).last()).toBeVisible();

	await expect(locators.upcomingBookingCount).toHaveText(String(initialCounts.upcoming + 1));
	await expect(locators.allBookingsCount).toHaveText(String(initialCounts.all + 1));
});
