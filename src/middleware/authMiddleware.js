import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    let token;
    // 1. Kolla om det finns en Bearer tolken i Authorization headern
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      // 2. Verifiera token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // 3. Hämta användaren och bifoga till req.user
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "User no longer exists" });
      }

      req.user = user;
      return next();
    }

    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized: No token provided" });
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized: Invalid token" });
  }
}
