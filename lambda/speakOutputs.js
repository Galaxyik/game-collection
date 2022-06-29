// userSelection
const nameInDB = name => `Hi ${name}`;
const nameNotInDB = name => `Welcome to Game Collection ${name}! Here you can play many different games.`;

// gameSelection
const battleshipsSave = () => 'Do you want to start a new game, resume from the old save, or get an explanation?';
const battleshipsNoSave = () => 'Do you want to start a new game or get an explanation?';


module.exports = {
    nameInDB,
    nameNotInDB,
    battleshipsSave,
    battleshipsNoSave
};
