Feature: polls automation in mukijo

	Scenario Outline: pools module in sports app
      Given user wants to login to sports with role "<role>", username "<username>", and password "<password>"
      When user navigates to pools page in sports
      Then click on create polls and fill the mandatory data
      
      Examples:
        | role       | username                  | password   |
        | Club Admin | varshaambika876@gmail.com | Varsha@123 |