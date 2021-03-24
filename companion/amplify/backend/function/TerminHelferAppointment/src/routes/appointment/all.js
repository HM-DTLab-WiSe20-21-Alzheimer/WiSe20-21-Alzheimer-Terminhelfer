const appointmentRepo = require("../../repositories/appointment/appointment");

/**
 * Get all appointments on a given day.
 *
 * @param req Request.
 * @param res Response.
 */
const all = (req, res) => {
  // Get alexa user
  const alexaUId = req.alexaUId;

  // Get query date
  const current = new Date();
  const date = req.query.date || (`${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}T`);

  // Get appointments
  return appointmentRepo.get(alexaUId)
    // Filter for given date
    .then(appointments => appointments.filter(appointmentRepo.filterDate(date)))
    .then(appointments => appointments.sort(appointmentRepo.sortByDate()))
    // Respond to request
    .then(item => res.json({ statusCode: 200, url: req.url, body: JSON.stringify(item) }))
    .catch(error => {
      res.status(500).json({ statusCode: 500, error: error.message });
      console.error(error);
    });
};

module.exports = all;
