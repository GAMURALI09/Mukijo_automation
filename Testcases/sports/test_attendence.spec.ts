import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import AttendencePage = require('../../Pageobject/sports/attendence_page');
import attendenceLocators = require('../../Locators/sports/attendence_locators');

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

async function signInAndOpenAttendance(page: Page): Promise<void> {
	const attendancePage = new AttendencePage(page);
	await attendancePage.openLandingPage();
	await attendancePage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await attendancePage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await attendancePage.openAttendance();
	await expect(page).toHaveURL(/\/sports\/attendance(?:[/?#]|$)/);
}

test('Club Admin can view event attendance and attendance history', async ({ page }) => {
	await signInAndOpenAttendance(page);
	const locators = attendenceLocators(page);

	await expect(locators.attendanceSidebarLink).toHaveAttribute('aria-current', 'page');
	await expect(locators.attendanceHeading).toBeVisible();
	await expect(locators.markAttendanceTab).toBeVisible();
	await expect(locators.eventPicker).toBeVisible();
	await expect(locators.eventButtons.first()).toBeVisible();

	const attendancePage = new AttendencePage(page);
	await attendancePage.selectEvent('santhosh');
	await attendancePage.prepareEventForEditing();
	await expect(locators.attendanceTable).toBeVisible();
	const firstMemberRow = locators.attendanceTable.getByRole('row').nth(1);
	await expect(firstMemberRow).toBeVisible();
	const memberName = (await firstMemberRow.locator('td').first().locator('p').innerText()).trim();
	const currentStatus = (await firstMemberRow.getByRole('cell').nth(1).innerText()).trim();
	if (await locators.saveAttendance.isVisible()) {
		await expect(locators.saveAttendance).toBeDisabled();
	}
	const presentButton = firstMemberRow.getByRole('button', { name: `Mark ${memberName} as Present`, exact: true });
	const absentButton = firstMemberRow.getByRole('button', { name: `Mark ${memberName} as Absent`, exact: true });
	if (currentStatus === 'Present') {
		await absentButton.click();
	} else {
		await presentButton.click();
	}
	await expect(locators.saveAttendance).toBeEnabled();
	await attendancePage.saveAttendance();

	await attendancePage.openAttendanceHistory();
	await expect(locators.historyHeading).toBeVisible();
	await expect(locators.viewAttendeesButtons.first()).toBeVisible();
});
