import express from "express";
import { createJob } from "../controllers/jobController.js";
import { jobValidate } from "../middleware/validationMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";