const { body } = require("express-validator");

const registerRules = () => {
  return [
    body("email").isEmail().withMessage("Format email tidak valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password minimal harus 6 karakter"),
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("role").isIn(["admin", "employee"]).withMessage("Role tidak valid"),
    body("username").notEmpty().withMessage("Username tidak boleh kosong"),
  ];
};
module.exports = {
  registerRules,
};
