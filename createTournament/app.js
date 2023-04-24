const AWS = require('aws-sdk');
const {
    v1: uuidv1,
    v4: uuidv4,

} = require('uuid');

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {

    const name = event.body.tournamentName;
    console.log(process.env.TABLE_NAME,)
    const addparams = {
        TableName: process.env.TABLE_NAME,
        Item: {
            tournamentId: uuidv4(),
            dateCreated: new Date(),
            numberOfUsers: 2,
            status: "live",
            currentUsers: 0,
            name: name
        }
    };

    try {
        await ddb.put(addparams).promise()
    } catch (err) {
        return { statusCode: 500, body: 'Failed to add: ' + JSON.stringify(err) };
    }
    return { statusCode: 200, body: JSON.stringify('created tournament') };
};
