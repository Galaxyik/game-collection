// Game collection not started correctly
const noState = "I'm sorry, game collection was not started correctly. Please try again.";

// Wrong state
const wrongState = "You can't do that here.";

// Exit Skill
const exitSkill = 'Goodbye!';

// Fallback
const fallbackDefault = "Sorry, I don't know about that. Please try again.";
const fallbackBsPlayerTurn =
    "Sorry, I don't know that. You can shoot by saying: Shoot at row X column Y.";
const fallbackBsAlexaTurn = (shotRow, shotCol) =>
    `Sorry, I don't know that. Please answer with miss, hit, or sunk. I shoot at row ${
        shotRow + 1
    } and column ${shotCol + 1}.`;

// userSelection
const requestName = 'Welcome to game collection. Who is playing?';
const nameInDB = (name) =>
    `Hi ${name}. What do you want to play? You can choose from Rock Paper Scissors and Battleships.`;
const nameNotInDB = (name) =>
    `Welcome to Game Collection ${name}! Here you can play many different games. You can choose from Rock Paper Scissors and Battleships`;

// gameSelection
const bsMenuSave =
    'Do you want to start a new game, resume from the old save, or get an explanation, or the high score?';
const bsMenuNoSave = 'Do you want to start a new game, or get an explanation, or the high score?';

// go to gameSelection after battleships
const bsGoToGS =
    'What do you want to play? You can choose from Rock Paper Scissors and Battleships.';

// battleships: menuSaveExists, menuSaveNotExists
const bsNewGame = "Starting new game. It's your turn.";
const bsExplanation =
    'Place your ships on a ten by ten board. You have one size five battleship, two size four cruisers, three size three destroyers, and four size two submarines. There must be at least one space between two ships. To shoot say: Shoot at row X and column Y. If I shoot, answer me with miss, hit, or sunk.';
const bsHighscore = (playerWins, alexaWins) =>
    `You won ${playerWins} games and I won ${alexaWins}.`;
const bsHighscorePlayerTurn = "It's your turn";

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
    `You win, you sank all my ships! In total you won ${playerWins} times and I won ${alexaWins} times. Do you want to exit the skill or go back to the game selection?`;
const bsWrongStateAlexaTurn = (shotRow, shotCol) =>
    `Please answer with miss, hit, or sunk. I shoot at row ${shotRow + 1} and column ${
        shotCol + 1
    }.`;

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
    `I win, i sank all your ships. In total I won ${alexaWins} times and you won ${playerWins} times. Do you want to exit the skill or go back to the game selection?`;
const bsMissHitIsSunkWin = (playerWins, alexaWins) =>
    `The ship should already be sunk and will be treated as such! ${bsAlexaWin(
        playerWins,
        alexaWins
    )}`;

// battleships: playerTurn
const bsContinueClose = 'Do you want to continue the game or close the skill?';

// battleships: saveGame
const bsContinue = "Continuing the game. It's your turn.";

module.exports = {
    noState,
    wrongState,
    exitSkill,
    fallbackDefault,
    fallbackBsPlayerTurn,
    fallbackBsAlexaTurn,
    requestName,
    nameInDB,
    nameNotInDB,
    bsMenuSave,
    bsMenuNoSave,
    bsGoToGS,
    bsNewGame,
    bsExplanation,
    bsHighscore,
    bsHighscorePlayerTurn,
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
    bsWrongStateAlexaTurn,
    bsContinueClose,
    bsContinue
};
