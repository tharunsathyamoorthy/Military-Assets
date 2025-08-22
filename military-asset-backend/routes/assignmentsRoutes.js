import express from "express";
import mongoose from "mongoose";
import Asset from "../models/Asset.js"; // Ensure this path matches assetsRoutes.js

const router = express.Router();

const assignmentSchema = new mongoose.Schema(
  {
    asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
    personnel: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Assigned", "Expended"], default: "Assigned" },
  },
  { timestamps: true }
);

const Assignment = mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);

// Create a new assignment
router.post("/", async (req, res) => {
  try {
    const { asset_id, personnel, qty, date, status } = req.body;

    if (!asset_id || !personnel || !qty || !date || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate asset existence
    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    if (qty <= 0) {
      return res.status(400).json({ message: "Quantity must be positive." });
    }

    if (asset.closingBalance < qty) {
      return res.status(400).json({ message: "Insufficient asset quantity available." });
    }

    // Create assignment
    const assignment = new Assignment({ asset_id, personnel, qty, date, status });
    await assignment.save();

    // Update asset quantities accordingly
    if (status === "Assigned") {
      asset.assigned = (asset.assigned || 0) + qty;
    } else if (status === "Expended") {
      asset.expended = (asset.expended || 0) + qty;
    }
    asset.closingBalance -= qty;
    await asset.save();

    return res.status(201).json(assignment);
  } catch (err) {
    console.error("Assignment creation failed:", err);
    return res.status(500).json({ message: "Server error while creating assignment." });
  }
});

// Get all assignments with asset details populated
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("asset_id", "name type base")
      .sort({ createdAt: -1 });
    return res.json(assignments);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch assignments." });
  }
});

export default router;
