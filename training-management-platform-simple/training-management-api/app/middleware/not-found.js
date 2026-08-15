const { NotFoundError } = require("../lib/error");
module.exports = (req, res, next) => next(new NotFoundError("API endpoint not found."));
