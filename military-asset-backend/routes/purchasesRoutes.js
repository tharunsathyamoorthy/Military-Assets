import express from "express";
import mongoose from "mongoose";
import Asset from "./models/Asset.js"; // Ensure the correct path to Asset model

const router = express.Router();

const purchaseSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  base_id: String,
  qty: Number,
  date: Date,
}, { timestamps: true });

const Purchase = mongoose.model("Purchase", purchaseSchema);

// Create purchase
router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    // Update related Asset quantities
    const asset = await Asset.findById(purchase.asset_id);
    if (asset) {
      asset.purchases = (asset.purchases || 0) + (purchase.qty || 0);
      // Optionally adjust opening/closing balances as per business logic
      asset.closingBalance = (asset.closingBalance || 0) + (purchase.qty || 0);
      await asset.save();
    }

    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
