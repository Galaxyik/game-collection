// "npm run p:check" to check if there are code style issues
// "npm run p:write" to fix the code style issues
// "node [filename].js" to run the code

/**
* Preparation for the ability to take user input.
*/
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const options = ['rock', 'paper', 'scissors']; // all three options to choose in a game of RPS
  
  let playerPoints = 0;
  let computerPoints = 0;
  const maxTries = 10; // the maximum amount of tries in a game
  let tries = 0;
  
  let winMessage = 'You have WON and reached the maximum amount of tries. The game will be closed now.';
  let loseMessage = 'You have LOST and reached the maximum amount of tries. The game will be closed now.';
  let tieMessage = 'Both opponents have the same amount of points... The game will be closed now.';
  
  function playGame() {
    computerChoice = options[Math.floor(Math.random() * options.length)]; //random choice of options for the computer
  
    if (tries < maxTries) {
      rl.question(
        "Your options are 'rock', 'paper', 'scissors'. Choose one.\n",
        (answer) => {
          console.log(
            `\nYou have chosen ${answer.toLowerCase()} and your opponent has chosen ${computerChoice.toLowerCase()}.\n`
          );
  
          winCondition(answer, computerChoice); // check if and who has won the round of the game
          console.log('tries: ' + tries);
          console.log('playerPoints: ' + playerPoints);
          console.log('computerPoints: ' + computerPoints);
          playAgain();
        }
      );
    } else if ((tries = maxTries)) {
        if(playerPoints > computerPoints) {
          endOfGame(winMessage);
        }
        else if(playerPoints < computerPoints) {
          endOfGame(loseMessage);
        }
        else {
          endOfGame(tieMessage);
      }
    }
  }
  
  function winCondition(userInput, computerOption) {
    userInput = userInput.toLowerCase();
  
    if (!options.includes(userInput)) // no viable option is chosen by the user
      console.log("That's not a viable option.");
    else if (userInput == computerOption) { // both the computer and the user choose the same option
      console.log("There's a tie.");
      tries += 1;
    } else if (
      (computerOption == 'scissors' && userInput == 'rock') ||
      (computerOption == 'paper' && userInput == 'scissors') ||
      (computerOption == 'rock' && userInput == 'paper')
    ) {                                     // all rules of RPS are considered here, win conditions
      playerPoints += 1;
      console.log('You have won.');
      tries += 1;
    } else {                                // lose condition for the player
      computerPoints += 1;
      console.log('You have lost.');
      tries += 1;
    }
  }
  
  function endOfGame(message) {
    console.log(message);
    rl.close();
  }
  
  function playAgain() {
    rl.question(
      'Play again? \nType [yes] to play again, type anything else to not.\n',
      (answer) => (answer.toLowerCase() === 'yes' ? playGame() : rl.close())
    );
  }
  
  playGame();