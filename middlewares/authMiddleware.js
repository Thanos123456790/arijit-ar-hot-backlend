import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ msg: "Not authorized" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    return res.status(401).json({ msg: "Token failed" });
  }
};

/* role-based guard */
export const restrictTo =
  (...allowed) =>
  (req, res, next) => {
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ msg: "Forbidden" });
    next();
  };
