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
const battleshipsMiss = "Miss! It's my turn.";
const battleshipsPlayerWin = (playerWins, alexaWins) =>
    `You win, you sank all my ships! In total you won ${playerWins} times and I won ${alexaWins} times.`;

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
    battleshipsPlayerWin
};
