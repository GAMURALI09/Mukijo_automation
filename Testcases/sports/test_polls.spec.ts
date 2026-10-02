import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import GroupsPage = require('../../Pageobject/sports/groups_page');
import PollsPage = require('../../Pageobject/sports/polls_page');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

// Reading directly from login.json instead of hardcoding
// Reading all records directly from login.json to avoid hardcoding
const loginRecords = loginData as LoginRecord[];

test.use({ baseURL: configuration.config.baseURL.trim() });

for (const data of loginRecords) {
	test(`pools module in sports app with role "${data.role}"`, async ({ page }) => {
		
		await test.step(`Given user wants to login to sports with role "${data.role}"`, async () => {
			const groupsPage = new GroupsPage(page);
			await groupsPage.openLandingPage();
			await groupsPage.enterSports();
			await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
			
			// Using username and password directly from login.json
			await groupsPage.signIn(data.email, data.password);
			await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
		});

		await test.step(`When user navigates to pools page in sports with role "${data.role}"`, async () => {
			const pollsPage = new PollsPage(page);
			await pollsPage.openPolls();
		});

		await test.step(`Then click on create polls and fill the mandatory data with role "${data.role}"`, async () => {
			const pollsPage = new PollsPage(page);

			await pollsPage.clickCreatePoll();
			await pollsPage.selectGroup(); 
			await pollsPage.fillQuestion();
			await pollsPage.fillOption();
			await pollsPage.fillOption2();
			await pollsPage.setExpiryDate();
			await pollsPage.clickCreatePollButton();
		});
	});
}
