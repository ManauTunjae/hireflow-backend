import express from "express";
import { createCandidate } from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, createCandidate);

export default router;
