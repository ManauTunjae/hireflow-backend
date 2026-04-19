import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Vänligen ange en giltig e-postadress"], // Enkel inbyggd validering
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "recruiter"],
      default: "recruiter",
    },
    company: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);


