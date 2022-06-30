const boardSize = 10;

const directions = {
    N: -1,
    S: 1,
    W: -1,
    E: 1
};

const ships = {
    battleship: {
        count: 1,
        size: 5
    },
    cruiser: {
        count: 2,
        size: 4
    },
    destroyer: {
        count: 3,
        size: 3
    },
    submarine: {
        count: 4,
        size: 2
    }
};

// Calculates how many ships there are
const shipsCount = Object.keys(ships).reduce((acc, ship) => acc + ships[ship].count, 0);

module.exports = {
    boardSize,
    directions,
    shipsCount
};
