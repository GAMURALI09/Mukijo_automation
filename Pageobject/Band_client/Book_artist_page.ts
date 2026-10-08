import type { Page } from '@playwright/test';
import bookArtistLocators = require('../../Locators/Band_client/Book_artist_locators');

type ClientBookingData = {
    eventTitlePrefix: string;
    eventType: string;
    eventDateOffsetDays: number;
    startTime: string;
    endTime: string;
    guestCount: string;
    proposedPrice: string;
    location: string;
    address: string;
    city: string;
    state: string;
    country: string;
    googleMapsCoords: string;
    specialRequests: string;
    notes: string;
};

class BookArtistPage {
    constructor(private readonly page: Page) {}

    async openLandingPage(): Promise<void> {
        await this.page.goto('/');
    }

    async enterMarketPlace(): Promise<void> {
        await bookArtistLocators(this.page).enterMarketPlace.click();
    }

    async registerAsTalent(): Promise<void> {
        await bookArtistLocators(this.page).registerAsTalent.click();
    }

    async openSignIn(): Promise<void> {
        await bookArtistLocators(this.page).signInLink.click();
    }

    async signIn(email: string, password: string): Promise<void> {
        const locators = bookArtistLocators(this.page);
        await locators.loginEmail.fill(email);
        await locators.loginPassword.fill(password);
        await locators.signInButton.click();
    }

    async openArtistMarketplace(): Promise<void> {
        await bookArtistLocators(this.page).artistsLink.click();
    }

    async selectArtist(displayName: string): Promise<void> {
        await bookArtistLocators(this.page).artistCard(displayName).click();
    }

    async openBookingRequest(): Promise<void> {
        await bookArtistLocators(this.page).bookNow.click();
    }

    async completeBookingRequest(data: ClientBookingData): Promise<string> {
        const locators = bookArtistLocators(this.page);
        const alphabeticTimestamp = Date.now().toString(36).replace(/[0-9]/g, (digit) =>
            String.fromCharCode(97 + Number(digit)),
        );
        const eventTitle = `${data.eventTitlePrefix} ${alphabeticTimestamp}`;
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + data.eventDateOffsetDays);
        const formattedEventDate = [
            eventDate.getFullYear(),
            String(eventDate.getMonth() + 1).padStart(2, '0'),
            String(eventDate.getDate()).padStart(2, '0'),
        ].join('-');

        await locators.eventTitle.fill(eventTitle);
        await locators.eventType.selectOption(data.eventType);
        await locators.eventDate.fill(formattedEventDate);
        await locators.startTime.fill(data.startTime);
        await locators.endTime.fill(data.endTime);
        await locators.guestCount.fill(data.guestCount);
        await locators.proposedPrice.fill(data.proposedPrice);
        await locators.location.fill(data.location);
        await locators.address.fill(data.address);
        await locators.city.fill(data.city);
        await locators.state.fill(data.state);
        await locators.country.fill(data.country);
        await locators.googleMapsCoords.fill(data.googleMapsCoords);
        await locators.specialRequests.fill(data.specialRequests);
        await locators.notes.fill(data.notes);

        return eventTitle;
    }

    async submitBookingRequest(): Promise<void> {
        await bookArtistLocators(this.page).submitBookingRequest.click();
    }
}

export = BookArtistPage;