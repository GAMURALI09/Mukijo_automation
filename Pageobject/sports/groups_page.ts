import type { Page } from '@playwright/test';
import groupsLocators = require('../../Locators/sports/groups_locators');

class GroupsPage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await groupsLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = groupsLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openGroups(): Promise<void> {
		await groupsLocators(this.page).groupsSidebarLink.click();
	}
	async openCreateGroup(): Promise<void> {
		await groupsLocators(this.page).createGroupLink.click();
	}

	async createGroup(group: {
		name: string;
		description: string;
		sport: string;
		category: string;
		location: string;
		visibility: 'public' | 'private';
	}): Promise<void> {
		const locators = groupsLocators(this.page);
		await locators.groupName.fill(group.name);
		await locators.groupDescription.fill(group.description);
		await locators.sportType.click();
		await this.page.getByRole('option', { name: group.sport, exact: true }).click();
		await locators.groupCategory.click();
		await this.page.getByRole('option', { name: group.category, exact: true }).click();
		await locators.groupLocation.fill(group.location);
		await (group.visibility === 'public' ? locators.publicVisibility : locators.privateVisibility).click();
		await locators.submitCreateGroup.click();
	}

	async openMembersTab(): Promise<void> {
		await groupsLocators(this.page).membersTab.click();
	}

	async openMemberManager(): Promise<void> {
		await groupsLocators(this.page).memberManagerLink.click();
	}

	async inviteMember(member: { name: string; email: string; role: string }): Promise<void> {
		const locators = groupsLocators(this.page);
		await locators.addMemberButton.click();
		await locators.addMemberName.fill(member.name);
		await locators.addMemberEmail.fill(member.email);
		await locators.addMemberRole.click();
		await this.page.getByRole('option', { name: member.role, exact: true }).click();
		await locators.sendInviteButton.click();
	}

	async filterMembersByRole(role: string): Promise<void> {
		const locators = groupsLocators(this.page);
		if (role === 'All') {
			await locators.allMembersFilter.click();
			return;
		}
		await locators.memberRoleFilter(role).click();
	}

	async openFirstMemberProfile(): Promise<void> {
		await groupsLocators(this.page).viewProfileLink.first().click();
	}
}

export = GroupsPage;
