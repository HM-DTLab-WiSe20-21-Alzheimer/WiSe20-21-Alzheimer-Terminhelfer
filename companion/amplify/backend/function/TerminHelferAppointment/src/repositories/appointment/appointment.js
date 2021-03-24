const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

/**
 * Get all appointments for given alexa user id.
 *
 * @param alexaId Alexa user id to fetch appointments for.
 * @return {Promise<* | []>}
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
      .then((result) => result.Items || [])
      // Extract appointments
      // Transform result to array and move id into object
      .then(items => {
        const appointments = (items.length > 0 && items[0].attributes.M.appointments ? items[0].attributes.M.appointments.M : {}) || {};
        const locations = (items.length > 0 && items[0].attributes.M.locations ? items[0].attributes.M.locations.M : {}) || {};

        return Object.entries(appointments).map(
          ([id, appointment]) => {
            appointment.M.id = {
              S: `${id}`,
            };

            const location = locations[appointment.M.location.S] || { M: {} };
            location.M.name = {
              S: appointment.M.location.S,
            };

            appointment.M.location = location;
            return appointment;
          },
        );
      })
  );
};

/**
 * Filter resultset for given date.
 *
 * @param date Date to filter for.
 * @return {function(*): *} Date filter function.
 */
const filterDate = (date) => {
  return (appointment) => {
    return appointment.M.dateTime.S.split('T')[0] === date.split('T')[0];
  };
};

/**
 * Filter resultset for the exakt given date.
 *
 * @param {string} date Date to filter for.
 * @return {function(*): *} Date filter function.
 */
const filterDateTime = (date) => {
  return (appointment) => {
    return appointment.M.dateTime.S === date;
  };
};

/**
 * Filter resultset for the given id
 * @param {string} id Id to search for
 */
const filterId = (id) => {
  return (appointment) => {
    return appointment.M.id.S === id;
  };
};

const sortByDate = () => {
  return (a, b) => {
    const dateA = new Date(a.M.dateTime.S);
    const dateB = new Date(b.M.dateTime.S);
    return (dateA > dateB) - (dateA < dateB);
  };
};

module.exports = {
  get,
  filterDate,
  filterDateTime,
  filterId,
  sortByDate,
};
