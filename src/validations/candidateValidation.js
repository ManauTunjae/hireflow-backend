import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(404).json({ error: result.array() });
  }
  next();
};

export const validateCandidate = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Candidate name must be at least 3 characters long"),

  body("email").trim().isEmail().withMessage("Invalid email format"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("jobId")
    .notEmpty()
    .withMessage("Job ID is required")
    .isMongoId()
    .withMessage("Invalid Hob ID format"),

  handleValidationErrors,
];

export const updateStatus = [
  body("status")
    .optional()
    .isIn(["applied", "interviewing", "hired", "rejected"])
    .withMessage("Invalid status value"),

  handleValidationErrors,
];
