/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

// ---- TODO remove; for testing only ----
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
// ---------------------------------------

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

const directions = {
    N: -1,
    S: 1,
    W: -1,
    E: 1
};

const neutralState = {
    possDirections: { ...directions },
    firstShotRow: 0,
    firstShotCol: 0
};

let gameState = null;

let playerShipsSunk = 0;
let alexaShipsSunk = 0;

const boardSize = 10;

const alexaShotsBoard = new Array(boardSize);
let alexaPiecesBoard = new Array(boardSize);

let shotRow = 0;
let shotCol = 0;

(async function main() {
    initBoards();
    alexaPiecesBoard = selectPiecesBoard();

    // ---- Testing ---------------
    const rl = readline.createInterface({ input, output });

    let skipPlayer = false;
    while (true) {
        if (!skipPlayer) {
            const inputRow = await rl.question('Row: ');
            const inputCol = await rl.question('Col: ');

            const playerTurnAgain = playerShot(inputRow, inputCol);
            printBoard(alexaPiecesBoard);
            if (playerTurnAgain) {
                console.log('Its your turn again');
                continue;
            }
        }
        skipPlayer = false;
        shoot();
        const shotResult = await rl.question('shootResult: ');
        const kiTurnAgain = hitOrMiss(shotResult);
        printBoard(alexaShotsBoard);
        if (kiTurnAgain) {
            console.log('Its my turn again');
            skipPlayer = true;
        }
    }
})();

/**
 * Initializes the pieces board and the shots board with 00
 */
function initBoards() {
    for (let row = 0; row < boardSize; row++) {
        alexaPiecesBoard[row] = [];
        alexaShotsBoard[row] = [];

        for (let col = 0; col < boardSize; col++) {
            alexaPiecesBoard[row][col] = '00';
            alexaShotsBoard[row][col] = '00';
        }
    }
}

