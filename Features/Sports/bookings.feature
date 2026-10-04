Feature: Sports venue bookings

	Scenario: Create a venue booking when test payment fails
		Given the Club Admin is signed in to Sports and opens Bookings
		When the Club Admin browses venues and opens a venue
		And the Club Admin selects an available date, slot, and group
		And the Club Admin confirms the booking and accepts the payment failure alert
		Then the venue booking is displayed on the Bookings page
		And the upcoming and all bookings counts each increase by one
