Feature: Sports attendance

	Scenario: Mark attendance for a new event and view its history
		Given the Club Admin is signed in to Sports
		When the Club Admin opens Attendance from the sidebar
		And the Club Admin selects the santhosh event, resetting it first if finalized
		When the Club Admin marks a member present or absent and saves attendance
		When the Club Admin opens Attendance History
		Then past attendance records are displayed
