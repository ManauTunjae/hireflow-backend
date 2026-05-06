import express from "express";
import { createCandidate, getAllCandidates } from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, createCandidate);
router.get("/", authMiddleware, getAllCandidates);

export default router;
