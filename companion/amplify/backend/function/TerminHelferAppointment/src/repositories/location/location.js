const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

/**
 * Get all locations for given alexa user id.
 *
 * @param alexaId Alexa user id to fetch locations for.
 * @return {Promise<*[]>}
 */
const get = (alexaId) => {
  const query = {
    TableName: "TerminHelfer",
    ExpressionAttributeValues: {
      ":alexaid": {
        S: alexaId,
      },
    },
    KeyConditionExpression: "id = :alexaid",
  };

  return (
    dynamodb
      // Query data
      .query(query)
      .promise()
      // Extract items
      .then(result => result.Items || [])
      // Extract locations
      .then(items => items.length > 0 ? items[0].attributes.M.locations.M : {})
      // Transform result to array and move name into object
      .then(locations => Object.entries(locations).map(
        ([name, location]) => {
          location.M.name = {
            S: name,
          };
          return location;
        },
      ))
  );
};

module.exports = {
  get,
};
