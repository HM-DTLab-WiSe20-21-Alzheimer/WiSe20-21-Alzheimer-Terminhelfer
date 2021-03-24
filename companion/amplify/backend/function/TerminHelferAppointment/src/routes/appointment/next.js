const appointmentRepo = require("../../repositories/appointment/appointment");

/**
 * Get all appointments on a given day.
 *
 * @param req Request.
 * @param res Response.
 */
const next = (req, res) => {
  // Get alexa user
  const alexaUId = req.alexaUId;
  const current = new Date();
  const date = `${current.getFullYear()}-${("0" + current.getMonth()+1).slice(-2)}-${current.getDate()}T`;

  // Get appointments
  return appointmentRepo.get(alexaUId)
    // Filter for today
    .then(appointments => appointments.filter(appointmentRepo.filterDate(date)))
    // Sort appointments
    .then(appointments => appointments.sort(appointmentRepo.sortByDate()))
    // Get next appointment
    .then(appointments => appointments[0])
    // Respond to request
    .then(item => res.json({ statusCode: 200, url: req.url, body: JSON.stringify(item) }))
    .catch(error => {
      res.status(500).json({ statusCode: 500, error: error.message });
      console.error(error);
    });
};

module.exports = next;
