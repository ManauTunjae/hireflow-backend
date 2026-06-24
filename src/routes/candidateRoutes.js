import express from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getMyApplications,
  downloadDocument
} from "../controllers/candidateController.js";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware.js";
import {
  validateCandidate,
  updateStatus,
} from "../validations/candidateValidation.js";
import upload from "../config/cloudinary.js";

const router = express.Router();

router.get("/my-applications", authMiddleware, getMyApplications);

router.post(
  "/",
  optionalAuth,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  validateCandidate,
  createCandidate,
);
router.get("/", authMiddleware, getAllCandidates);
router.get("/:id", authMiddleware, getCandidateById);
// src/routes/candidateRoutes.js
router.get("/:id/download/:type", protect, authorizeRoles("hr"), downloadDocument);
router.patch("/:id", authMiddleware, updateStatus, updateCandidate);
router.delete("/:id", authMiddleware, deleteCandidate);

export default router;
