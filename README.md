# Habit Tracking App - LAP 2 Project

### Contributors:
- [Peter Ly](https://github.com/peterlydev)
- [Ikenna Agada](https://github.com/ikenna98)
- [Nowshad Ahmed](https://github.com/Nowshad10)
- [Ousama Bousba](https://github.com/ousama1234)

## Project Description
This aim of this project was to create a habit tracking website where a user can create an account and login and track a habit of their choosing. They should also be able to choose the frequency at which they want to track that habit.

## Installation & Usage

### Installation
- Fork and clone this repo.
- To **run** the application, make sure you are in the **root directory** and run `bash _scripts/startDev.sh` and this will start the server on port 3000 and the client on port 8080. Navigate to `localhost:8080` to use the application.
- To **test** the application, run `bash _scripts/startTest.sh`.

### Usage
- After running the first command above and navigating to `localhost:8080`, you can either register an account or login. After gaining access to the main site, you can add habits, and how often you want to do this habit and track them!

## Technologies
- HTML/CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- Docker
### Test Coverage
- API test coverage: 84%
- ![API-test-coverage](https://user-images.githubusercontent.com/91071953/163357066-0dda2172-cca2-497f-8dae-c66ed580b96b.png)
## Wins & Challenges
### Wins
- Login/register functionality is all working, and doesn't allow unauthorised users access to the site.
- Users are able to add habits which are only viewable by their specific accounts.
- Getting the buttons to work for the habits, so they update the database accordingly.

### Challenges
- Streaks were hard to implement, due to lack of timing as we has one less day.
- Frontend code was finished late so no time to fully implement client side testing.
