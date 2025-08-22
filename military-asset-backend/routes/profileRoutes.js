import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT and set req.user
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, role, base
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update current user profile (except password)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, base } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (base) updateFields.base = base;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, { new: true }).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: Update password route - to change password securely
router.put("/profile/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Both current and new passwords are required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
