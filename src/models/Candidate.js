import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "candidate",
    },
    jobId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Job",
      required: true,
    },
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
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
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
    },
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);
