import playwrightTest = require('@playwright/test');
import type { Page } from '@playwright/test';
const { expect } = playwrightTest;
import pollsLocators = require('../../Locators/sports/polls_locators');

class PollsPage {
	private readonly locators: ReturnType<typeof pollsLocators>;

	constructor(private readonly page: Page) {
		this.locators = pollsLocators(this.page);
	}

	async openPolls(): Promise<void> {
		try {
			await expect(this.locators.pollsMenu).toBeVisible();
			await this.locators.pollsMenu.click();
		} catch (error) {
			console.error(`Failed to open polls page via menu click: ${error}`);
			throw error;
		}
	}

	async clickCreatePoll(): Promise<void> {
		try {
			await expect(this.locators.createPoll).toBeVisible();
			await this.locators.createPoll.click();
		} catch (error) {
			console.error(`Failed to click create poll: ${error}`);
			throw error;
		}
	}

	async selectGroup(groupName?: string): Promise<void> {
		try {
			await expect(this.locators.selectGroup).toBeVisible();
			await this.locators.selectGroup.click();
			if (groupName) {
				const option = this.page.getByRole('option', { name: groupName, exact: true });
				await expect(option).toBeVisible();
				await option.click();
			} else {
				const option = this.page.getByRole('option').first();
				await expect(option).toBeVisible();
				await option.click();
			}
		} catch (error) {
			console.error(`Failed to select group: ${error}`);
			throw error;
		}
	}

	private generateRandomString(length: number = 10): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return result;
	}

	async fillQuestion(questionText?: string): Promise<string> {
		try {
			const text = questionText ?? this.generateRandomString(10);
			await expect(this.locators.question).toBeVisible();
			await this.locators.question.click();
			await this.locators.question.fill(text);
			await expect(this.locators.question).toHaveValue(text);
			return text;
		} catch (error) {
			console.error(`Failed to fill question: ${error}`);
			throw error;
		}
	}

	async fillOption(optionText?: string): Promise<string> {
		try {
			const text = optionText ?? this.generateRandomString(10);
			await expect(this.locators.option).toBeVisible();
			await this.locators.option.click();
			await this.locators.option.fill(text);
			await expect(this.locators.option).toHaveValue(text);
			return text;
		} catch (error) {
			console.error(`Failed to fill option: ${error}`);
			throw error;
		}
	}

	async fillOption2(optionText?: string): Promise<string> {
		try {
			const text = optionText ?? this.generateRandomString(10);
			await expect(this.locators.option2).toBeVisible();
			await this.locators.option2.click();
			await this.locators.option2.fill(text);
			await expect(this.locators.option2).toHaveValue(text);
			return text;
		} catch (error) {
			console.error(`Failed to fill option2: ${error}`);
			throw error;
		}
	}

	async setExpiryDate(): Promise<void> {
		try {
			// Calculate today's date + 2 days
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 2);

			// Format to YYYY-MM-DD (standard for date inputs)
			const year = futureDate.getFullYear();
			const month = String(futureDate.getMonth() + 1).padStart(2, '0');
			const day = String(futureDate.getDate()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day}`;

			await expect(this.locators.calender).toBeVisible();
			await this.locators.calender.click();

			// Fill the automatically generated date
			await this.locators.calender.fill(formattedDate);
			await expect(this.locators.calender).toHaveValue(formattedDate);
		} catch (error) {
			console.error(`Failed to set expiry date: ${error}`);
			throw error;
		}
	}

	async clickCreatePollButton(): Promise<void> {
		try {
			await expect(this.locators.createPollButton).toBeVisible();
			await this.locators.createPollButton.click();
		} catch (error) {
			console.error(`Failed to click create poll button: ${error}`);
			throw error;
		}
	}
}

export = PollsPage;
