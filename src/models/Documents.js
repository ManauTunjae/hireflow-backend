import mongoose from "mongoose";

const documentsSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Candidate",
      required: true,
    },
    resume: {
      data: Buffer,
      contentType: String,
    },
    coverLetter: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Documents", documentsSchema);
