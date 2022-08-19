const options = ['rock', 'paper', 'scissors']; // all three options to choose in a game of RPS
  
  let playerPoints = 0;
  let computerPoints = 0;
  const maxTries = 10; // the maximum amount of tries in a game
  let tries = 0;


  module.exports = {
    options,
    playerPoints,
    computerPoints,
    maxTries,
    tries,
  }