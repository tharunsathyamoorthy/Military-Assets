import express from "express";
import Asset from "../models/Asset.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new asset (only Admin/BaseCommander)
router.post("/", authenticate, authorize("Admin", "BaseCommander"), async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all assets (public)
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update asset (only Admin/BaseCommander)
router.put("/:id", authenticate, authorize("Admin", "BaseCommander"), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete asset (only Admin)
router.delete("/:id", authenticate, authorize("Admin"), async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
