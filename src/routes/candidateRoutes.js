import express from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  validateCandidate,
  updateStatus,
} from "../validations/candidateValidation.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  validateCandidate,
  createCandidate,
);
router.get("/", authMiddleware, getAllCandidates);
router.get("/:id", authMiddleware, getCandidateById);
router.patch("/:id", authMiddleware, updateStatus, updateCandidate);
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;
