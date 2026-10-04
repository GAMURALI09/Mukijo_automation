import type { Page } from '@playwright/test';
import eventsLocators = require('../../Locators/sports/events_locators');

class EventsPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await eventsLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = eventsLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openEvents(): Promise<void> {
		await eventsLocators(this.page).eventsSidebarLink.click();
	}

	async openCreateEvent(): Promise<void> {
		await eventsLocators(this.page).createEventLink.click();
	}

	async createEvent(event: {
		group: string;
		type: string;
		name: string;
		date: string;
		startTime: string;
		endTime: string;
		location: string;
		description: string;
	}): Promise<void> {
		const locators = eventsLocators(this.page);
		await locators.eventGroup.click();
		await this.page.getByRole('option', { name: event.group, exact: true }).click();
		await locators.eventType.click();
		await this.page.getByRole('option', { name: event.type, exact: true }).click();
		await locators.eventName.fill(event.name);
		await locators.eventDate.fill(event.date);
		await locators.eventStartTime.fill(event.startTime);
		await locators.eventEndTime.fill(event.endTime);
		await locators.eventLocation.fill(event.location);
		await locators.eventDescription.fill(event.description);
		await locators.submitCreateEvent.click();
	}
}

export = EventsPage;