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
const newGame = 'Starting new game.';

module.exports = {
    nameInDB,
    nameNotInDB,
    battleshipsSave,
    battleshipsNoSave,
    newGame
};
