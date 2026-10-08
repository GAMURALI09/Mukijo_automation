Feature: Sports venue owner management

	Scenario: Venue Owner creates and publishes a venue with slots
		Given the Venue Owner is signed in and opens My Venues
		When the Venue Owner creates a venue with its details
		And the Venue Owner generates available slots
		And the Venue Owner publishes the venue
		Then the published venue is displayed on the My Venues page