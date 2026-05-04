import mongoose from "mongoose";

const candidateSchema = new mogoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interviewing", "hired", "rejected"],
      default: "applied",
    },
    LinkedIn: {
        type: String,
        trim: true,
    },
    Github: {
        type: String,
        trim: true,
    }
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);