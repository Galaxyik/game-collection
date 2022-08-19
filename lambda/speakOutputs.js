// userSelection
const nameInDB = (name) =>
    `Hi ${name}. What do you want to play? You can choose from Rock Paper Scissors and Battleships.`;
const nameNotInDB = (name) =>
    `Welcome to Game Collection ${name}! Here you can play many different games. You can choose from Rock Paper Scissors and Battleships`;

// gameSelection
const battleshipsSave =
    'Do you want to start a new game, resume from the old save, or get an explanation?';
const battleshipsNoSave = 'Do you want to start a new game or get an explanation?';

// battleships: menuSaveExists, menuSaveNotExists
const newGame = "Starting new game. It's your turn.";
const battleshipsExplanation = 'Battleships Explanation TBA';

// battleships: menuSaveExists
const resumeGame = "Loading savegame. It's your turn.";

// battleships: playerTurn
const battleshipsOutOfBounds = (boardSize) =>
    `Out of bounds! The coordinates have to be between 1 and ${boardSize}. It's your turn again`;
const battleshipsHit = "Hit! It's your turn again.";
const battleshipsSunk = "Ship sunk! It's your turn again.";
const battleshipsMiss = (outputRow, outputCol) =>
    `Miss! It's my turn. I shoot at row ${outputRow} column ${outputCol}.`;
const battleshipsPlayerWin = (playerWins, alexaWins) =>
    `You win, you sank all my ships! In total you won ${playerWins} times and I won ${alexaWins} times.`;

// battleships: alexaTurn
const battleshipsHitOrSunk = (outputRow, outputCol) =>
    `It's my turn again. I shoot at row ${outputRow} column ${outputCol}.`;
const battleshipsHitIsSunk = (outputRow, outputCol) =>
    `The ship should already be sunk and will be treated as such! ${battleshipsHitOrSunk(
        outputRow,
        outputCol
    )}`;
const battleshipsAlexaMiss = "It's your turn";
const battleshipsAlexaWin = (playerWins, alexaWins) =>
    `I win, i sank all your ships. In total I won ${alexaWins} times and you won ${playerWins} times.`;
const battleshipsHitIsSunkWin = (playerWins, alexaWins) =>
    `The ship should already be sunk and will be treated as such! ${battleshipsAlexaWin(
        playerWins,
        alexaWins
    )}`;

// rock paper scissors:
const rpsExplanation = 'Rock Paper Scissors TBA';

// rock paper scissors: beforeRPSGame
const rpsAskForNumberOfTurns = "How many rounds do you want to play?";
const rpsNoNegativeTries = "You cannot have a negative amount of tries. Choose one of the following options: Rock, paper, or scissors."
const rpsTooManyTries = "That's a pretty big number, don't you think? Choose one of the following options: Rock, paper, or scissors."
const rpsRightAmountOfTries = "This is an acceptable amount of tries. Choose one of the following options: Rock, paper, or scissors."

// rock paper scissors: RPSGameStart
const rpsNewGame = "Choose one of the following options: Rock, paper, or scissors."

// rock paper scissors: RPSTurn
const rpsTie = "There's a tie."
const rpsNoViableOption = "That's not a viable option. Please try again."
const rpsPlayerWinTurn = "You have won." 
const rpsPlayerLoseTurn = "You have lost." 

// rock paper scissors: AfterRPSGameStart
const rpsGameWin = "You have WON and reached the maximum amount of tries." 
const rpsGameLose = "You have LOST and reached the maximum amount of tries." 
const rpsGameTie = "Both opponents have the same amount of points..."

module.exports = {
    nameInDB,
    nameNotInDB,
    battleshipsSave,
    battleshipsNoSave,
    newGame,
    battleshipsExplanation,
    resumeGame,
    battleshipsOutOfBounds,
    battleshipsHit,
    battleshipsSunk,
    battleshipsMiss,
    battleshipsPlayerWin,
    battleshipsHitOrSunk,
    battleshipsHitIsSunk,
    battleshipsAlexaMiss,
    battleshipsAlexaWin,
    battleshipsHitIsSunkWin,
    rpsExplanation,
    rpsAskForNumberOfTurns,
    rpsNoNegativeTries,
    rpsTooManyTries,
    rpsRightAmountOfTries,
    rpsNewGame,
    rpsTie,
    rpsNoViableOption,
    rpsPlayerWinTurn,
    rpsPlayerLoseTurn,
    rpsGameWin,
    rpsGameLose,
    rpsGameTie
};
