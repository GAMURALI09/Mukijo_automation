import type { Page } from '@playwright/test';

const attendenceLocators = (page: Page) => ({
	enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
	attendanceSidebarLink: page.locator('a[href="/sports/attendance"]'),
	attendanceHeading: page.getByRole('heading', { name: 'Attendance', exact: true }),
	markAttendanceTab: page.getByRole('tab', { name: 'Mark Attendance', exact: true }),
	attendanceHistoryTab: page.getByRole('tab', { name: 'Attendance History', exact: true }),
	eventPicker: page.getByRole('group', { name: 'Select an event', exact: true }),
	eventButtons: page.getByRole('group', { name: 'Select an event', exact: true }).getByRole('button'),
	eventButton: (eventName: string) => page.getByRole('group', { name: 'Select an event', exact: true }).getByRole('button').filter({ has: page.getByText(eventName, { exact: true }) }),
	attendanceTable: page.getByRole('table'),
	resetAttendance: page.getByRole('button', { name: 'Reset', exact: true }),
	finalizedIndicator: page.getByRole('button', { name: /^Finalized/ }),
	saveAttendance: page.getByRole('button', { name: 'Save', exact: true }),
	historyHeading: page.getByRole('heading', { name: 'Past Sessions & Attendance Records', exact: true }),
	historyRange: (range: '1 Week' | '30 Days' | '90 Days') => page.getByRole('button', { name: range, exact: true }),
	viewAttendeesButtons: page.getByRole('button', { name: 'View attendees', exact: true }),
});

export = attendenceLocators;
