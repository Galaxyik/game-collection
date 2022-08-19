const Alexa = require('ask-sdk');
let { options, playerPoints, computerPoints, tries, maxTries } = require('../utils/rpsConstants');
//let { maxTries } = require('./triesIntent');
//const computerChoice = options[Math.floor(Math.random() * options.length)]; //random choice of options for Alexa

const {
    noState,
    wrongState,
    rpsTie,
    rpsNoViableOption,
    rpsPlayerWinTurn,
    rpsPlayerLoseTurn,
    rpsGameWin,
    rpsGameLose,
    rpsGameTie
} = require('../speakOutputs')

exports.OptionIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'OptionIntent'
        );
    },
    async handle(handlerInput) {
        const { attributesManager } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        //parseInt(maxTries);
        let speakOutput = '';
        
        
        if (!Object.prototype.hasOwnProperty.call(sessionAttributes, 'state')) {
            // Session attributes do not contain state, game collection was not started correctly
            speakOutput = noState;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        
        
        
        let computerChoice = '';
        computerChoice = options[Math.floor(Math.random() * options.length)]; //random choice of options for Alexa
        sessionAttributes.computerChoice = computerChoice;
        
        
        
        

        const { state } = sessionAttributes;
        const rData = sessionAttributes.rData || {};

        if (state !== 'rps' || (state === 'rps' && rData.rState !== 'playerTurn')) {
            // OptionIntent should not be called in this state
            speakOutput = wrongState;

            //return null; // TODO
        return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        if (state === 'rps') {
            // Handle player choice of the three options
            const chosenOption = handlerInput.requestEnvelope.request.intent.slots.option.value.toLowerCase();

            
              switch (winCondition(chosenOption, computerChoice)) {
                case 'noViableOption': {
                 speakOutput = rpsNoViableOption + " " + tries + " " + maxTries + " " + chosenOption+ " " + computerChoice;
                 break;
                }
                case 'sameOption': {
                  speakOutput = rpsTie + " " + tries + " " + maxTries + " " + chosenOption+ " " + computerChoice;
                  break;
                }
                case 'loseCondition': {
                  speakOutput = rpsPlayerLoseTurn + " " + tries + " " + maxTries + " " + chosenOption+ " " + computerChoice;
                  break;
                }
                case 'winCondition': {
                  speakOutput = rpsPlayerWinTurn + " " + tries + " " + maxTries + " " + chosenOption+ " " + computerChoice; // NaN undefined rock scissors
                  break;
                }
                case 'rpsWin': {
                 // Get Data from DB
                const persistentAttributes =
                    (await attributesManager.getPersistentAttributes()) || {};

                // Increment high score
                persistentAttributes.players[
                    sessionAttributes.playerName
                ].rps.playerWins += 1;

                const { playerWins } =
                    persistentAttributes.players[sessionAttributes.playerName].rps;
                const { alexaWins } =
                    persistentAttributes.players[sessionAttributes.playerName].rps;

                // Save persistent attributes
                attributesManager.setPersistentAttributes(persistentAttributes);
                await attributesManager.savePersistentAttributes();

                speakOutput = rpsGameWin + " " + tries + maxTries + " " + chosenOption+ " " + computerChoice;
                sessionAttributes.rData = {
                    rState: 'gameOver'
                };
                  break;
                }
                case 'rpsLose': {
                  speakOutput = rpsGameLose + " " + tries + maxTries + " " + chosenOption+ " " + computerChoice;
                  break;
                }
                case 'rpsTie': {
                  speakOutput = rpsGameTie + " " + tries + maxTries + " " + chosenOption+ " " + computerChoice;
                  break;
                }
                case 'endOfRound': {
                  speakOutput = 'This is the end of the game rps.' + " " + tries + " " + maxTries + " " + chosenOption+ " " + computerChoice;
                }
                default:
            }
        }
        //Save session attributes
        attributesManager.setSessionAttributes(sessionAttributes);

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    }
}

function winCondition(userInput, computerOption) {

    if (tries < maxTries-1) {
  
      if (!options.includes(userInput)) // no viable option is chosen by the user
        return 'noViableOption';
      else if (userInput === computerOption) { // both the computer and the user choose the same option
        tries += 1;
        return 'sameOption';
      } else if (
        (computerOption === 'scissors' && userInput === 'rock') ||
        (computerOption === 'paper' && userInput === 'scissors') ||
        (computerOption === 'rock' && userInput === 'paper')
      ) {                                     // all rules of RPS are considered here, win conditions
        playerPoints += 1;
        tries += 1;
        return 'winCondition'
      } else if (userInput !== computerOption) {                                // lose condition for the player
        computerPoints += 1;
        tries += 1;
        return 'loseCondition'
      }
    } 
    else if ((tries = maxTries-1)) {

      if(playerPoints > computerPoints) {
        return 'rpsWin';
      }
      else if(playerPoints < computerPoints) {
        return 'rpsLose';
      }
      else {
        return 'rpsTie';
    }
  }
  else {
      return 'endOfRound'
  }
}