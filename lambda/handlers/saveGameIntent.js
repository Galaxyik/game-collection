const Alexa = require('ask-sdk');

const { noState, wrongState, bsContinueClose } = require('../speakOutputs');

exports.SaveGameIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'SaveGameIntent'
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
            // SaveGameIntentHandler should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // SaveGameIntent is called in the correct state

        // Get Data from DB
        const persistentAttributes = (await attributesManager.getPersistentAttributes()) || {};

        if (state === 'battleships') {
            // Save current bData
            persistentAttributes.players[sessionAttributes.playerName].battleships.save = bData;

            speakOutput = bsContinueClose;
            bData.bState = 'saveGame';
        }

        // Save session and persistent attributes
        attributesManager.setSessionAttributes(sessionAttributes);
        attributesManager.setPersistentAttributes(persistentAttributes);
        await attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
