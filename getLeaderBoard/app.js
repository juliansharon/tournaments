const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {


    const tournamentId = JSON.parse(event.body).tournamentId;

    const queryParms = {
        TableName: process.env.SCORE_TABLE_NAME,
        KeyConditionExpression: 'tournamentId = :tournamentId',
        ExpressionAttributeValues: {
            ':tournamentId': tournamentId,
        }
    };
    try {
        const leaderboard = await ddb.query(queryParms).promise()
        return { statusCode: 200, body: JSON.stringify({ leaderboard }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify(err) };
    }

};
