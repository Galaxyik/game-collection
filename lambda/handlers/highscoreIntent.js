const Alexa = require('ask-sdk');

const {
    noState,
    wrongState,
    bsHighscore,
    bsMenuSave,
    bsMenuNoSave,
    bsHighscorePlayerTurn
} = require('../speakOutputs');

exports.HighscoreIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'HighscoreIntent'
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
            (state === 'battleships' &&
                bData.bState !== 'menuSaveExists' &&
                bData.bState !== 'menuSaveNotExists' &&
                bData.bState !== 'playerTurn')
        ) {
            // HighscoreIntent should not be called in this state
            speakOutput = wrongState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }

        // HighscoreIntent is called in the correct state

        if (state === 'battleships') {
            // Get data from DB
            const persistentAttributes = (await attributesManager.getPersistentAttributes()) || {};

            const { playerWins } =
                persistentAttributes.players[sessionAttributes.playerName].battleships;
            const { alexaWins } =
                persistentAttributes.players[sessionAttributes.playerName].battleships;

            speakOutput = bsHighscore(playerWins, alexaWins);

            if (bData.bState === 'menuSaveExists') {
                speakOutput += ` ${bsMenuSave}`;
            } else if (bData.bState === 'menuSaveNotExists') {
                speakOutput += ` ${bsMenuNoSave}`;
            } else {
                speakOutput += ` ${bsHighscorePlayerTurn}`;
            }
        }

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};
