import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Candidate",
      required: true,
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Documents", documentsSchema);
