const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    const tournamentId = JSON.parse(event.body).tournamentId;
    const userId = JSON.parse(event.body).tournamentId;
    console.log(JSON.parse(event.body))
    const getparams = {
        TableName:
            process.env.TABLE_NAME,

        Key: {
            "tournamentId": tournamentId
        }
    }

    const tournament = await ddb.get(getparams).promise();
    console.log(JSON.stringify(tournament))
    console.log(tournament.Item.currentUsers)
    console.log(tournament.Item.numberOfUsers)
    if ((tournament.Item.currentUsers + 1) <= (tournament.Item.numberOfUsers)) {
        console.log("adding user")
        const addparams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                tournamentId: tournamentId,
            },
            UpdateExpression: "set currentUsers = if_not_exists(currentUsers, :initial) + :num",
            ExpressionAttributeValues: {
                ":num": 1,
                ":initial": []

            },
        };


        try {
            await ddb.update(addparams).promise()
        } catch (err) {
            return { statusCode: 500, body: 'Failed to add: ' + JSON.stringify(err) };
        }
        return { statusCode: 200, body: JSON.stringify('joined lobby') };
    }
    else {
        const addparams = {
            TableName: process.env.TABLE_NAME,
            Key: {
                tournamentId: tournamentId,
            },
            UpdateExpression: "SET t_status = :t_status",
            ExpressionAttributeValues: {
                ":t_status": "started",

            },
        };
        try {
            await ddb.update(addparams).promise()
        } catch (err) {
            return { statusCode: 500, body: 'Failed to add: ' + JSON.stringify(err) };
        }
        return { statusCode: 404, body: JSON.stringify({ msg: 'already started' }) }
    }
};
