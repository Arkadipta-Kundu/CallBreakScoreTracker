# Call Break Card game score tracker

A web application to keep track of scores in a game of Call Break. The app allows players to enter their bids and tricks won for each round and calculates the scores accordingly. The game state is saved in the browser's local storage, allowing users to continue their game even after refreshing the page.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Player Management**: Add and finalize players for the game.
- **Round Management**: Enter bids and tricks won for each round.
- **Score Calculation**: Automatically calculate scores based on bids and tricks.
- **Local Storage**: Save and restore game state using local storage.
- **Dynamic Scoreboard**: View and edit scores for each player dynamically.
- **Game Completion**: Notify when all rounds are completed.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arkadipta-Kundu/CallBreakScoreTracker
   ```

2. Navigate to the project directory:

   ```bash
   cd CallBreakScoreTracker
   ```

3. Open `index.html` in your favorite web browser.

## Usage

1. Open the app in your web browser.
2. Enter the total number of rounds and start the game.
3. Add players by entering their names and clicking "Add Player".
4. Finalize the players to start entering bids.
5. Enter bids and tricks won for each round.
6. View the scoreboard to see the current scores and ranks.
7. Continue to the next round until all rounds are completed.
8. Start a new game if desired.

## Technologies Used

- **HTML**: Structure of the web application.
- **CSS**: Styling of the web application.
- **JavaScript**: Functionality and logic of the web application.
- **Local Storage**: Saving and restoring game state.
- **Web workers**: Saving and restoring game state.
## Contributing

Contributions are welcome! If you have any ideas, improvements, or bug fixes, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m 'Add some feature'
   ```

4. Push to the branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request.

## License

This project is licensed under the Apache License. See the [LICENSE](LICENSE) file for more information.
