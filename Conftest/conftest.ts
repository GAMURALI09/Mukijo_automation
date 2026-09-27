import { test as base } from '@playwright/test';

type MyFixtures = {
    customUrl: string;
};

// In Playwright TypeScript, we don't have a direct "conftest.py" like Pytest.
// Instead, we use "Fixtures" to share setup across tests. 
// We can define URL overrides or shared data here.

export const test = base.extend<MyFixtures>({
    // Define your custom fixtures here
    customUrl: async ({}, use) => {
        // e.g., Set up a dynamic URL
        await use('https://my-dynamic-url.com');
    },
});

export { expect } from '@playwright/test';
