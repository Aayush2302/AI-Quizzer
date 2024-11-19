import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token Provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default protectRoute;
