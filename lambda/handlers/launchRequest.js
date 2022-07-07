const Alexa = require('ask-sdk');

const { requestName } = require('../speakOutputs');

exports.ContinueIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
        );
    },
    handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        const speakOutput = requestName;

        // Add state to session attributes
        sessionAttributes.state = 'userSelection';  
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
}
