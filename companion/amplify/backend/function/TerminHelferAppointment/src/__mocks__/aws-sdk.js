const aws = jest.createMockFromModule("aws-sdk");

const Request = function(result) {
  this.promise = jest.fn(() => Promise.resolve(result));
};

/* DYNAMO DB */

const getQueryResult = (q) => {
  let result = {
    Items: [],
  };

  if (
    q.TableName === "TerminHelferCompanionLinkIntent"
    && q.ExpressionAttributeValues[":link"].S === "1234"
  ) {
    result.Items.push({
      alexauid: {
        S: q.ExpressionAttributeValues[":link"].S,
      },
    });
  }

  if (
    q.TableName === "TerminHelfer"
    && q.ExpressionAttributeValues[":alexaid"].S === "1234"
  ) {
    result.Items.push({
      attributes: {
        M: {
          appointments: {
            M: {
              123: {
                M: {
                  dateTime: {
                    S: "2020-12-24T15:00:00+01:00",
                  },
                  location: {
                    S: "nodejs",
                  },
                  title: {
                    S: "jest",
                  },
                  transport: {
                    S: "car",
                  },
                },
              },
            },
          },
          locations: {
            M: {
              nodejs: {
                M: {
                  hausnr: { S: "1" },
                  plz: { S: "12345" },
                  stadt: { S: "v8" },
                  strasse: { S: "v8str" },
                  transport: { S: "car" },
                },
              },
            },
          },
        },
      },
    });
  }

  return result;
};
const query = jest.fn((q) => new Request(getQueryResult(q)));
aws.DynamoDB = function() {
  this.query = query;
};

/* COGNITO IDENTITY SERVICEPROVIDER */
const getListResult = (params) => {
  const result = {
    Users: [],
  };

  if (params.Filter === "sub = \"fail\"") {
    return {};
  }

  if (params.Filter === "sub = \"1234\"") {
    result.Users.push({
      Attributes: [
        {
          Name: "custom:linkid",
          Value: "1234",
        },
      ],
    });
  }

  return result;
};
const listUsers = jest.fn((params) => new Request(getListResult(params)));
aws.CognitoIdentityServiceProvider = function() {
  this.listUsers = listUsers;
};

module.exports = aws;
