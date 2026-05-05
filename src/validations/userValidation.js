import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegisterHR = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("company")
    .isLength({ min: 3 })
    .withMessage("Company name must be at least 3 characters long"),

  handleValidationErrors,
];

export const validateRegisterCandidate = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  handleValidationErrors,
];
