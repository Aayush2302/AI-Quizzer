import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1]; // Extract token from cookies or headers

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = { userId: decoded.userId }; // Attach userId to req.user

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

export default protectRoute;
