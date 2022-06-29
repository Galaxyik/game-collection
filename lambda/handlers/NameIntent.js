const Alexa = require('ask-sdk');

const { nameInDB, nameNotInDB } = require('../speakOutputs');

exports.NameIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'NameIntent'
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

        if (state !== 'userSelection') {
            // NameIntent should not be called in this state

            return null; // TODO
        }

        // NameIntent is called in the correct state

        const utterancesObject = handlerInput.requestEnvelope.request.intent.slots;
        // Gets the name no matter what utterance was used
        const name = Object.entries(utterancesObject)
            .map((utteranceArray) => utteranceArray.pop())
            .filter((utterance) =>
                Object.prototype.hasOwnProperty.call(utterance, 'value')
            )[0].value.toLowerCase();

        // Get Data from DB
        const persistentAttributes = (await attributesManager.getPersistentAttributes()) || {};

        if (!Object.prototype.hasOwnProperty.call(persistentAttributes, 'playerNames')) {
            // Player names array not in DB (e.g. when opening game collection for the first time)
            persistentAttributes.playerNames = [];
        }

        const { playerNames } = persistentAttributes;
        if (playerNames.includes(name)) {
            speakOutput = nameInDB(name);
        } else {
            speakOutput = nameNotInDB(name);
            playerNames.push(name);
        }

        // Update session attributes
        sessionAttributes.playerName = name;
        sessionAttributes.state = 'gameSelection';

        // Save session and persistent attributes
        attributesManager.setSessionAttributes(sessionAttributes);
        attributesManager.setPersistentAttributes(persistentAttributes);
        await attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};