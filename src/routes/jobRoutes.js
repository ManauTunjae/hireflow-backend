import express from "express";
import { createJob } from "../controllers/jobController.js";
import { validateJob } from "../validations/jobValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateJob, createJob);

export default router;
