import type { Page } from '@playwright/test';
import artistProfileLocators = require('../../Locators/Band/profile_locators');

type ArtistProfileDetails = {
	legalName: string;
	displayName: string;
	countryCode: string;
	mobileNumber: string;
	yearsOfExperience: string;
	bio: string;
	bandType: string;
	languages: Record<string, boolean>;
	genres: Record<string, boolean>;
	equipment: Record<string, boolean>;
	award: string;
	avatarImagePath: string;
	coverImagePath: string;
	media: {
		photoPath: string;
		album: string;
		videoPath: string;
		videoCategory: string;
		youtubeLinks: string[];
		instagramUrl: string;
		twitterUrl: string;
		facebookUrl: string;
		websiteUrl: string;
	};
		pricing: {
			currency: string;
			performanceRate: string;
			travelRadius: string;
			travelCharges: string;
			weekendSurcharge: string;
			holidaySurcharge: string;
			packages: Array<{
				title: string;
				price: string;
				description: string;
			}>;
			promos: Array<{
				name: string;
				discount: string;
				terms: string;
			}>;
		};
};

class ArtistProfilePage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterMarketplace(): Promise<void> {
		await artistProfileLocators(this.page).enterMarketplace.click();
	}

	async registerAsTalent(): Promise<void> {
		await artistProfileLocators(this.page).registerAsTalent.click();
	}

	async openSignIn(): Promise<void> {
		await artistProfileLocators(this.page).signInLink.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = artistProfileLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signInButton.click();
	}

	async openProfile(): Promise<void> {
		await artistProfileLocators(this.page).profileLink.click();
	}

	async fillProfileDetails(details: ArtistProfileDetails): Promise<void> {
		const locators = artistProfileLocators(this.page);
		await locators.legalName.fill(details.legalName);
		await locators.displayName.fill(details.displayName);
		await locators.countryCode.selectOption(details.countryCode);
		await locators.mobileNumber.fill(details.mobileNumber);
		await locators.yearsOfExperience.fill(details.yearsOfExperience);
		await locators.bio.fill(details.bio);
		await locators.bandType.selectOption(details.bandType);

		for (const [language, shouldPerform] of Object.entries(details.languages)) {
			await this.setChipSelection(locators.languageOption(language), shouldPerform);
		}

		for (const [genre, shouldPlay] of Object.entries(details.genres)) {
			await this.setChipSelection(locators.genreOption(genre), shouldPlay);
		}

		for (const [equipment, shouldHave] of Object.entries(details.equipment)) {
			const option = locators.equipmentOption(equipment);
			const currentState = (await option.innerText()).toLowerCase();
			if (currentState.includes('yes') !== shouldHave) {
				await option.click();
			}
		}

		if (!(await locators.awardItem(details.award).isVisible())) {
			await locators.awardInput.fill(details.award);
			await locators.addAwardButton.click();
		}

		await this.replaceProfileImage('Avatar Photo', details.avatarImagePath);
		await this.replaceProfileImage('Cover Banner', details.coverImagePath);
	}

	private async replaceProfileImage(
		label: 'Avatar Photo' | 'Cover Banner',
		imagePath: string,
	): Promise<void> {
		const section = artistProfileLocators(this.page).imageSection(label);
		const changeButton = section.getByRole('button', { name: 'Change', exact: true });
		const uploadPrompt = section.getByText('Click to upload image', { exact: true });
		const uploadTrigger = (await changeButton.count()) > 0 ? changeButton : uploadPrompt;
		const fileChooserPromise = this.page.waitForEvent('filechooser');
		await uploadTrigger.click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(imagePath);
		await changeButton.waitFor({ state: 'visible' });
		await uploadPrompt.waitFor({ state: 'hidden' });
	}

	private async setChipSelection(option: ReturnType<ReturnType<typeof artistProfileLocators>['languageOption']>, selected: boolean): Promise<void> {
		const classes = (await option.getAttribute('class')) ?? '';
		const isSelected = classes.split(/\s+/).some((className) => className === 'bg-primary');
		if (isSelected !== selected) {
			await option.click();
		}
	}

	async saveProfileChanges(): Promise<void> {
		await artistProfileLocators(this.page).saveProfileButton.click();
	}

	async configureGalleryMedia(media: ArtistProfileDetails['media']): Promise<void> {
		const locators = artistProfileLocators(this.page);
		await locators.galleryMediaTab.click();
		await locators.activeTabPanel.waitFor({ state: 'visible' });
		await locators.albumCategory.selectOption({ label: media.album });

		const priorImageCount = await locators.galleryImages.count();
		await locators.galleryPhotoInput.setInputFiles(media.photoPath);
		await locators.galleryImages.nth(priorImageCount).waitFor({ state: 'visible' });

		const priorVideoCount = await locators.demoVideos.count();
		await locators.demoVideoInput.setInputFiles(media.videoPath);
		await locators.demoVideos.nth(priorVideoCount).waitFor({ state: 'visible', timeout: 150000 });
		const videoCategory = locators.activeTabPanel.locator('select').last();
		await videoCategory.selectOption({ label: media.videoCategory });

		for (const link of media.youtubeLinks) {
			await locators.youtubeLinkInput.fill(link);
			await locators.youtubeLinkAddButton.click();
		}

		await locators.instagramUrl.fill(media.instagramUrl);
		await locators.twitterUrl.fill(media.twitterUrl);
		await locators.facebookUrl.fill(media.facebookUrl);
		await locators.websiteUrl.fill(media.websiteUrl);
		await locators.saveMediaButton.click();
		await locators.mediaSavedToast.waitFor({ state: 'visible' });
	}

	async configurePricing(pricing: ArtistProfileDetails['pricing']): Promise<void> {
		const locators = artistProfileLocators(this.page);
		await locators.pricingTab.click();
		await locators.activeTabPanel.waitFor({ state: 'visible' });

		await locators.currency.selectOption(pricing.currency);
		await locators.performanceRate.fill(pricing.performanceRate);
		await locators.pricingTravelRadius.fill(pricing.travelRadius);
		await locators.travelCharges.fill(pricing.travelCharges);
		await locators.weekendSurcharge.fill(pricing.weekendSurcharge);
		await locators.holidaySurcharge.fill(pricing.holidaySurcharge);

		for (const offer of pricing.packages) {
			if (!(await locators.pricingItem(offer.title).isVisible())) {
				await locators.packageTitleInput.fill(offer.title);
				await locators.packagePriceInput.fill(offer.price);
				await locators.packageDescriptionInput.fill(offer.description);
				await locators.addPackageButton.click();
			}
		}

		for (const promo of pricing.promos) {
			if (!(await locators.pricingItem(promo.name).isVisible())) {
				await locators.promoNameInput.fill(promo.name);
				await locators.promoDiscountInput.fill(promo.discount);
				await locators.promoTermsInput.fill(promo.terms);
				await locators.addPromoButton.click();
			}
		}

		await locators.savePricingButton.click();
		await locators.pricingSavedToast.waitFor({ state: 'visible' });
	}
}

export = ArtistProfilePage;