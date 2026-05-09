import express from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCandidate);
router.get("/", authMiddleware, getAllCandidates);
router.get("/:id", authMiddleware, getCandidateById);
router.patch("/:id", authMiddleware, updateCandidate);
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;
