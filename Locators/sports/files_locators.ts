import type { Page } from '@playwright/test';

const filesLocators = (page: Page) => ({
	enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
	loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
	loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
	signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
	filesSidebarLink: page.locator('a[href="/sports/files"]'),
	filesHeading: page.getByRole('heading', { name: 'Files', exact: true }),
	uploadFilesButton: page.getByRole('button', { name: /^Upload files Click to browse/ }),
	uploadedFileName: (fileName: string) => page.getByText(fileName, { exact: true }),
	categoryFilter: (category: 'All' | 'Training' | 'Documents' | 'Media' | 'Finance') => page.getByRole('button', { name: category, exact: true }),
	fileListHeading: (heading: string) => page.getByRole('heading', { name: heading, exact: true }),
	previewFileButton: (fileName: string) => page.getByRole('button', { name: `Preview ${fileName}`, exact: true }),
	fileDetailsButton: (fileName: string) => page.getByRole('button', { name: `Details of ${fileName}`, exact: true }),
	fileDetailsPanel: page.getByRole('dialog'),
	downloadFileButton: page.getByRole('dialog').getByRole('button', { name: 'Download', exact: true }),
	openFullFilePage: page.getByRole('dialog').getByRole('link', { name: 'Open full page', exact: true }),
	backToFiles: page.getByRole('link', { name: 'Back to files', exact: true }),
	filePreviewDialog: (fileName: string) => page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: fileName, exact: true }) }),
	deleteConfirmationDialog: page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Delete file', exact: true }) }),
});

export = filesLocators;
