import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Admin", "BaseCommander", "LogisticsOfficer"], default: "LogisticsOfficer" },
  base: { type: String } // For base commander & logistics officer
}, { timestamps: true });

export default mongoose.model("User", userSchema);
