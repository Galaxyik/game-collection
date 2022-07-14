const Alexa = require('ask-sdk');

const {
    noState,
    wrongState,
    bsHitSunk,
    bsMissHitIsSunk,
    bsMissHitIsSunkWin,
    bsAlexaMiss,
    bsAlexaWin
} = require('../speakOutputs');
const { hitOrMiss } = require('../utils/alexaShotResponse');
const { shoot } = require('../utils/alexaShot');

exports.ShotResultIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShotResultIntent'
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

        if (state !== 'battleships' || (state === 'battleships' && bData.bState !== 'alexaTurn')) {
            // ShotResultIntent should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // ShotResultIntent is called in the correct state

        if (state === 'battleships') {
            // Handle player response to alexa shot
            const shotResult =
                handlerInput.requestEnvelope.request.intent.slots.shotResult.value.toLowerCase();

            const shootResultObj = hitOrMiss(shotResult, bData);

            const { removedDir } = shootResultObj;

            bData.gameState = shootResultObj.gameState;
            bData.playerShipsSunk = shootResultObj.playerShipsSunk;
            bData.alexaShotsBoard = shootResultObj.alexaShotsBoard;

            switch (shootResultObj.result) {
                case 'hit': {
                    // Shoot
                    const shootObj = shoot(bData, removedDir);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = bsHitSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'missIsSunk':
                case 'hitIsSunk': {
                    // Shoot
                    const shootObj = shoot(bData, removedDir);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = bsMissHitIsSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'missIsSunkWin':
                case 'hitIsSunkWin': {
                    // Get data from DB
                    const persistentAttributes =
                        (await attributesManager.getPersistentAttributes()) || {};

                    // Increment high score
                    persistentAttributes.players[
                        sessionAttributes.playerName
                    ].battleships.alexaWins += 1;

                    const { playerWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;
                    const { alexaWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;

                    // Save persistent attributes
                    attributesManager.setPersistentAttributes(persistentAttributes);
                    await attributesManager.savePersistentAttributes();

                    speakOutput = bsMissHitIsSunkWin(playerWins, alexaWins);
                    sessionAttributes.bData = {
                        bState: 'gameOver'
                    };
                    break;
                }
                case 'miss': {
                    speakOutput = bsAlexaMiss;
                    bData.bState = 'playerTurn';
                    break;
                }
                case 'sunk': {
                    // Shoot
                    const shootObj = shoot(bData, removedDir);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = bsHitSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'alexaWin': {
                    // Get data from DB
                    const persistentAttributes =
                        (await attributesManager.getPersistentAttributes()) || {};

                    // Increment high score
                    persistentAttributes.players[
                        sessionAttributes.playerName
                    ].battleships.alexaWins += 1;

                    const { playerWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;
                    const { alexaWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;

                    // Save persistent attributes
                    attributesManager.setPersistentAttributes(persistentAttributes);
                    await attributesManager.savePersistentAttributes();

                    speakOutput = bsAlexaWin(playerWins, alexaWins);
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
