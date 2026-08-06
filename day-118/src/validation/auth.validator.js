import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  //check if errors array is empty
  if (errors.isEmpty()) {
    return next();
  }
  res.status(400).json({ errors: errors.array() });
};

export const registerValidation = [
  body("username").isString().withMessage("Username must be a String"),
  body("email").isEmail().withMessage("Email should be a valid email"),
  body("password").custom((value) => {
    if (value.length < 6 || value.length > 12) {
      throw new Error(
        "Password must be at least 6 characters long and at most 12 characters long",
      );
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    if (!passwordRegex.test(value)) {
      throw new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
    }
    return true;
  }),
  validate,
];
