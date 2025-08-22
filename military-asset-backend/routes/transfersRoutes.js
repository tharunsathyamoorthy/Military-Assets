import express from "express";
import mongoose from "mongoose";
import Asset from "./models/Asset.js"; // Ensure correct path

const router = express.Router();

const transferSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  from_base: String,
  to_base: String,
  qty: Number,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const Transfer = mongoose.model("Transfer", transferSchema);

// Create transfer
router.post("/", async (req, res) => {
  try {
    const transfer = new Transfer(req.body);
    await transfer.save();

    // Update asset's transferIn, transferOut, and balances accordingly
    const asset = await Asset.findById(transfer.asset_id);
    if (asset) {
      // Increment transferOut if from_base matches asset base
      if (transfer.from_base === asset.base) {
        asset.transferOut = (asset.transferOut || 0) + (transfer.qty || 0);
        asset.closingBalance = (asset.closingBalance || 0) - (transfer.qty || 0);
      }
      // Increment transferIn if to_base matches asset base
      if (transfer.to_base === asset.base) {
        asset.transferIn = (asset.transferIn || 0) + (transfer.qty || 0);
        asset.closingBalance = (asset.closingBalance || 0) + (transfer.qty || 0);
      }
      await asset.save();
    }

    res.status(201).json(transfer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all transfers
router.get("/", async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
