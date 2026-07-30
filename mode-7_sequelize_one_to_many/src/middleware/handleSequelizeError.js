const handleSequelizeError = (error, res) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,

      errors: error.errors.map((validationError) => validationError.message),
    });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "A record with the given unique value already exists",
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
};

export default handleSequelizeError;