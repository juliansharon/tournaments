const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    const tournamentId = JSON.parse(event.body).tournamentId;
    const getparams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            tournamentId: tournamentId
        }
    }

    const tournament = await ddb.get(getparams).promise();
    console.log(JSON.stringify(tournament))
    if (tournament.Item.currentUsers > 0) {
        const addparams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                tournamentId: tournamentId,
            },
            UpdateExpression: "SET currentUsers = currentUsers - :num",
            ExpressionAttributeValues: {
                ":num": 1,

            },
        };


        try {
            await ddb.update(addparams).promise()
        } catch (err) {
            return { statusCode: 500, body: 'Failed to leave: ' + JSON.stringify(err) };
        }
        return { statusCode: 200, body: JSON.stringify('left the lobby') };
    }
    else {
        return { statusCode: 200, body: JSON.stringify('last person to leave') };
    }
};
