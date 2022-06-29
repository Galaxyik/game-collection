const Alexa = require('ask-sdk');

const { newGame } = require('../speakOutputs');

exports.NewGameIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewGameIntent'
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

        if (
            state !== 'battleships' ||
            state === 'battleships' && 
            (bData.bState !== 'menuSaveExists' &&
            bData.bState !== 'menuSaveNotExists')
        ) {
            // GameSelectionIntent should not be called in this state

            return null; // TODO
        }

        // GameSelectionIntent is called in the correct state

        if (state === 'battleships') {
            // Initialize new game
            speakOutput = newGame;

            sessionAttributes.bData = {
                bState: 'playerTurn',
                gameState: null,
                playerShipsSunk: 0,
                alexaShipsSunk: 0,
                alexaShotsBoard: null, // TODO
                alexaPiecesBoard: null, // TODO
                shotRow: 0,
                shotCol: 0
            };
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
