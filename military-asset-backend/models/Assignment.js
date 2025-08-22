import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  asset_id: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  personnel: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Assigned", "Expended"],
    default: "Assigned",
  },
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
