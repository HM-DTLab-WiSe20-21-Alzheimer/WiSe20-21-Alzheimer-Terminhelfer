const appointmentRepo = require("../../repositories/appointment/appointment");

/**
 * Get an appointment.
 *
 * @param req Request.
 * @param res Response.
 */
const detail = (req, res) => {
  // Get alexa user
  const alexaUId = req.alexaUId;

  // Get id param
  const id = req.params.id;

  // Get appointments
  return appointmentRepo
    .get(alexaUId)
    // Filter for given date
    .then((appointments) =>
      appointments.filter(appointmentRepo.filterId(id)),
    )
    .then((appointments) => appointments[0])
    // Respond to request
    .then((appointment) => {
      if (appointment) {
        res.json({
          statusCode: 200,
          url: req.url,
          body: JSON.stringify(appointment),
        });
      } else {
        res.json({
          statusCode: 404,
          url: req.url,
          error: "Appointment not found",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ statusCode: 500, error: error.message });
      console.error(error);
    });
};

module.exports = detail;
