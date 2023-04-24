const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {

    const userId = event.body.userId;
    const tournamentId = event.body.tournamentId;
    const option = event.body.option;
    console.log(process.env.TABLE_NAME,)
    const random = Math.random();
    const addScore = 0;
    var genOption;
    if (random <= 0.5) {
        genOption = 0;
    }
    else {
        genOption = 1;
    }
    if (genOption === option) {
        addScore += 5;
    }
    const addparams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            tournamentId: tournamentId,
        },
        UpdateExpression: "SET score = if_not_exists(score, :initial) + :num,userId = :userId, remaining =if_not_exists(remaining, :initialRemaining) - :num",
        ExpressionAttributeValues: {
            ":num": 1,
            ":initial": 0,
            ":userId": userId,
            ":initialRemaining": 5,
        },
    };


    try {
        await ddb.update(addparams).promise()
    } catch (err) {
        return { statusCode: 500, body: 'Failed to add: ' + JSON.stringify(err) };
    }
    return { statusCode: 200, body: JSON.stringify('created tournament') };
};
