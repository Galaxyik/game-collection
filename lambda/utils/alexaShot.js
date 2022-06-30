/* eslint-disable no-use-before-define */

const { boardSize } = require('./battleshipsConstants');

let gameState;

let alexaShotsBoard;

let shotRow;
let shotCol;

/**
 * Shoots at a random field if no ship is hit. Otherwise, it shoots at the ship
 */
exports.shoot = (bData) => {
    gameState = bData.gameState;
    alexaShotsBoard = bData.alexaShotsBoard;
    shotRow = bData.shotRow;
    shotCol = bData.shotCol;

    let row = genShootCord();
    let col = genShootCord();
    if (gameState === null) {
        // No ship has been hit at the moment
        while (alexaShotsBoard[row][col][1] === 'X') {
            // Field has already been shot at
            row = genShootCord();
            col = genShootCord();
        }
    } else {
        // A ship has already been hit
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

    return {
        shotRow: row,
        shotCol: col,
        alexaShotsBoard,
        outputRow: row + 1,
        outputCol: col + 1
    };
};

/**
 * @returns random number from 0 to boardSize - 1
 */
function genShootCord() {
    return Math.floor(Math.random() * boardSize);
}
