// "npm run p:check" to check if there are code style issues
// "npm run p:write" to fix the code style issues
// "node [filename].js" to run the code

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const options = ['rock', 'paper', 'scissors'];

let playerPoints = 0;
let computerPoints = 0;
const maxTries = 10;
let tries = 0;

function playGame() {
  computerChoice = options[Math.floor(Math.random() * options.length)];

  if (tries < maxTries) {
    rl.question(
      "Your options are 'rock', 'paper', 'sissors'. Choose one.\n",
      (answer) => {
        console.log(
          `\nYou have chosen ${answer.toLowerCase()} and your opponent has chosen ${computerChoice.toLowerCase()}.\n`
        );

        winCondition(answer, computerChoice);
        console.log('tries: ' + tries);
        console.log('playerPoints: ' + playerPoints);
        console.log('computerPoints: ' + computerPoints);
        playAgain();
      }
    );
  } else if ((tries = maxTries)) {
    console.log(
      'You have reached the maximum amount of tries. Close the game now.'
    );
  }

  function winCondition(userInput, computerOption) {
    userInput = userInput.toLowerCase();

    if (!options.includes(userInput))
      console.log("That's not a viable option.");
    else if (userInput == computerOption) {
      console.log("There's a tie.");
      tries += 1;
    } else if (
      (computerOption == 'scissors' && userInput == 'rock') ||
      (computerOption == 'paper' && userInput == 'scissors') ||
      (computerOption == 'rock' && userInput == 'paper')
    ) {
      playerPoints += 1;
      console.log('You have won.');
      tries += 1;
    } else {
      computerPoints += 1;
      console.log('You have lost.');
      tries += 1;
    }
  }

  function playAgain() {
    rl.question(
      'Play again? \nType [yes] to play again, type anything else to not.\n',
      (answer) => (answer.toLowerCase() === 'yes' ? playGame() : rl.close())
    );
  }
}

playGame();
