import type { Page } from '@playwright/test';
import myVenuesLocators = require('../../Locators/Sports_venue/My_Venues_locators');

class MyVenuesPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await myVenuesLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = myVenuesLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openMyVenues(): Promise<void> {
		await myVenuesLocators(this.page).myVenuesLink.click();
	}

	async createVenue(venue: {
		name: string;
		description: string;
		address: string;
		city: string;
		contactName: string;
		contactPhone: string;
		openingTime: string;
		closingTime: string;
		sport: string;
	}): Promise<void> {
		const locators = myVenuesLocators(this.page);
		await locators.addVenueButton.click();
		await locators.venueNameInput.fill(venue.name);
		await locators.venueDescriptionInput.fill(venue.description);
		await locators.sportOption(venue.sport).click();
		await locators.streetAddressInput.fill(venue.address);
		await locators.cityInput.fill(venue.city);
		await locators.contactNameInput.fill(venue.contactName);
		await locators.contactPhoneInput.fill(venue.contactPhone);
		await locators.openingTimeInput.fill(venue.openingTime);
		await locators.closingTimeInput.fill(venue.closingTime);
		await locators.createVenueButton.click();
	}

	async openVenueDetails(name: string): Promise<void> {
		const locators = myVenuesLocators(this.page);
		await locators.venueHeading(name).waitFor({ state: 'visible' });
		await locators.viewVenueDetailsLink.click();
	}

	async generateSlots(slots: {
		startDate: string;
		endDate: string;
		startTime: string;
		endTime: string;
		durationMinutes: number;
		price: number;
	}): Promise<void> {
		const locators = myVenuesLocators(this.page);
		await locators.startDateInput.fill(slots.startDate);
		await locators.endDateInput.fill(slots.endDate);
		await locators.startTimeInput.fill(slots.startTime);
		await locators.endTimeInput.fill(slots.endTime);
		await locators.slotDurationInput.fill(String(slots.durationMinutes));
		await locators.slotPriceInput.fill(String(slots.price));
		await locators.generateSlotsButton.click();
	}

	async publishVenue(): Promise<void> {
		await myVenuesLocators(this.page).publishVenueButton.click();
	}

	async goBackToMyVenues(): Promise<void> {
		await myVenuesLocators(this.page).backButton.click();
	}
}

export = MyVenuesPage;