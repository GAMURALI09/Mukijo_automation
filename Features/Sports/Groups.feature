Feature: Sports groups navigation

	Scenario: Sign in and open the Groups page
		Given the visitor is on the Mukijo landing page
		When the visitor enters Sports
		And the visitor signs in with a valid Sports account
		And the visitor selects Groups from the sidebar
		Then the Groups page is displayed
