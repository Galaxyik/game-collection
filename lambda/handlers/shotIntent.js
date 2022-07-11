/* eslint-disable no-use-before-define */
const Alexa = require('ask-sdk');

const {
    noState,
    wrongState,
    bsWrongStateAlexaTurn,
    bsOutOfBounds,
    bsPlayerHit,
    bsPlayerSunk,
    bsPlayerMiss,
    bsPlayerWin,
} = require('../speakOutputs');
const { boardSize, directions, shipsCount } = require('../utils/battleshipsConstants');
const { shoot } = require('../utils/alexaShot');

let alexaPiecesBoard;
let alexaShipsSunk;

exports.ShotIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShotIntent'
        );
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        let speakOutput = '';

        if (!Object.prototype.hasOwnProperty.call(sessionAttributes, 'state')) {
            // Session attributes do not contain state, game collection was not started correctly
            speakOutput = noState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        const { state } = sessionAttributes;
        const bData = sessionAttributes.bData || {};

        if (state !== 'battleships' || (state === 'battleships' && bData.bState !== 'playerTurn')) {
            // ShotIntent should not be called in this state
            if (state === 'battleships' && bData.bState === 'alexaTurn') {
                speakOutput = bsWrongStateAlexaTurn(bData.shotRow, bData.shotCol);
            } else {
                speakOutput = wrongState;
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // ShotIntent is called in the correct state

        if (state === 'battleships') {
            // Handle player shot
            const inputRow = handlerInput.requestEnvelope.request.intent.slots.row.value;
            const inputCol = handlerInput.requestEnvelope.request.intent.slots.col.value;

            alexaPiecesBoard = bData.alexaPiecesBoard;
            alexaShipsSunk = bData.alexaShipsSunk;

            switch (playerShot(inputRow, inputCol)) {
                case 'out of bounds': {
                    speakOutput = bsOutOfBounds(boardSize);
                    break;
                }
                case 'hit': {
                    speakOutput = bsPlayerHit;
                    bData.alexaPiecesBoard = alexaPiecesBoard;
                    break;
                }
                case 'sunk': {
                    speakOutput = bsPlayerSunk;
                    bData.alexaPiecesBoard = alexaPiecesBoard;
                    bData.alexaShipsSunk = alexaShipsSunk;
                    break;
                }
                case 'miss': {
                    bData.alexaPiecesBoard = alexaPiecesBoard;

                    const shootObj = shoot(bData);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = bsPlayerMiss(shootObj.outputRow, shootObj.outputCol);
                    bData.bState = 'alexaTurn';
                    break;
                }
                case 'playerWin': {
                    // Get Data from DB
                    const persistentAttributes =
                        (await attributesManager.getPersistentAttributes()) || {};

                    // Increment high score
                    persistentAttributes.players[
                        sessionAttributes.playerName
                    ].battleships.playerWins += 1;

                    const { playerWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;
                    const { alexaWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;

                    // Save persistent attributes
                    attributesManager.setPersistentAttributes(persistentAttributes);
                    await attributesManager.savePersistentAttributes();

                    speakOutput = bsPlayerWin(playerWins, alexaWins);
                    sessionAttributes.bData = {
                        bState: 'gameOver'
                    };
                    break;
                }
                default:
            }
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};

function playerShot(inputRow, inputCol) {
    // Transform row and colum index -> row 1 for the player is row 0 in code
    const row = inputRow - 1;
    const col = inputCol - 1;

    // Check bounds
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return 'out of bounds';
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
            return 'hit';
        }
        // The ship's last unhit field is hit and it sinks
        alexaShipsSunk += 1;

        if (playerWin()) {
            return 'playerWin';
        }
        return 'sunk';
    }
    // The shot misses
    return 'miss';
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

function playerWin() {
    return alexaShipsSunk >= shipsCount;
}
