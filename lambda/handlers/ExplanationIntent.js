const Alexa = require('ask-sdk');

const { battleshipsExplanation, rpsExplanation } = require('../speakOutputs');

exports.ExplanationIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'ExplanationIntent'
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
            (state === 'battleships' &&
                bData.bState !== 'menuSaveExists' &&
                bData.bState !== 'menuSaveNotExists')
        ) {
            // ExplanationIntent should not be called in this state

            return null; // TODO
        }

        // ExplanationIntent is called in the correct state

        if (state === 'battleships') {
            speakOutput = battleshipsExplanation;
        }

        if (state === 'rps') {
            speakOutput = rpsExplanation;
        }

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};