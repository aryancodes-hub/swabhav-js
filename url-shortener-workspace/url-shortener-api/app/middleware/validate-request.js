const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    // Replace request properties with sanitized Zod outputs
    req.body = parsed.body || req.body;
    req.params = parsed.params || req.params;
    req.query = parsed.query || req.query;

    next();
  } catch (error) {
    next(error); // Caught automatically by error-handler.js ZodError block
  }
};

module.exports = validateRequest;