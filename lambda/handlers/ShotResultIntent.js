const Alexa = require('ask-sdk');

const {
    battleshipsHitOrSunk,
    battleshipsHitIsSunk,
    battleshipsHitIsSunkWin,
    battleshipsAlexaMiss,
    battleshipsAlexaWin
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

            return null; // TODO
        }

        const { state } = sessionAttributes;
        const bData = sessionAttributes.bData || {};

        if (state !== 'battleships' || (state === 'battleships' && bData.bState !== 'alexaTurn')) {
            // HitIntent should not be called in this state

            return null; // TODO
        }

        // HitIntent is called in the correct state

        if (state === 'battleships') {
            // Handle player response to alexa shot
            const shotResult =
                handlerInput.requestEnvelope.request.intent.slots.shotResult.value.toLowerCase();

            const shootResultObj = hitOrMiss(shotResult, bData);

            bData.gameState = shootResultObj.gameState;
            bData.playerShipsSunk = shootResultObj.playerShipsSunk;
            bData.alexaShotsBoard = shootResultObj.alexaShotsBoard;

            switch (shootResultObj.result) {
                case 'hit': {
                    // Shoot
                    const shootObj = shoot(bData);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = battleshipsHitOrSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'hitIsSunk': {
                    // Shoot
                    const shootObj = shoot(bData);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = battleshipsHitIsSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'hitIsSunkWin': {
                    // Get Data from DB
                    const persistentAttributes =
                        (await attributesManager.getPersistentAttributes()) || {};

                    // Increment high score
                    persistentAttributes.players[sessionAttributes.playerName].battleships.alexaWins += 1;

                    const { playerWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;
                    const { alexaWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;

                    // Save persistent attributes
                    attributesManager.setPersistentAttributes(persistentAttributes);
                    await attributesManager.savePersistentAttributes();                

                    speakOutput = battleshipsHitIsSunkWin(playerWins, alexaWins);
                    sessionAttributes.bData = {
                        bState: 'alexaWin'
                    };
                    break;
                }
                case 'miss': {
                    speakOutput = battleshipsAlexaMiss;
                    bData.bState = 'playerTurn';
                    break;
                }
                case 'sunk': {
                    // Shoot
                    const shootObj = shoot(bData);
                    bData.shotRow = shootObj.shotRow;
                    bData.shotCol = shootObj.shotCol;
                    bData.alexaShotsBoard = shootObj.alexaShotsBoard;

                    speakOutput = battleshipsHitOrSunk(shootObj.outputRow, shootObj.outputCol);
                    break;
                }
                case 'alexaWin': {
                    // Get Data from DB
                    const persistentAttributes =
                        (await attributesManager.getPersistentAttributes()) || {};

                    // Increment high score
                    persistentAttributes.players[sessionAttributes.playerName].battleships.alexaWins += 1;

                    const { playerWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;
                    const { alexaWins } =
                        persistentAttributes.players[sessionAttributes.playerName].battleships;

                    // Save persistent attributes
                    attributesManager.setPersistentAttributes(persistentAttributes);
                    await attributesManager.savePersistentAttributes();                

                    speakOutput = battleshipsAlexaWin(playerWins, alexaWins);
                    sessionAttributes.bData = {
                        bState: 'alexaWin'
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
