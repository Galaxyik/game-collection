const Alexa = require('ask-sdk');

const { exitSkill } = require('../speakOutputs');

exports.CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
        );
    },
    handle(handlerInput) {
        const speakOutput = exitSkill;

        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
    }
};
