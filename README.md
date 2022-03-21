# Discord Bot (Adult.exe)
This bot interfaces with DynamoDB to provide recurring notifications in a specified channel

## **Commands**
  - /adult
  ### **Options**
  - payment_type
    - Type: `String`
    - Description: `What is the payment type? (i.e. house, att, spectrum, furnace, etc)` 
  - total_due:
    - Type: `Number (Float)`
    - Description: `Total amount due?`
  - due_date:
    - Type: `Number (Date YYYY-MM-DD)`
    - Description: `What is the due date? (i.e. 2022-03-15)`
  - num_of_people_paying:
    - Type: `Number (Int)`
    - Description: `Number of people to split between? (i.e. 6)`
  - how_often:
    - Type: `String`
    - Description: `How often should we send notifications? (i.e. daily, monthly, yearly, one_time)`
  - notification_time:
    - Type: `Number (Int)`
    - Description: `What time are we sending notification, in 24 hr time, but only the hour? (i.e. 18) ` *as in 6pm*
  - notification_date:
    - Type: `Number (Int)`
    - Description: `What day are we sending notification? (i.e. 28) ` *the 28th day of the month*
