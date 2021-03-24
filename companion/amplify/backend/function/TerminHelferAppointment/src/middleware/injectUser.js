const AWS = require('aws-sdk');

/**
 * Middleware to inject cognito user into request.
 *
 * @param req Request.
 * @param res Response.
 * @param next Next.
 */
const injectUser = (req, res, next) => {
    const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/;
    const authProvider =
        req.apiGateway.event.requestContext.identity
            .cognitoAuthenticationProvider;
    const [, , , userId] = authProvider.match(IDP_REGEX);

    const cognito = new AWS.CognitoIdentityServiceProvider();
    return cognito
        .listUsers({
            UserPoolId: process.env.AUTH_TERMINHELFER58F55893_USERPOOLID,
            Filter: `sub = "${userId}"`,
            Limit: 1,
        })
        .promise()
        .then(listUsersResponse => listUsersResponse.Users)
        .then(users => users[0])
        .then(user => req.user = user)
        .then(() => next())
        .catch(error => next(error));
};

module.exports = injectUser
