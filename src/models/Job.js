import mongoose from "mongoose";
import { required } from "zod/mini";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "draft"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    salary: {
      type: String, // t.ex. "50 000 - 70 000 SEK/månad"
      required: true,
    },
    requirements: [String], // En lista med krav (t.ex. ["React", "Node.js"])
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);