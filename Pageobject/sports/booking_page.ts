import type { Page } from '@playwright/test';
import bookingsLocators = require('../../Locators/sports/bookings_locators');

class BookingPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await bookingsLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = bookingsLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openBookings(): Promise<void> {
		await bookingsLocators(this.page).bookingsSidebarLink.click();
	}

	async readBookingCounts(): Promise<{ upcoming: number; all: number }> {
		const locators = bookingsLocators(this.page);
		const [upcomingText, allText] = await Promise.all([
			locators.upcomingBookingCount.innerText(),
			locators.allBookingsCount.innerText(),
		]);
		const upcoming = Number(upcomingText.trim());
		const all = Number(allText.trim());
		if (!Number.isInteger(upcoming) || !Number.isInteger(all)) {
			throw new Error(`Could not read booking counts (upcoming: "${upcomingText}", all: "${allText}").`);
		}
		return { upcoming, all };
	}

	async browseVenues(): Promise<void> {
		await bookingsLocators(this.page).browseVenuesLink.click();
	}

	async openFirstVenue(): Promise<string> {
		const locators = bookingsLocators(this.page);
		await locators.viewVenueDetailsLink.click();
		await locators.venueHeading.waitFor({ state: 'visible' });
		return (await locators.venueHeading.innerText()).trim();
	}

	async selectDateAndAvailableSlot(): Promise<void> {
		const locators = bookingsLocators(this.page);
		const dateCount = await locators.dateOptions.count();

		for (let dateIndex = 0; dateIndex < dateCount; dateIndex++) {
			await locators.dateOptions.nth(dateIndex).click();
			const slotCount = await locators.availableSlotOptions.count();
			for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
				const slot = locators.availableSlotOptions.nth(slotIndex);
				if (await slot.isEnabled()) {
					await slot.click();
					return;
				}
			}
		}

		throw new Error('No available venue booking date and slot were found.');
	}

	async selectFirstGroup(): Promise<void> {
		const locators = bookingsLocators(this.page);
		await locators.groupSelect.click();
		const optionCount = await locators.groupOptions.count();
		if (optionCount === 0) {
			throw new Error('No group options were available for the venue booking.');
		}
		await locators.groupOptions.first().click();
	}

	async confirmBookingAndAcceptPaymentAlert(): Promise<string> {
		const dialogPromise = this.page.waitForEvent('dialog');
		await bookingsLocators(this.page).confirmBookingButton.click();
		const dialog = await dialogPromise;
		const message = dialog.message();
		await dialog.accept();
		return message;
	}
}

export = BookingPage;
