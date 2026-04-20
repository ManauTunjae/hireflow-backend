import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../validations/userValidation.js";

const router = express.Router();

router.post("/register", registerSchema, registerUser);
router.post("/login", loginSchema, loginUser);

export default router;
