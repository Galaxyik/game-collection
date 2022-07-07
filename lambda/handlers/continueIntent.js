const Alexa = require('ask-sdk');

const { noState, wrongState, bsContinue } = require('../speakOutputs');

exports.ContinueIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ContinueIntent'
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

        if (state !== 'battleships' || (state === 'battleships' && bData.bState !== 'saveGame')) {
            // ContinueIntentHandler should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // ContinueIntent is called in the correct state

        if (state === 'battleships') {
            speakOutput = bsContinue;
            bData.bState = 'playerTurn';
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
