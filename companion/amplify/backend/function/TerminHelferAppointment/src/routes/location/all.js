const locationRepo = require("../../repositories/location/location.js");

/**
 * Get all locations.
 *
 * @param req Request.
 * @param res Response.
 * @return {Promise<void>}
 */
const all = (req, res) => {
  // Get alexa user
  const alexaUId = req.alexaUId;

  // Get locations
  return locationRepo.get(alexaUId)
    .then(locations => res.json({ statusCode: 200, url: req.url, body: JSON.stringify(locations) }))
    .catch(error => {
      res.status(500).json({ statusCode: 500, error: error.message });
      console.error(error);
    });
};

module.exports = all;
