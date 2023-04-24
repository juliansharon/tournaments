const AWS = require('aws-sdk');


const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: process.env.AWS_REGION });

exports.handler = async event => {
    console.log(process.env.TABLE_NAME,)
    const params = {
        TableName: process.env.TABLE_NAME,
    };
    try {
        const res = await ddb.scan(params).promise();
        return { statusCode: 200, tournaments: res.Items }
    } catch (err) {
        return { statusCode: 500, body: 'Failed to get: ' + JSON.stringify(err) };
    }

};
