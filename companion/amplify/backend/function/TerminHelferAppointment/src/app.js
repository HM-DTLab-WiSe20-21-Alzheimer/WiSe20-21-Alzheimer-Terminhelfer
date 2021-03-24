/* Amplify Params - DO NOT EDIT
	AUTH_TERMINHELFER58F55893_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require("express");

// Import Middleware
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const injectUser = require("./middleware/injectUser");
const injectAlexaUId = require("./middleware/injectAlexaUId");
const enableCors = require("./middleware/enableCors");

// Import routes
const appointmentAll = require("./routes/appointment/all");
const appointmentDetail = require("./routes/appointment/detail");
const appointmentNext = require("./routes/appointment/next");
const locationAll = require("./routes/location/all");

const app = express();
app.disable("x-powered-by");
// Enable middleware
app.use(enableCors);
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(bodyParser.json());
app.use(injectUser);
app.use(injectAlexaUId);

// Add routes
app.get("/appointment", appointmentAll);
app.get("/appointment/next", appointmentNext);
app.get("/appointment/:id", appointmentDetail);
app.get("/location", locationAll);

module.exports = app;
