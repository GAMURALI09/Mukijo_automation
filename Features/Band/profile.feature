Feature: Artist profile
  As an existing artist
  I want to update my public profile
  So that clients see my current artist details

  Scenario: Sign in as an artist and save profile details
    Given I open the Mukijo home page
    When I enter the marketplace
    And I choose to register as a talent
    And I select Sign in because I already have an account
    And I sign in with the Artist credentials from login.json
    Then I can open the Artist profile
    And I complete the Artist profile details
    And I save the profile changes