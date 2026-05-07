import express from "express";
import { createCandidate, getAllCandidates, getCandidateById } from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, createCandidate);
router.get("/", authMiddleware, getAllCandidates);
router.get("/:id", authMiddleware, getCandidateById)

export default router;
