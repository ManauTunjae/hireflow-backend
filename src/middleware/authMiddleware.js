import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verifiera token — rollen finns redan här, ingen DB-query behövs
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded.id, role: decoded.role };

      return next();
    }

    return res.status(401).json({ status: "error", message: "Unauthorized: No token provided" });
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
  }
}

export async function optionalAuth(req, res, next) {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return authMiddleware(req, res, next);
  }
  next();
}