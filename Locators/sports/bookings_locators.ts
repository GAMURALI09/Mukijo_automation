import type { Page } from '@playwright/test';

const bookingsLocators = (page: Page) => ({
	enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
	bookingsSidebarLink: page.getByRole('link', { name: 'Bookings', exact: true }),
	bookingsHeading: page.getByRole('heading', { name: 'Bookings', exact: true }),
	upcomingBookingCards: page.getByRole('tabpanel', { name: 'Upcoming' }).getByRole('heading', { level: 3 }),
	upcomingBookingCount: page.locator('p').filter({ hasText: /^Upcoming$/ }).locator('xpath=following-sibling::p[1]'),
	allBookingsCount: page.locator('p').filter({ hasText: /^All bookings$/ }).locator('xpath=following-sibling::p[1]'),
	browseVenuesLink: page.getByRole('link', { name: 'Browse venues', exact: true }).first(),
	viewVenueDetailsLink: page.getByRole('link', { name: 'View details', exact: true }).first(),
	venueHeading: page.locator('main').getByRole('heading', { level: 1 }).last(),
	dateOptions: page.locator('button[aria-pressed]').filter({ hasText: /(?:MON|TUE|WED|THU|FRI|SAT|SUN)/i }),
	availableSlotOptions: page
		.locator('button[aria-pressed]')
		.filter({ hasText: /\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/ })
		.filter({ hasNotText: /Booked/i }),
	groupSelect: page.getByRole('combobox', { name: 'Select group' }),
	groupOptions: page.getByRole('option'),
	confirmBookingButton: page.getByRole('button', { name: 'Confirm booking', exact: true }),
	venueName: (name: string) => page.getByText(name, { exact: true }),
});

export = bookingsLocators;
