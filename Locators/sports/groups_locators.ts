import type { Page } from '@playwright/test';

const groupsLocators = (page: Page) => ({
	enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
	groupsSidebarLink: page.getByRole('link', { name: 'Groups', exact: true }),
	groupsHeading: page.getByRole('heading', { name: 'Groups', exact: true }),
	createGroupLink: page.getByRole('link', { name: 'Create group', exact: true }),
	groupName: page.locator('input[name="name"]'),
	groupDescription: page.locator('textarea[name="description"]'),
	sportType: page.getByRole('combobox').nth(0),
	groupCategory: page.getByRole('combobox').nth(1),
	groupLocation: page.locator('input[name="location"]'),
	logoUploadButton: page.getByRole('button', { name: /Click to upload a logo/ }),
	publicVisibility: page.getByRole('radio', { name: /Public/ }),
	privateVisibility: page.getByRole('radio', { name: /Private/ }),
	cancelCreateGroup: page.getByRole('link', { name: 'Cancel', exact: true }),
	submitCreateGroup: page.getByRole('button', { name: 'Create group', exact: true }),
	membersTab: page.getByRole('tab', { name: 'Members', exact: true }),
	memberManagerLink: page.getByRole('link', { name: 'Member manager', exact: true }),
	addMemberButton: page.getByRole('button', { name: 'Add member', exact: true }),
	addMemberDialog: page.getByRole('dialog'),
	addMemberName: page.getByRole('dialog').locator('input[name="name"]'),
	addMemberEmail: page.getByRole('dialog').locator('input[name="email"]'),
	addMemberRole: page.getByRole('dialog').getByRole('combobox'),
	sendInviteButton: page.getByRole('dialog').getByRole('button', { name: 'Send invite', exact: true }),
	allMembersFilter: page.getByRole('button', { name: 'All', exact: true }),
	memberRoleFilter: (role: string) => page.getByRole('button', { name: new RegExp('^' + role) }),
	viewProfileLink: page.getByRole('link', { name: 'View profile', exact: true }),
});

export = groupsLocators;
