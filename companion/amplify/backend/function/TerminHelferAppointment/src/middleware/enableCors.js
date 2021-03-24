/**
 * Middleware to enable cors.
 *
 * @param req Request.
 * @param res Response.
 * @param next Next.
 */
const enableCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

module.exports = enableCors;
