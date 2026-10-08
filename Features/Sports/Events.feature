Feature: Sports event navigation

	Scenario: Sign in and open the Event page
		Given the visitor is on the Mukijo landing page
		When the visitor enters Sports
		And the visitor signs in with a valid Sports account
        And the visitor selects Event from the sidebar
		Then the Event page is displayed

