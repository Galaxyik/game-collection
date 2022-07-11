const Alexa = require('ask-sdk');

const {
    noState,
    fallbackDefault,
    fallbackBsPlayerTurn,
    fallbackBsAlexaTurn
} = require('../speakOutputs');

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
exports.FallbackIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
        );
    },
    handle(handlerInput) {
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

        if (state === 'battleships') {
            if (bData.bState === 'playerTurn') {
                speakOutput = fallbackBsPlayerTurn;
            } else if (bData.bState === 'alexaTurn') {
                speakOutput = fallbackBsAlexaTurn(bData.shotRow, bData.shotCol);
            }
        } else speakOutput = fallbackDefault;

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
