import type { Page } from '@playwright/test';

const eventsLocators = (page: Page) => ({
    enterSports: page.getByRole('link', { name: 'Enter Sports', exact: true }),
    loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
    loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
    signIn: page.getByRole('button', { name: 'Sign in', exact: true }),
    eventsSidebarLink: page.getByRole('link', { name: 'Events', exact: true }),
    eventsHeading: page.getByRole('heading', { name: 'Events', exact: true }),
    createEventLink: page.locator('a[href="/sports/events/create"]').first(),
    eventGroup: page.getByRole('combobox').nth(0),
    eventType: page.getByRole('combobox').nth(1),
    eventName: page.locator('input[name="name"]'),
    eventDate: page.locator('input[type="date"]'),
    eventStartTime: page.locator('input[name="startTime"]'),
    eventEndTime: page.locator('input[name="endTime"]'),
    eventLocation: page.locator('input[name="location"]'),
    eventDescription: page.locator('textarea[name="description"]'),
    submitCreateEvent: page.getByRole('button', { name: 'Create event', exact: true }),
});

export = eventsLocators