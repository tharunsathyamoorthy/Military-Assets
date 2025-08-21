import express from "express";
import mongoose from "mongoose";

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
