import type { Page } from '@playwright/test';

const bookArtistLocators = (page: Page) => ({
    enterMarketPlace: page.getByRole('link', { name: 'Enter Marketplace', exact: true }),
    registerAsTalent: page.getByRole('link', { name: 'Register as Talent', exact: true }),
    signInLink: page.getByRole('link', { name: 'Sign in', exact: true }),
    loginEmail: page.getByPlaceholder('you@example.com', { exact: true }),
    loginPassword: page.getByPlaceholder('Enter your password', { exact: true }),
    signInButton: page.getByRole('button', { name: 'Sign in', exact: true }),
    artistsLink: page.getByRole('link', { name: 'Artists', exact: true }),
    artistCard: (displayName: string) => page.getByRole('link')
        .filter({ has: page.getByRole('heading', { name: displayName, exact: true }) }),
    bookNow: page.getByRole('button', { name: 'Book Now', exact: true }),
    eventTitle: page.locator('#event_title'),
    eventType: page.locator('#event_type'),
    eventDate: page.locator('#event_date'),
    startTime: page.locator('#start_time'),
    endTime: page.locator('#end_time'),
    guestCount: page.locator('#guest_count'),
    proposedPrice: page.locator('#proposed_price'),
    location: page.locator('#location'),
    address: page.locator('#address'),
    city: page.locator('#city'),
    state: page.locator('#state'),
    country: page.locator('#country'),
    googleMapsCoords: page.locator('#google_maps_coords'),
    specialRequests: page.locator('#special_requests'),
    notes: page.locator('#notes'),
    submitBookingRequest: page.getByRole('button', { name: 'Submit Booking Request', exact: true }).last(),
    bookingWorkspaceHeading: page.getByRole('heading', { name: 'Booking Workspace', exact: true }),
    requestedBookingStatus: page.getByText('Requested', { exact: true }),
    bookingRequestSubmitted: page.getByRole('status')
        .getByText('Booking request submitted successfully!', { exact: true }),
});

export = bookArtistLocators;
