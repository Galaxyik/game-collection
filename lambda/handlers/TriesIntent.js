const Alexa = require('ask-sdk');
const { wrongState,
    rpsAskForNumberOfTurns,
    rpsNoNegativeTries,
    rpsRightAmountOfTries,
    rpsTooManyTries
} = require('../speakOutputs');

exports.TriesIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'TriesIntent'
        );
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        let speakOutput = '';
        
        if (!Object.prototype.hasOwnProperty.call(sessionAttributes, 'state')) {
            // Session attributes do not contain state, game collection was not started correctly
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        const maxTries = handlerInput.requestEnvelope.request.intent.slots.triesamount.value;
        const { state } = sessionAttributes;
        const rData = sessionAttributes.rData || {};
        sessionAttributes.maxTries = maxTries;

        if (state !== 'rps' || (state === 'rps' && rData.rState !== 'chooseTries')) {
            // TriesIntent should not be called in this state
            speakOutput = wrongState;
            rData.rState = 'chooseTries';

            //return null; // TODO
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        if (state === 'rps' && rData.rState === 'chooseTries') {
            //const maxTries = handlerInput.requestEnvelope.request.intent.slots.triesamount.value;

            switch (numberOfTurns(maxTries)) {
                case 'negativeTries': {
                    speakOutput = rpsNoNegativeTries + " " + maxTries;
                    rData.rState = 'chooseTries';
                    break;
                }
                case 'tooManyTries': {
                    speakOutput = rpsTooManyTries + " " + maxTries;
                    rData.rState = 'chooseTries';
                    break;
                }
                case 'rightAmountOfTries': {
                    speakOutput = rpsRightAmountOfTries + " " + maxTries;
                    rData.rState = 'playerTurn';
                    break;
                }
                default:
            }
        }
        //Save session attributes
    attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
}


function numberOfTurns(number) {
    if (number < 0) {
        return 'negativeTries';
    }
    else if (number > 0 && number < 50) {
        return 'rightAmountOfTries';
    }
    else if (number > 50) {
        return 'tooManyTries'
    }
}