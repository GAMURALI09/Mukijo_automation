Feature: client books the artist
  
  Scenario: Sign in as an client and book the artist
   Given I open the Mukijo home page
   When I click the enter marketplace
   And I choose the register as a talent
   And I select the sign in option
   And I sign in with client credentials from login.json
   Then I  redirect to the client home page
   When I click the artist to book the artist
   Then I go to the artist marketplace
   When I select the artist 
   And I click book now button
   And I fill all the details
   And I click submit booking request 