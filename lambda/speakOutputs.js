// Game collection not started correctly
const noState = "I'm sorry, game collection was not started correctly. Please try again.";

// Wrong state
const wrongState = "You can't do that here.";

// Exit Skill
const exitSkill = 'Goodbye!';

// userSelection
const requestName = 'Welcome to game collection. Who is playing?';
const nameInDB = (name) =>
    `Hi ${name}. What do you want to play? You can choose from Rock Paper Scissors and Battleships.`;
const nameNotInDB = (name) =>
    `Welcome to Game Collection ${name}! Here you can play many different games. You can choose from Rock Paper Scissors and Battleships`;

// gameSelection
const bsMenuSave =
    'Do you want to start a new game, resume from the old save, or get an explanation?';
const bsMenuNoSave = 'Do you want to start a new game or get an explanation?';

// go to gameSelection after battleships
const bsGoToGS =
    'What do you want to play? You can choose from Rock Paper Scissors and Battleships.';

// battleships: menuSaveExists, menuSaveNotExists
const bsNewGame = "Starting new game. It's your turn.";
const bsExplanation = 'Battleships Explanation TBA';

// battleships: menuSaveExists
const bsLoadSave = "Loading savegame. It's your turn.";

// battleships: playerTurn
const bsOutOfBounds = (boardSize) =>
    `Out of bounds! The coordinates have to be between 1 and ${boardSize}. It's your turn again`;
const bsPlayerHit = "Hit! It's your turn again.";
const bsPlayerSunk = "Ship sunk! It's your turn again.";
const bsPlayerMiss = (outputRow, outputCol) =>
    `Miss! It's my turn. I shoot at row ${outputRow} column ${outputCol}.`;
const bsPlayerWin = (playerWins, alexaWins) =>
    `You win, you sank all my ships! In total you won ${playerWins} times and I won ${alexaWins} times.`;

// battleships: alexaTurn
const bsHitSunk = (outputRow, outputCol) =>
    `It's my turn again. I shoot at row ${outputRow} column ${outputCol}.`;
const bsMissHitIsSunk = (outputRow, outputCol) =>
    `The ship should already be sunk and will be treated as such! ${bsHitSunk(
        outputRow,
        outputCol
    )}`;
const bsAlexaMiss = "It's your turn";
const bsAlexaWin = (playerWins, alexaWins) =>
    `I win, i sank all your ships. In total I won ${alexaWins} times and you won ${playerWins} times.`;
const bsMissHitIsSunkWin = (playerWins, alexaWins) =>
    `The ship should already be sunk and will be treated as such! ${bsAlexaWin(
        playerWins,
        alexaWins
    )}`;

// battleships: playerTurn
const bsContinueClose = 'Do you want to continue the game or close the app?';

// battleships: saveGame
const bsContinue = "Continuing the game. It's your turn.";

module.exports = {
    noState,
    wrongState,
    exitSkill,
    requestName,
    nameInDB,
    nameNotInDB,
    bsMenuSave,
    bsMenuNoSave,
    bsGoToGS,
    bsNewGame,
    bsExplanation,
    bsLoadSave,
    bsOutOfBounds,
    bsPlayerHit,
    bsPlayerSunk,
    bsPlayerMiss,
    bsPlayerWin,
    bsHitSunk,
    bsMissHitIsSunk,
    bsAlexaMiss,
    bsAlexaWin,
    bsMissHitIsSunkWin,
    bsContinueClose,
    bsContinue
};
