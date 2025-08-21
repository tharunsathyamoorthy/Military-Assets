import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  from_base: String,
  to_base: String,
  qty: Number,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Transfer", transferSchema);
