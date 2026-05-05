import express from "express";
import {
  registerRecruiter,
  registerCandidate,
  loginUser,
} from "../controllers/authController.js";
import {
  validateRegisterHR,
  validateRegisterCandidate,
  validateLogin,
} from "../validations/userValidation.js";

const router = express.Router();

router.post("/register-recruiter", validateRegisterHR, registerRecruiter);
router.post("/register-candidate", validateRegisterCandidate, registerCandidate);
router.post("/login", validateLogin, loginUser);

export default router;
