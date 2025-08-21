import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  name: String,  // Vehicle, Weapon, Ammo
  type: String,  // Category
  base: String,
  openingBalance: { type: Number, default: 0 },
  closingBalance: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  transferIn: { type: Number, default: 0 },
  transferOut: { type: Number, default: 0 },
  assigned: { type: Number, default: 0 },
  expended: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Asset", assetSchema);
