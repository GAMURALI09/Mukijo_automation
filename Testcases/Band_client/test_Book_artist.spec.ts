import playwrightTest = require('@playwright/test');
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import artistData = require('../../TestData/artist.json');
import bookingData = require('../../TestData/client.json');
import bookArtistLocators = require('../../Locators/Band_client/Book_artist_locators');
import BookArtistPage = require('../../Pageobject/Band_client/Book_artist_page');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

const clientLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Client');
if (!clientLogin) {
	throw new Error('A Client login record is required in login.json.');
}

test.use({ baseURL: configuration.config.baseURL.trim() });

test('Client can submit an artist booking request', async ({ page }) => {
    test.setTimeout(180_000);
    const bookArtistPage = new BookArtistPage(page);

    await bookArtistPage.openLandingPage();
    await bookArtistPage.enterMarketPlace();
    await expect(page).toHaveURL(/\/band(?:[/?#]|$)/);

    await bookArtistPage.registerAsTalent();
    await expect(page).toHaveURL(/\/register(?:[/?#]|$)/);
    await bookArtistPage.openSignIn();
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

    await bookArtistPage.signIn(clientLogin.email, clientLogin.password);
    await expect(page).toHaveURL(/\/band\/client\/dashboard(?:[/?#]|$)/);

    await bookArtistPage.openArtistMarketplace();
    await expect(page).toHaveURL(/\/band\/marketplace\/artists(?:[/?#]|$)/);

    await bookArtistPage.selectArtist(artistData.displayName);
    await expect(page).toHaveURL(/\/band\/marketplace\/artists\/[^/?#]+(?:[/?#]|$)/);
    await bookArtistPage.openBookingRequest();

    const eventTitle = await bookArtistPage.completeBookingRequest(bookingData);
    await expect(bookArtistLocators(page).eventTitle).toHaveValue(eventTitle);
    await bookArtistPage.submitBookingRequest();

    await expect(page).toHaveURL(/\/band\/client\/bookings(?:[/?#]|$)/);
    const locators = bookArtistLocators(page);
    await expect(locators.bookingWorkspaceHeading).toBeVisible();
    await expect(locators.bookingRequestSubmitted).toBeVisible();
    await expect(locators.requestedBookingStatus.first()).toBeVisible();
    await expect(page.getByText(artistData.displayName, { exact: true }).first()).toBeVisible();
});