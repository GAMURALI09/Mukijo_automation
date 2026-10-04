Feature: Sports payments

	Scenario: Create and display a payment request
		Given the Club Admin is signed in to Sports
		When the Club Admin opens Payments from the sidebar
		And the Club Admin requests a payment for a group
		Then the payment request is displayed on the Payments page
