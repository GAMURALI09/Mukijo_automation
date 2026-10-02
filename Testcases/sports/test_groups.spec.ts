import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
import configuration = require('../../Config/config');
import loginData = require('../../TestData/Registration_data/login.json');
import groupsData = require('../../TestData/Registration_data/groups.json');
import GroupsPage = require('../../Pageobject/sports/groups_page');
import groupsLocators = require('../../Locators/sports/groups_locators');

const { test, expect } = playwrightTest;

type LoginRecord = {
	role: string;
	email: string;
	password: string;
};

type GroupRecord = {
	name: string;
	description: string;
	sport: string;
	category: string;
	location: string;
	visibility: 'public' | 'private';
};

type MemberRecord = {
	name: string;
	email: string;
	role: 'Owner' | 'Admin' | 'Coach' | 'Treasurer' | 'Member';
};

type GroupsTestData = {
	groups: GroupRecord[];
	members: MemberRecord[];
};

const clubAdminLogin = (loginData as LoginRecord[]).find(({ role }) => role === 'Club Admin');
if (!clubAdminLogin) {
	throw new Error('A Club Admin login record is required in login.json.');
}
const clubAdminEmail = clubAdminLogin.email;
const clubAdminPassword = clubAdminLogin.password;

test.use({ baseURL: configuration.config.baseURL.trim() });

async function signInAndOpenGroups(page: Page): Promise<GroupsPage> {
	const groupsPage = new GroupsPage(page);
	await groupsPage.openLandingPage();
	await groupsPage.enterSports();
	await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fsports$/);
	await groupsPage.signIn(clubAdminEmail, clubAdminPassword);
	await expect(page).toHaveURL(/\/sports\/dashboard(?:[/?#]|$)/);
	await groupsPage.openGroups();
	await expect(page).toHaveURL(/\/sports\/groups(?:[/?#]|$)/);
	return groupsPage;
}

const { groups, members } = groupsData as GroupsTestData;

for (const groupRecord of groups) {
	test(`Club Admin can create a ${groupRecord.visibility} group`, async ({ page }) => {
		const groupsPage = await signInAndOpenGroups(page);
		await groupsPage.openCreateGroup();
		await expect(page).toHaveURL(/\/sports\/groups\/create(?:[/?#]|$)/);

		const runSuffix = Date.now();
		const groupName = `${groupRecord.name} ${runSuffix}`;
		await groupsPage.createGroup({ ...groupRecord, name: groupName });

		await expect(page).toHaveURL(/\/sports\/groups(?:[/?#]|$)/);
		await expect(page.getByRole('heading', { name: groupName, exact: true })).toBeVisible();

		await groupsPage.openMembersTab();
		await groupsPage.openMemberManager();
		await expect(page).toHaveURL(/\/sports\/groups\/[^/]+\/members(?:[/?#]|$)/);

		const invitedMembers = members;

		for (const member of invitedMembers) {
			await groupsPage.inviteMember(member);
		}

		await groupsPage.filterMembersByRole('All');
		for (const member of invitedMembers) {
			await expect(page.getByText(member.name, { exact: true })).toBeVisible();
			await expect(page.getByText(member.email, { exact: true })).toBeVisible();
		}

		for (const member of invitedMembers) {
			await groupsPage.filterMembersByRole(member.role);
			await expect(groupsLocators(page).memberRoleFilter(member.role)).toHaveAttribute('aria-pressed', 'true');
			await expect(page.getByText(member.name, { exact: true })).toBeVisible();
			await expect(page.getByText(member.email, { exact: true })).toBeVisible();
		}

		const profileMember = invitedMembers.find(({ role }) => role === 'Member');
		if (!profileMember) {
			throw new Error('A Member role test record is required in groups.json.');
		}
		await groupsPage.openFirstMemberProfile();
		await expect(page).toHaveURL(/\/sports\/members\/[^/?#]+(?:[?#]|$)/);
		await expect(page.getByRole('heading', { name: profileMember.name, exact: true })).toBeVisible();
		await expect(page.getByText(profileMember.email, { exact: true })).toBeVisible();
	});
}
