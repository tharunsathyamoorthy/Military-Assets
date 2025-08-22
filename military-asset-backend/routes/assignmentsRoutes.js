import express from "express";
import mongoose from "mongoose";
import Asset from "./models/Asset.js"; // Adjust path as necessary

const router = express.Router();

const assignmentSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  personnel: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Assigned", "Expended"], default: "Assigned" }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);

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

    if (qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }

    if (status === "Assigned" && asset.closingBalance < qty) {
      return res.status(400).json({ message: "Insufficient available quantity for assignment." });
    }

    if (status === "Expended" && asset.closingBalance < qty) {
      return res.status(400).json({ message: "Insufficient available quantity to record expenditure." });
    }

    const assignment = new Assignment({ asset_id, personnel, qty, date, status });
    await assignment.save();

    if (status === "Assigned") {
      asset.assigned = (asset.assigned || 0) + qty;
      asset.closingBalance -= qty;
    } else if (status === "Expended") {
      asset.expended = (asset.expended || 0) + qty;
      asset.closingBalance -= qty;
    }
    await asset.save();

    res.status(201).json(assignment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating assignment." });
  }
});

router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("asset_id", "name type");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments." });
  }
});

export default router;
