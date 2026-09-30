import type { Page } from '@playwright/test';

const registrationLocators = (page: Page) => ({
	enterSports: page.getByRole('link', {
		name: 'Enter Sports',
		exact: true,
	}),
	createOne: page.getByRole('link', {
		name: 'Create one',
		exact: true,
	}),
	fullName: page.getByPlaceholder('Jane Cooper', { exact: true }),
	email: page.getByPlaceholder('you@example.com', { exact: true }),
	password: page.getByPlaceholder('Create a password', { exact: true }),
	confirmPassword: page.getByPlaceholder('Re-enter your password', { exact: true }),
	accountType: page.getByRole('combobox'),
	accountTypeOption: (accountType: string) =>
		page.getByRole('option', { name: accountType, exact: true }),
	createAccount: page.getByRole('button', {
		name: 'Create account',
		exact: true,
	}),
	termsAgreement: page.getByRole('checkbox', {
		name: 'I agree to the Terms of Service and Privacy Policy',
		exact: true,
	}),
	verificationHeading: page.getByRole('heading', {
		name: 'Verify your email',
		exact: true,
	}),
	verificationCode: page.getByPlaceholder('000000', { exact: true }),
	verifyAndCreateAccount: page.getByRole('button', {
		name: 'Verify & Create Account',
		exact: true,
	}),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', {
		name: 'Sign in',
		exact: true,
	}),
	profileAvatar: (initials: string) => page.getByText(initials, { exact: true }).last(),
	logout: page.getByText('Log out', { exact: true }),
	backToHome: page.getByRole('link', {
		name: 'Back to home',
		exact: true,
	}),
});

export = registrationLocators;