function selectPiecesBoard() {
    return [
        ['10', '00', '00', '00', '00', '10', '10', '10', '00', '10'],
        ['10', '00', '00', '00', '00', '00', '00', '00', '00', '10'],
        ['10', '00', '10', '10', '10', '10', '00', '00', '00', '10'],
        ['10', '00', '00', '00', '00', '00', '00', '10', '00', '00'],
        ['10', '00', '10', '10', '00', '00', '00', '10', '00', '00'],
        ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
        ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
        ['10', '00', '00', '00', '10', '10', '10', '10', '00', '00'],
        ['10', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
        ['00', '00', '00', '10', '10', '10', '00', '00', '10', '10']
    ];
}

/* function placePiece(row, col, dir, ship) {
  if (!Object.prototype.hasOwnProperty.call(ships, ship)) {
    console.log('Wrong ship');
    return;
  }

  switch (dir.toUpperCase()) {
    case 'N': {
      break;
    }
    case 'S': {
      break;
    }
    case 'W': {
      break;
    }
    case 'E': {
      break;
    }
    default: {
      console.log('Wrong direction');
    }
  }
} */

/**
 * Shoots at a random field if no ship is hit. Otherwise, it shoots at the ship
 */
function shoot() {
    let row = genShootCord();
    let col = genShootCord();
    if (gameState === null) {
        // No ship is hit
        while (alexaShotsBoard[row][col][1] === 'X') {
            // Field has already yet been shot at
            row = genShootCord();
            col = genShootCord();
        }
    } else {
        // A ship is hit
        const shotDir = Object.keys(gameState.possDirections)[0];

        if (alexaShotsBoard[shotRow][shotCol][0] !== '0') {
            // The previous shot was a hit
            if (shotDir === 'N' || shotDir === 'S') {
                row = shotRow + gameState.possDirections[shotDir];
                col = shotCol;
            } else {
                row = shotRow;
                col = shotCol + gameState.possDirections[shotDir];
            }
        } else if (alexaShotsBoard[shotRow][shotCol][0] === '0') {
            // The previous shot was a miss
            if (shotDir === 'N' || shotDir === 'S') {
                row = gameState.firstShotRow + gameState.possDirections[shotDir];
                col = shotCol;
            } else {
                row = shotRow;
                col = gameState.firstShotCol + gameState.possDirections[shotDir];
            }
        }
    }

    shotRow = row;
    shotCol = col;
    alexaShotsBoard[row][col] = `${alexaShotsBoard[row][col][0]}X`;
    console.log(`Shoot at row: ${row + 1}, col: ${col + 1}`);
}

/**
 * @returns random number from 0 to boardSize - 1
 */
function genShootCord() {
    return Math.floor(Math.random() * boardSize);
}

/**
 * Handles the result of a shot (hit, miss, sunk).
 *
 * @param {string} shotResult - Indicates whether the shot was a hit (HIT), a miss
 * (MISS), or whether the ship sank (SUNK)
 * @returns true if the AI has another turn (on a hit / sunk), false otherwise
 */
function hitOrMiss(shotResult) {
    switch (shotResult.trim().toUpperCase()) {
        case 'HIT': {
            hit();
            return true;
        }
        case 'MISS': {
            miss();
            return false;
        }
        case 'SUNK': {
            sunk();
            return true;
        }
        default: {
            console.log('Error wrong input');
            return false;
        }
    }
}

/**
 * Handles a ship hit.
 */
function hit() {
    alexaShotsBoard[shotRow][shotCol] = '1X';
    if (gameState === null) {
        // A new ship is hit
        gameState = {
            ...neutralState,
            firstShotRow: shotRow,
            firstShotCol: shotCol
        };
    } else {
        // The known ship is hit
        addImplicitShots();
        updatePossShotDirHit();
    }
    ensureShotDirBounds();

    // Catches the case when the affected ship is on the edge of the board and
    // should already be sunk, but the player says HIT
    if (typeof Object.keys(gameState.possDirections)[0] === 'undefined') {
        console.log('Error. The ship should already be sunk and will be treated as such!');
        hitOrMiss('SUNK');
    }
}

/**
 * Handles a miss.
 */
function miss() {
    if (gameState != null) {
        // A ship is hit but the shot misses
        addImplicitShots();
        updatePossShotDirMiss();
        ensureShotDirBounds();
    } else {
        // Nothing
    }
}

/**
 * Handles the sinking of a ship.
 */
function sunk() {
    alexaShotsBoard[shotRow][shotCol] = '1X';
    addFirstLastImplicitShots(gameState.firstShotRow, gameState.firstShotCol);
    addFirstLastImplicitShots(shotRow, shotCol);
    playerShipsSunk += 1;
    gameState = null;

    checkWin();
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirHit() {
    const direction = Object.keys(gameState.possDirections)[0];
    // The first shot (N) or second shot (S) after the first hit is a hit
    // therefore the ship cannot lie horizontally
    if (direction === 'N' || direction === 'S') {
        delete gameState.possDirections.W;
        delete gameState.possDirections.E;
    }
}

/**
 * Ensure that the next shot will be in bound
 */
function ensureShotDirBounds() {
    if (shotRow === 0) {
        delete gameState.possDirections.N;
    }
    if (shotRow === 9) {
        delete gameState.possDirections.S;
    }
    if (shotCol === 0) {
        delete gameState.possDirections.W;
    }
    if (shotCol === 9) {
        delete gameState.possDirections.E;
    }
}

/**
 * Removes directions where the ship cannot lie.
 */
function updatePossShotDirMiss() {
    const direction = Object.keys(gameState.possDirections)[0];
    delete gameState.possDirections[direction];
}

/**
 * Adds the shots to both sides of the shot implied by a hit
 */
function addImplicitShots() {
    if ('N' in gameState.possDirections || 'S' in gameState.possDirections) {
        // The shot was in the direction N or S
        if (shotCol + directions.W >= 0) {
            alexaShotsBoard[shotRow][shotCol + directions.W] = `${
                alexaShotsBoard[shotRow][shotCol + directions.W][0]
            }X`;
        }
        if (shotCol + directions.E < boardSize) {
            alexaShotsBoard[shotRow][shotCol + directions.E] = `${
                alexaShotsBoard[shotRow][shotCol + directions.E][0]
            }X`;
        }
    } else {
        // The shot was in the direction W or E
        if (shotRow + directions.N >= 0) {
            alexaShotsBoard[shotRow + directions.N][shotCol] = `${
                alexaShotsBoard[shotRow + directions.N][shotCol][0]
            }X`;
        }
        if (shotRow + directions.S < boardSize) {
            alexaShotsBoard[shotRow + directions.S][shotCol] = `${
                alexaShotsBoard[shotRow + directions.S][shotCol][0]
            }X`;
        }
    }
}

/**
 * Adds the implied shots around the first and the last hit of the ship.
 *
 * Fields that are updated by this method are marked with M instad of X.
 * 00|0M|0M|0M|00
 * 00|0M|1X|0M|00 <-- first hit
 * 00|0M|1M|0M|00
 * 00|0X|1X|0X|00
 * 00|0M|1M|0M|00
 * 00|0M|1X|0M|00 <-- last hit
 * 00|0M|0M|0M|00
 *
 * Call this method with the location of the first hit and the last hit of the ship.
 */
function addFirstLastImplicitShots(rowPos, colPos) {
    for (let row = -1; row < 2; row++) {
        for (let col = -1; col < 2; col++) {
            const newRowPos = rowPos + row;
            const newColPos = colPos + col;
            if (newRowPos > 0 && newRowPos < boardSize && newColPos > 0 && newColPos < boardSize) {
                alexaShotsBoard[newRowPos][
                    newColPos
                ] = `${alexaShotsBoard[newRowPos][newColPos][0]}X`;
            }
        }
    }
}

/**
 * Handles the player's shot.
 *
 * @param {integer} inputRow Row the player says (starting with 1 up to the size of the board)
 * @param {integer} inputCol Column the player says (starting with 1 up to the size of the board)
 * @returns true if the player has another turn (on a hit / wrong coordinates), false otherwise
 */
function playerShot(inputRow, inputCol) {
    // Transform row and colum index -> row 1 for the player is row 0 in code
    const row = inputRow - 1;
    const col = inputCol - 1;

    // Check bounds
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        console.log(`Out of bounds! The coordinates have to be between 1 and ${boardSize}.`);
        return true;
    }

    // Update board
    alexaPiecesBoard[row][col] = `${alexaPiecesBoard[row][col][0]}X`;

    if (alexaPiecesBoard[row][col][0] === '1') {
        // The shot hits a ship
        if (
            checkAliveVertically(row, col, directions.N) ||
            checkAliveVertically(row, col, directions.S) ||
            checkAliveHorizontally(row, col, directions.W) ||
            checkAliveHorizontally(row, col, directions.E)
        ) {
            // The ship still has unhit fields
            console.log('HIT');
        } else {
            // The ship's last unhit field is hit and it sinks
            alexaShipsSunk += 1;
            console.log('SUNK');
        }
        return true;
    }

    // The shot misses
    console.log('MISS');
    return false;
}

/**
 * Check if the ship is vertical and if there is a spot that hasn't been hit yet.
 *
 * @param {*} row where the shot hit
 * @param {*} col where the shot hit
 * @param {*} dir in which to check
 * @returns true if there is a field that hasn't been hit, false otherwise
 */
function checkAliveVertically(row, col, dir) {
    let alive = false;
    let checkRow = row + dir;

    while (checkRow >= 0 && checkRow < boardSize && alexaPiecesBoard[checkRow][col][0] === '1') {
        alive = alive || alexaPiecesBoard[checkRow][col][1] === '0';
        checkRow += dir;
    }
    return alive;
}

/**
 * Check if the ship is horizontal and if there is a spot that hasn't been hit yet.
 *
 * @param {*} row where the shot hit
 * @param {*} col where the shot hit
 * @param {*} dir in which to check
 * @returns true if there is a field that hasn't been hit, false otherwise
 */
function checkAliveHorizontally(row, col, dir) {
    let alive = false;
    let checkCol = col + dir;

    while (checkCol >= 0 && checkCol < boardSize && alexaPiecesBoard[row][checkCol][0] === '1') {
        alive = alive || alexaPiecesBoard[row][checkCol][1] === '0';
        checkCol += dir;
    }
    return alive;
}

function checkWin() {
    if (playerShipsSunk >= shipsCount) {
        console.log('You loose, all your ships were sunk!');
        return 'PLoose';
    }
    if (alexaShipsSunk >= shipsCount) {
        console.log('You win, all my ships were sunk!');
        return 'PWin';
    }
    return '';
}

// eslint-disable-next-line no-unused-vars
function printBoard(board) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            process.stdout.write(`${board[row][col]} `);
        }
        console.log();
    }
    console.log();
}
