import express from "express";
import mongoose from "mongoose";
import Asset from "./models/Asset.js"; // Adjust import path as per your project structure

const router = express.Router();

const assignmentSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  personnel: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Assigned", "Expended"], default: "Assigned" }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);

// Create an assignment
router.post("/", async (req, res) => {
  try {
    const { asset_id, personnel, qty, date, status } = req.body;

    if (!asset_id || !personnel || !qty || !date || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const asset = await Asset.findById(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }

    // Check if enough available quantity for assigned or expended
    if (status === "Assigned" && (asset.closingBalance - qty) < 0) {
      return res.status(400).json({ message: "Insufficient asset quantity to assign." });
    }
    if (status === "Expended" && (asset.closingBalance - qty) < 0) {
      return res.status(400).json({ message: "Insufficient asset quantity to expend." });
    }

    // Create the assignment record
    const assignment = new Assignment({ asset_id, personnel, qty, date, status });
    await assignment.save();

    // Update the asset counts
    if (status === "Assigned") {
      asset.assigned = (asset.assigned || 0) + qty;
      asset.closingBalance = asset.closingBalance - qty;
    } else if (status === "Expended") {
      asset.expended = (asset.expended || 0) + qty;
      asset.closingBalance = asset.closingBalance - qty;
    }
    await asset.save();

    res.status(201).json(assignment);

  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// Get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("asset_id", "name type");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
