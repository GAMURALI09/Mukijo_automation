Feature: Sports registration navigation

	Scenario: Navigate from Sports login to registration as a guest
		Given I am on the Mukijo landing page
		When I click the "Enter Sports" link
		Then I am taken to the Sports login page
		And the login URL contains "callbackUrl=%2Fsports"
		When I click the "Create one" link
		Then I am taken to the Sports registration page
		And the registration URL contains "callbackUrl=%2Fsports"
		When I enter registration details from the data file
		Then the registration form contains the supplied values
		When I click the "Create account" button
		Then the email verification dialog is displayed
		When I enter the registered email and password on the login page
		And I click the "Sign in" button
		Then I am taken to the Sports dashboard
		When I click the profile avatar
		Then the profile menu displays "Log out"
		When I click "Log out"
		Then I am taken to the login page for the Sports dashboard
		When I click the "Back to home" link
		Then I am taken to the Mukijo landing page
