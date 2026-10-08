import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import FilesPage = require('../../Pageobject/sports/files_page');
import filesLocators = require('../../Locators/sports/files_locators');

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

async function signInAndOpenFiles(page: Page): Promise<void> {
	const filesPage = new FilesPage(page);
	await filesPage.openLandingPage();
	await filesPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await filesPage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await filesPage.openFiles();
	await expect(page).toHaveURL(/\/sports\/files(?:[/?#]|$)/);
}

test('Club Admin can upload a file from the Files page', async ({ page }) => {
	await signInAndOpenFiles(page);
	const locators = filesLocators(page);
	await expect(locators.filesSidebarLink).toHaveAttribute('aria-current', 'page');
	await expect(locators.filesHeading).toBeVisible();

	const fileName = `automation-upload-${Date.now()}.txt`;
	const filesPage = new FilesPage(page);
	await filesPage.uploadFile({
		name: fileName,
		mimeType: 'text/plain',
		buffer: Buffer.from('Playwright Files module upload verification'),
	});
	await expect(locators.uploadedFileName(fileName).first()).toBeVisible();

	const categories = ['Training', 'Documents', 'Media', 'Finance'] as const;
	for (const category of categories) {
		await filesPage.selectCategory(category);
		await expect(locators.fileListHeading(category)).toBeVisible();
		await page.waitForTimeout(3000);
		await expect.poll(() => page.getByText(category, { exact: true }).count()).toBeGreaterThan(1);
	}

	await filesPage.selectCategory('All');
	await expect(locators.fileListHeading('All files')).toBeVisible();
	await page.waitForTimeout(3000);
	await filesPage.previewFile(fileName);
	await expect(locators.filePreviewDialog(fileName)).toBeVisible();
	await page.waitForTimeout(3000);
	await filesPage.deletePreviewedFile(fileName);
	await expect(locators.deleteConfirmationDialog).toBeHidden();
	await expect(locators.uploadedFileName(fileName)).toHaveCount(0);

	const detailsFileName = 'Sports_BugReports.xlsx';
	await filesPage.openFileDetails(detailsFileName);
	await expect(locators.fileDetailsPanel).toBeVisible();
	await expect(locators.downloadFileButton).toBeVisible();
	await expect(locators.openFullFilePage).toBeVisible();
	await filesPage.clickDownloadFromDetails();
	await expect(locators.fileDetailsPanel).toBeVisible();

	await filesPage.openFullFilePage();
	await expect(page).toHaveURL(/\/sports\/files\/[^/?#]+(?:[?#]|$)/);
	await expect(page.getByRole('heading', { name: detailsFileName, exact: true })).toBeVisible();
	await filesPage.backToFiles();
	await expect(page).toHaveURL(/\/sports\/files(?:[/?#]|$)/);
});