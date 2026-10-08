import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import eventData = require('../../TestData/Registration_data/events.json');
import EventsPage = require('../../Pageobject/sports/events_page');
import eventsLocators = require('../../Locators/sports/events_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
    role: string;
    email: string;
    password: string;
};

type EventRecord = {
	group: string;
	type: string;
	name: string;
	daysFromNow: number;
	startTime: string;
	endTime: string;
	location: string;
	description: string;
};

const clubAdminLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Club Admin');
if (!clubAdminLogin) {
	throw new Error('A Club Admin login record is required in login.json.');
}
const clubAdminEmail = clubAdminLogin.email;
const clubAdminPassword = clubAdminLogin.password;

test.use({ baseURL: configuration.config.baseURL.trim() });

async function signInAndOpenEvents(page: Page): Promise<void> {
	const eventsPage = new EventsPage(page);
	await eventsPage.openLandingPage();
	await eventsPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await eventsPage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await eventsPage.openEvents();
	await expect(page).toHaveURL(/\/sports\/events(?:[/?#]|$)/);
}

test('Club Admin can create an event from the Events page', async ({ page }) => {
	await signInAndOpenEvents(page);
	const locators = eventsLocators(page);
	await expect(locators.eventsSidebarLink).toHaveAttribute('href', '/sports/events');
	await expect(locators.eventsHeading).toBeVisible();
	await locators.createEventLink.click();
	await expect(page).toHaveURL(/\/sports\/events\/create(?:[/?#]|$)/);

	const eventRecord = eventData as EventRecord;
	const eventDate = new Date();
	eventDate.setDate(eventDate.getDate() + eventRecord.daysFromNow);
	const formattedDate = [
		eventDate.getFullYear(),
		String(eventDate.getMonth() + 1).padStart(2, '0'),
		String(eventDate.getDate()).padStart(2, '0'),
	].join('-');
	const eventName = `${eventRecord.name} ${Date.now()}`;

	const eventsPage = new EventsPage(page);
	await eventsPage.createEvent({ ...eventRecord, name: eventName, date: formattedDate });

	await expect(page).toHaveURL(/\/sports\/events(?:[/?#]|$)/);
	await expect(page.getByRole('heading', { name: eventName, exact: true })).toBeVisible();
});