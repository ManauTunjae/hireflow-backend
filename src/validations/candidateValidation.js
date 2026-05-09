import { body, validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const error = validationResult(req);
  if (!error) {
    return res.status * (404).json({ error: error.array() });
  }
  next();
};
