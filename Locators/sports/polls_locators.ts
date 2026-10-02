import type { Page } from '@playwright/test';

const pollsLocators = (page: Page) => ({
	pollsMenu: page.getByRole('link', { name: 'Polls', exact: true }), // Added locator for polls menu
	createPoll: page.getByRole('link', { name: 'Create poll', exact: true }).first(),
	selectGroup: page.locator('button[role="combobox"]'),
	question: page.locator('input[name="question"]'),
	option: page.locator('input[name="options.0.label"]'),
	option2: page.locator('input[name="options.1.label"]'),
	calender: page.locator('input[name="expiresAt"]'),
	createPollButton: page.getByRole('button', { name: 'Create poll', exact: true }),
});

export = pollsLocators;
