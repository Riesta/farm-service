const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const Errors = [];
  errors.array().map((err) => Errors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: Errors,
  });
};

module.exports = {
  validate,
};
