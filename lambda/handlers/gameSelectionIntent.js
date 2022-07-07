const Alexa = require('ask-sdk');

const { noState, wrongState, bsMenuSave, bsMenuNoSave } = require('../speakOutputs');

exports.GameSelectionIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'GameSelectionIntent'
        );
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        let speakOutput = '';

        if (!Object.prototype.hasOwnProperty.call(sessionAttributes, 'state')) {
            speakOutput = noState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        const { state } = sessionAttributes;

        if (state !== 'gameSelection') {
            // GameSelectionIntent should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // GameSelectionIntent is called in the correct state

        // Get Data from DB
        const persistentAttributes = (await attributesManager.getPersistentAttributes()) || {};

        const selectedGame =
            handlerInput.requestEnvelope.request.intent.slots.game.value.toLowerCase();

        if (selectedGame === 'battleships') {
            sessionAttributes.state = 'battleships';

            if (persistentAttributes.players[sessionAttributes.playerName].battleships.save) {
                // Save exists
                speakOutput = bsMenuSave;

                sessionAttributes.bData = {
                    bState: 'menuSaveExists'
                };
            } else {
                // Save does not exist
                speakOutput = bsMenuNoSave;

                sessionAttributes.bData = {
                    bState: 'menuSaveNotExists'
                };
            }
        } else if (selectedGame === 'rock paper scissors') {
            sessionAttributes.state = 'rps';

            // TODO
            speakOutput = 'TBA';
        } else {
            speakOutput = 'The game was not recognized'; // TODO
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
