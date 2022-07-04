// Game collection not started correctly
const noState = "I'm sorry, game collection was not started correctly. Please try again.";

// Wrong state
const wrongState = "You can't do that here.";

// userSelection
const nameInDB = (name) =>
    `Hi ${name}. What do you want to play? You can choose from Rock Paper Scissors and Battleships.`;
const nameNotInDB = (name) =>
    `Welcome to Game Collection ${name}! Here you can play many different games. You can choose from Rock Paper Scissors and Battleships`;

// gameSelection
const battleshipsSave =
    'Do you want to start a new game, resume from the old save, or get an explanation?';
const battleshipsNoSave = 'Do you want to start a new game or get an explanation?';

// go to gameSelection after battleships
const goToGameSelection =
    'What do you want to play? You can choose from Rock Paper Scissors and Battleships.';

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
const battleshipsHitOrMissIsSunk = (outputRow, outputCol) =>
    `The ship should already be sunk and will be treated as such! ${battleshipsHitOrSunk(
        outputRow,
        outputCol
    )}`;
const battleshipsAlexaMiss = "It's your turn";
const battleshipsAlexaWin = (playerWins, alexaWins) =>
    `I win, i sank all your ships. In total I won ${alexaWins} times and you won ${playerWins} times.`;
const battleshipsHitOrMissIsSunkWin = (playerWins, alexaWins) =>
    `The ship should already be sunk and will be treated as such! ${battleshipsAlexaWin(
        playerWins,
        alexaWins
    )}`;

// battleships: playerTurn
const battleshipsSavingGame = 'Do you want to continue the game or close the app?';

// battleships: saveGame
const battleshipsContinue = "Continuing the game. It's your turn.";

module.exports = {
    noState,
    wrongState,
    nameInDB,
    nameNotInDB,
    battleshipsSave,
    battleshipsNoSave,
    goToGameSelection,
    newGame,
    battleshipsExplanation,
    resumeGame,
    battleshipsOutOfBounds,
    battleshipsHit,
    battleshipsSunk,
    battleshipsMiss,
    battleshipsPlayerWin,
    battleshipsHitOrSunk,
    battleshipsHitOrMissIsSunk,
    battleshipsAlexaMiss,
    battleshipsAlexaWin,
    battleshipsHitOrMissIsSunkWin,
    battleshipsSavingGame,
    battleshipsContinue
};
