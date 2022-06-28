const Alexa = require('ask-sdk');
const AWS = require('aws-sdk');
const dbAdapter = require('ask-sdk-dynamodb-persistence-adapter');

const { NameIntentHandler } = require('./handlers/NameIntent');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        NameIntentHandler,
    )
    .addErrorHandlers(ErrorHandler)
    .withPersistenceAdapter(
        new dbAdapter.DynamoDbPersistenceAdapter({
            tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
            dynamoDBClient: new AWS.DynamoDB({
                apiVersion: 'latest',
                region: process.env.DYNAMODB_PERSISTENCE_REGION
            })
        })
    ).lambda;
