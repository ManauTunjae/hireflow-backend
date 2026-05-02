import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export const validateJob = [
  body("title")
    .isLength({ min: 2 })
    .notEmpty()
    .withMessage("Title must be at least 2 characters long")
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("description")
    .isLength({ min: 10 })
    .notEmpty()
    .withMessage("Description must be at least 10 characters long")
    .isString()
    .withMessage("Description must be a string")
    .trim(),

  body("company")
    .isLength({ min: 2 })
    .notEmpty()
    .withMessage("Company name must be at least 2 characters long")
    .isString()
    .withMessage("Company name must be a string")
    .trim(),

  body("location")
    .isLength({ min: 2 })
    .notEmpty()
    .withMessage("Location must be at least 2 characters long")
    .isString()
    .withMessage("Location must be a string")
    .trim(),

  body("status").isIn(["open", "closed"]).withMessage("Invalid status value"),

  body("salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isString()
    .withMessage("Salary must be a string. Ex. 40,000 - 50,000 SEK/month"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),

  handleValidationErrors,
];
