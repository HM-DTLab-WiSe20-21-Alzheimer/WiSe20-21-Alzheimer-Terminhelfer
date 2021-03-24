const awsServerlessExpress = require("aws-serverless-express");
const app = require("./app");

// Start server
app.listen(3000, () => {
  console.log("App started");
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
