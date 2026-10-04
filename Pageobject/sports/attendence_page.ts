import type { Dialog, Page } from '@playwright/test';
import attendenceLocators = require('../../Locators/sports/attendence_locators');

class AttendencePage {
	constructor(private readonly page: Page) {}

	async openLandingPage(): Promise<void> {
		await this.page.goto('/');
	}

	async enterSports(): Promise<void> {
		await attendenceLocators(this.page).enterSports.click();
	}

	async signIn(email: string, password: string): Promise<void> {
		const locators = attendenceLocators(this.page);
		await locators.loginEmail.fill(email);
		await locators.loginPassword.fill(password);
		await locators.signIn.click();
	}

	async openAttendance(): Promise<void> {
		await attendenceLocators(this.page).attendanceSidebarLink.click();
	}

	async selectEvent(eventName: string): Promise<void> {
		await attendenceLocators(this.page).eventButton(eventName).click();
	}

	async prepareEventForEditing(): Promise<void> {
		const locators = attendenceLocators(this.page);
		await Promise.any([
			locators.finalizedIndicator.waitFor({ state: 'visible', timeout: 10000 }),
			locators.saveAttendance.waitFor({ state: 'visible', timeout: 10000 }),
		]);

		if (await locators.resetAttendance.isEnabled()) {
			const isFinalized = await locators.finalizedIndicator.isVisible();
			const acceptDialog = (dialog: Dialog) => dialog.accept();
			this.page.on('dialog', acceptDialog);
			try {
				await locators.resetAttendance.click();
				if (isFinalized) {
					await locators.finalizedIndicator.waitFor({ state: 'hidden' });
				}
			} finally {
				this.page.off('dialog', acceptDialog);
			}
		}
	}

	async markMemberPresent(row: ReturnType<ReturnType<typeof attendenceLocators>['attendanceTable']['getByRole']>, memberName: string): Promise<void> {
		await row.getByRole('button', { name: `Mark ${memberName} as Present`, exact: true }).click();
	}

	async markMemberAbsent(row: ReturnType<ReturnType<typeof attendenceLocators>['attendanceTable']['getByRole']>, memberName: string): Promise<void> {
		await row.getByRole('button', { name: `Mark ${memberName} as Absent`, exact: true }).click();
	}

	async saveAttendance(): Promise<void> {
		const saveButton = attendenceLocators(this.page).saveAttendance;
		await saveButton.evaluate((button) => button.scrollIntoView({ block: 'center' }));
		await saveButton.click();
	}

	async openAttendanceHistory(): Promise<void> {
		await attendenceLocators(this.page).attendanceHistoryTab.click();
	}
}

export = AttendencePage;
