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

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;
