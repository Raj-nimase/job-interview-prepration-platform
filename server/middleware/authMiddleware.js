import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  // try to get token from Authorization header first
  let token = req.headers.authorization?.split(" ")[1];

  // fallback to cookie token (we set it on login/register)
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
