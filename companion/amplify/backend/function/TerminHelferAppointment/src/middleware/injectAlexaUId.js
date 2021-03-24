const linkRepo = require("../repositories/link/link");

/**
 * Middleware to inject alexa user id into request.
 *
 * @param req Request.
 * @param res Response.
 * @param next Next.
 */
const injectAlexaUId = (req, res, next) => {
  // Extract linkid from user
  const linkid = (req.user.Attributes || [])
    .filter(attribute => attribute.Name === "custom:linkid")
    .map(attribute => attribute.Value)[0];

  if (!linkid) {
    next();
    return Promise.resolve();
  }

  // Get alexaId
  return linkRepo.get(linkid)
    .then(alexaUId => req.alexaUId = alexaUId)
    .then(() => next())
    .catch(() => res.json({ statusCode: 500, error: "User has no link alexa account" }));
};

module.exports = injectAlexaUId;
