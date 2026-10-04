import type { Page } from '@playwright/test';

const paymentsLocators = (page: Page) => ({
	enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
	paymentsSidebarLink: page.getByRole('link', { name: 'Payments', exact: true }),
	paymentsHeading: page.getByRole('heading', { name: 'Payments', exact: true }),
	requestPaymentLink: page.locator('a[href="/sports/payments/create"]').first(),
	groupSelect: page.getByRole('combobox'),
	paymentTitle: page.locator('input[name="title"]'),
	paymentAmount: page.locator('input[name="amount"]'),
	paymentDueDate: page.locator('input[name="dueDate"]'),
	paymentDescription: page.locator('textarea[name="description"]'),
	createRequestButton: page.getByRole('button', { name: 'Create request', exact: true }),
	paymentRequest: (title: string) => page.getByText(title, { exact: true }),
});

export = paymentsLocators;
