import jwt from "jsonwebtoken";
import Lawyer from "../models/Lawyer.js";

export const protectLawyer = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id = USER ID
    const lawyer = await Lawyer.findOne({ user: decoded.id });

    if (!lawyer) {
      return res
        .status(403)
        .json({ message: "Access denied. Lawyer only." });
    }

    req.lawyer = lawyer; // attach lawyer to request
    next();
  } catch (error) {
    console.error("Protect Lawyer Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
