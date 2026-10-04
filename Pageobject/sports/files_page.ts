import type { Page } from '@playwright/test';
import filesLocators = require('../../Locators/sports/files_locators');

class FilesPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await filesLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = filesLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openFiles(): Promise<void> {
		await filesLocators(this.page).filesSidebarLink.click();
	}

	async uploadFile(file: { name: string; mimeType: string; buffer: Buffer }): Promise<void> {
		const fileChooserPromise = this.page.waitForEvent('filechooser');
		await filesLocators(this.page).uploadFilesButton.click();
		const fileChooser = await fileChooserPromise;
		await fileChooser.setFiles(file);
	}

	async selectCategory(category: 'All' | 'Training' | 'Documents' | 'Media' | 'Finance'): Promise<void> {
		await filesLocators(this.page).categoryFilter(category).click();
	}

	async previewFile(fileName: string): Promise<void> {
		const previewButton = filesLocators(this.page).previewFileButton(fileName).first();
		await previewButton.hover();
		await previewButton.click();
	}

	async deletePreviewedFile(fileName: string): Promise<void> {
		const locators = filesLocators(this.page);
		await locators.filePreviewDialog(fileName).getByRole('button', { name: 'Delete', exact: true }).click();
		await locators.deleteConfirmationDialog.getByRole('button', { name: 'Delete', exact: true }).click();
	}

	async openFileDetails(fileName: string): Promise<void> {
		const detailsButton = filesLocators(this.page).fileDetailsButton(fileName).first();
		await detailsButton.hover();
		await detailsButton.click();
	}

	async clickDownloadFromDetails(): Promise<void> {
		await filesLocators(this.page).downloadFileButton.click();
	}

	async openFullFilePage(): Promise<void> {
		await filesLocators(this.page).openFullFilePage.click();
	}

	async backToFiles(): Promise<void> {
		await filesLocators(this.page).backToFiles.click();
	}
}

export = FilesPage;