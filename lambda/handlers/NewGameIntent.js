const Alexa = require('ask-sdk');

const { newGame } = require('../speakOutputs');
const { selectPiecesBoard } = require('../utils/piecesBoards');

exports.NewGameIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewGameIntent'
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
            // NewGameIntent should not be called in this state

            return null; // TODO
        }

        // NewGameIntent is called in the correct state

        if (state === 'battleships') {
            // Initialize data for new game
            speakOutput = newGame;

            sessionAttributes.bData = {
                bState: 'playerTurn',
                gameState: null,
                playerShipsSunk: 0,
                alexaShipsSunk: 0,
                // eslint-disable-next-line no-use-before-define
                alexaShotsBoard: initShotsBoards(),
                alexaPiecesBoard: selectPiecesBoard(),
                shotRow: 0,
                shotCol: 0
            };
        }

        // Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
};

/**
 * Initializes the shots board with 00
 */
function initShotsBoards() {
    const boardSize = 10;
    const alexaShotsBoard = new Array(boardSize);

    for (let row = 0; row < boardSize; row++) {
        alexaShotsBoard[row] = [];
        for (let col = 0; col < boardSize; col++) {
            alexaShotsBoard[row][col] = '00';
        }
    }
}
