import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Skapa en ny HR
export async function registerRecruiter(req, res) {
  try {
    const { username, email, password, role, company } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role: role || "recruiter",
      company,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}

// Skapa en ny kandidat
export async function registerCandidate(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      username,
      email,
      passwordHash: password,
      role: role || "candidate",
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}

// Logga in en användare
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    // Hitta användare inkludera lösenordhashen
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", err: error.message });
  }
}

// JWT token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
