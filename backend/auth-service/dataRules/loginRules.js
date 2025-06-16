const { body } = require("express-validator");

const loginRules = () => {
  return [
    body("username").notEmpty().withMessage("Username tidak boleh kosong"),
    body("password").notEmpty().withMessage("Password tidak boleh kosong"),
  ];
};

module.exports = {
  loginRules,
};
