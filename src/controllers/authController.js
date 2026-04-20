import User from "../models/User";

// Skapa en ny användare
export async function registerUser(req, res) {
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
      role,
      userRole,
      company,
    });
    res.status(201).json({
      message: "User registered sucsessfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
}
