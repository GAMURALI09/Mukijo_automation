import playwrightTest = require('@playwright/test');
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import artistData = require('../../TestData/artist.json');
import ArtistProfilePage = require('../../Pageobject/band/profile_page');
import artistProfileLocators = require('../../Locators/Band/profile_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

const artistLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Artist');
if (!artistLogin) {
	throw new Error('An Artist login record is required in login.json.');
}

test.use({ baseURL: configuration.config.baseURL.trim() });

test('Artist can sign in, update profile details, and verify the public preview', async ({ page }) => {
	test.setTimeout(180_000);
	const profilePage = new ArtistProfilePage(page);

	await profilePage.openLandingPage();
	await profilePage.enterMarketplace();
	await expect(page).toHaveURL(/\/band(?:[/?#]|$)/);

	await profilePage.registerAsTalent();
	await expect(page).toHaveURL(/\/register(?:[/?#]|$)/);
	await profilePage.openSignIn();
	await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);

	await profilePage.signIn(artistLogin.email, artistLogin.password);
	await expect(page).toHaveURL(/\/band\/artist\/dashboard(?:[/?#]|$)/);

	await profilePage.openProfile();
	await expect(page).toHaveURL(/\/band\/artist\/profile(?:[/?#]|$)/);
	await expect(artistProfileLocators(page).profileHeading).toBeVisible();
	await page.waitForTimeout(3000);

	await profilePage.fillProfileDetails(artistData);
	await page.waitForTimeout(3000);

	await profilePage.saveProfileChanges();
	await page.waitForTimeout(3000);
	await expect(artistProfileLocators(page).profileUpdatedToast).toBeVisible();

	await profilePage.configureGalleryMedia(artistData.media);
	await profilePage.configurePricing(artistData.pricing);

	const locators = artistProfileLocators(page);
	await locators.publicPreviewTab.click();
	const preview = locators.publicPreviewPanel;
	await expect(preview).toBeVisible();

	for (const value of [
		artistData.displayName,
		artistData.bio,
		artistData.bandType,
		artistData.award,
		...Object.entries(artistData.languages)
			.filter(([, selected]) => selected)
			.map(([language]) => language),
		...Object.entries(artistData.genres)
			.filter(([, selected]) => selected)
			.map(([genre]) => genre),
		...Object.entries(artistData.equipment)
			.filter(([, selected]) => selected)
			.map(([equipment]) => equipment),
	]) {
		await expect.soft(preview).toContainText(value);
	}

	const performanceRate = artistData.pricing.performanceRate.replace(/\B(?=(\d{3})+(?!\d))/g, ',?');
	const travelCharges = artistData.pricing.travelCharges.replace(/\B(?=(\d{3})+(?!\d))/g, ',?');
	await expect.soft(preview).toContainText(new RegExp(`Base Rate\\s*₹\\s*${performanceRate}`));
	await expect.soft(preview).toContainText(new RegExp(
		`Travel Radius\\s*${artistData.pricing.travelRadius} km limit`,
	));
	await expect.soft(preview).toContainText(new RegExp(`Travel Surcharge\\s*₹\\s*${travelCharges}`));

	for (const image of [
		preview.getByRole('img', { name: 'Cover Banner', exact: true }),
		preview.getByRole('img', { name: 'Avatar', exact: true }),
		...await preview.getByRole('img', { name: /^Gallery image \d+$/ }).all(),
	]) {
		await expect.soft(image).toBeVisible();
		await expect.soft.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth > 0)).toBe(true);
	}

	const galleryImages = preview.getByRole('img', { name: /^Gallery image \d+$/ });
	expect.soft(await galleryImages.count()).toBeGreaterThanOrEqual(1);
	const youtubeFrames = preview.locator('iframe');
	expect.soft(await youtubeFrames.count()).toBeGreaterThanOrEqual(artistData.media.youtubeLinks.length);
	for (const link of artistData.media.youtubeLinks) {
		const videoId = new URL(link).searchParams.get('v');
		expect.soft(videoId).not.toBeNull();
		if (videoId) {
			expect.soft(await preview.locator(`iframe[src*="${videoId}"]`).count()).toBeGreaterThanOrEqual(1);
		}
	}

	const previewVideos = preview.locator('video');
	expect.soft(await previewVideos.count()).toBeGreaterThanOrEqual(1);
	for (const video of await previewVideos.all()) {
		await expect.soft(video).toBeVisible();
		await expect.soft.poll(() => video.evaluate(
			(element: HTMLVideoElement) => Boolean(element.currentSrc || element.querySelector('source')?.src),
		)).toBe(true);
	}
});
