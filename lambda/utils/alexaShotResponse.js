/* eslint-disable no-use-before-define */
const { boardSize, directions, neutralState, shipsCount } = require('./battleshipsConstants');

let gameState;

let playerShipsSunk;

let alexaShotsBoard;

let shotRow;
let shotCol;

/**
 * Handles the result of a shot (hit, miss, sunk).
 *
 * @param {string} shotResult - Indicates whether the shot was a hit, a miss, or whether the ship sank
 */
function hitOrMiss(shotResult, bData) {
    gameState = bData.gameState;
    playerShipsSunk = bData.playerShipsSunk;
    alexaShotsBoard = bData.alexaShotsBoard;
    shotRow = bData.shotRow;
    shotCol = bData.shotCol;

    let result;
    switch (shotResult) {
        case 'hit': {
            result = hit(bData);
            break;
        }
        case 'miss': {
            result = miss(bData);
            break;
        }
        case 'sunk': {
            result = sunk();
            break;
        }
        default: {
            // Impossible state
            result = 'default';
        }
    }

    return {
        result,
        gameState,
        playerShipsSunk,
        alexaShotsBoard
    };
}

/**
 * Handles a ship hit.
 */
function hit(bData) {
    alexaShotsBoard[shotRow][shotCol] = '1X';
    if (gameState === null) {
        // A new ship is hit
        gameState = {
            possDirections: Object.assign({}, neutralState.possDirections),
            firstShotRow: shotRow,
            firstShotCol: shotCol
        };
    } else {
        // The known ship is hit
        addImplicitShots();
        updatePossShotDirHit();
    }
    ensureShotDirBounds();
    removeAlreadyHitDir();

    // Catches the case when the affected ship is on the edge of the board and
    // should already be sunk, but the player says 'hit'
    if (Object.keys(gameState.possDirections).length === 0) {
        if (hitOrMiss('sunk', bData).result === 'sunk') {
            return 'hitIsSunk';
        }
        // Alexa wins
        return 'hitIsSunkWin';
    }
    return 'hit';
}

/**
 * Handles a miss.
 */
function miss(bData) {
    if (gameState !== null) {
        // A ship is hit but the shot misses
        addImplicitShots();
        updatePossShotDirMiss();
        ensureShotDirBounds();

        // Catches the case when the affected ship is shot on both ends and all the fields in between
        // and should already be sunk, but the player says 'miss'
        if (Object.keys(gameState.possDirections).length === 0) {
            if (hitOrMiss('sunk', bData).result === 'sunk') {
                return 'missIsSunk';
            }
            // Alexa wins
            return 'missIsSunkWin';
        }
    }
    return 'miss';
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

    if (alexaWin()) {
        return 'alexaWin';
    }
    return 'sunk';
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
 * Ensures that Alexa does not shoot at a already hit field when shooting in one direction.
 */
function removeAlreadyHitDir() {
    const { possDirections } = gameState;

    if (
        Object.keys(possDirections)[0] === 'N' &&
        alexaShotsBoard[shotRow + possDirections.N][shotCol][1] === 'X'
    ) {
        delete possDirections.N;
    }

    if (
        Object.keys(possDirections)[0] === 'S' &&
        alexaShotsBoard[shotRow + possDirections.S][shotCol][1] === 'X'
    ) {
        delete possDirections.S;
    }

    if (
        Object.keys(possDirections)[0] === 'W' &&
        alexaShotsBoard[shotRow][shotCol + possDirections.W][1] === 'X'
    ) {
        delete possDirections.W;
    }

    if (
        Object.keys(possDirections)[0] === 'E' &&
        alexaShotsBoard[shotRow][shotCol + possDirections.E][1] === 'X'
    ) {
        delete possDirections.E;
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
 * Fields that are updated by this method are marked with M instead of X.
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
            if (
                newRowPos >= 0 &&
                newRowPos < boardSize &&
                newColPos >= 0 &&
                newColPos < boardSize
            ) {
                alexaShotsBoard[newRowPos][
                    newColPos
                ] = `${alexaShotsBoard[newRowPos][newColPos][0]}X`;
            }
        }
    }
}

function alexaWin() {
    return playerShipsSunk >= shipsCount;
}

module.exports = {
    hitOrMiss
};
