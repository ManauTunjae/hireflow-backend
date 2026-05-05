import express from "express";
import { registerRecruiter, loginRecruiter } from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validations/userValidation.js";

const router = express.Router();

router.post("/register-recruiter", validateRegister, registerRecruiter);
router.post("/login-recruiter", validateLogin, loginRecruiter);

export default router;
