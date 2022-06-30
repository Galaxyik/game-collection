const Alexa = require('ask-sdk');

const { noState, wrongState, resumeGame } = require('../speakOutputs');

exports.ResumeGameIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ResumeGameIntent'
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

        if (
            state !== 'battleships' ||
            (state === 'battleships' && bData.bState !== 'menuSaveExists')
        ) {
            // ResumeGameIntent should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // ResumeGameIntent is called in the correct state

        // Get Data from DB
        const persistentAttributes = (await attributesManager.getPersistentAttributes()) || {};

        if (state === 'battleships') {
            // Load savegame data
            speakOutput = resumeGame;
            const { save } = persistentAttributes.players[sessionAttributes.playerName].battleships;
            sessionAttributes.bData = Object.assign({}, save);
            sessionAttributes.bData.bState = 'playerTurn';
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
