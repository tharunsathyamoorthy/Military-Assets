import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  base_id: String,
  qty: Number,
  date: Date,
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
