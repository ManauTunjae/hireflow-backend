import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import {
  validateJob,
  validateJobUpdate,
} from "../validations/jobValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateJob, createJob);
router.get("/", getJobs); // Alla kan se alla jobb
router.get("/my-jobs", authMiddleware, getJobs); // HR kan se sina egna jobb
router.put("/:id", authMiddleware, validateJobUpdate, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

export default router;
