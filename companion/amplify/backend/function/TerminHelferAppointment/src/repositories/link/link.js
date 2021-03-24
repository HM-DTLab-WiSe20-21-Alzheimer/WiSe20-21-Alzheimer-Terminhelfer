const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

/**
 * Get alexa user id for given link id.
 *
 * @param linkid Link id to get alexa user for.
 * @return {Promise<*>}
 */
const get = (linkid) => {
    const query = {
        TableName: 'TerminHelferCompanionLinkIntent',
        ExpressionAttributeValues: {
            ':link': {
                S: linkid,
            },
        },
        KeyConditionExpression: 'linkid = :link',
    };

    return dynamodb
        // Query data
        .query(query)
        .promise()
        // Extract alexa user id
        .then(result => result.Items[0].alexauid.S);
};

module.exports = {
    get,
};
