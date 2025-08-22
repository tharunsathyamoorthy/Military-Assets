import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Asset from "./models/Asset.js";
import User from "./models/User.js";
import Purchase from "./models/Purchase.js";
import Transfer from "./models/Transfer.js";
import Assignment from "./models/Assignment.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAssets = [
  // Weapons
  { name: "Rifle", type: "Weapon", base: "Base Alpha", openingBalance: 100, closingBalance: 90 },
  { name: "Grenade", type: "Weapon", base: "Base Bravo", openingBalance: 200, closingBalance: 180 },
  // ... (rest of your assets)
];

const seedPurchases = [
  { asset_id: null, base_id: "Base Alpha", qty: 20, date: new Date("2024-05-01") },
  { asset_id: null, base_id: "Base Bravo", qty: 2, date: new Date("2024-05-02") },
  { asset_id: null, base_id: "Base Alpha", qty: 100, date: new Date("2024-05-03") },
  { asset_id: null, base_id: "Base Charlie", qty: 1, date: new Date("2024-05-04") },
];

const seedTransfers = [
  { asset_id: null, from_base: "Base Alpha", to_base: "Base Bravo", qty: 5, date: new Date("2024-05-05") },
  { asset_id: null, from_base: "Base Bravo", to_base: "Base Charlie", qty: 1, date: new Date("2024-05-06") },
  { asset_id: null, from_base: "Base Alpha", to_base: "Base Delta", qty: 10, date: new Date("2024-05-07") },
];

const seedAdmin = {
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123", // plaintext, will hash before save
  role: "Admin",
  base: "HQ",
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      // No additional options needed with mongoose 6+
    });
    console.log("Connected to MongoDB");

    // Clear existing data before seeding
    await Asset.deleteMany({});
    await Purchase.deleteMany({});
    await Transfer.deleteMany({});
    await User.deleteMany({ email: seedAdmin.email }); // only delete this admin if exists

    // Insert assets and store created docs
    const createdAssets = await Asset.insertMany(seedAssets);
    console.log("Seeded assets");

    // Assign asset_ids for purchases and transfers from created assets
    seedPurchases[0].asset_id = createdAssets._id;
    seedPurchases[1].asset_id = createdAssets[1]._id;
    seedPurchases.asset_id = createdAssets._id;
    seedPurchases.asset_id = createdAssets._id;

    seedTransfers.asset_id = createdAssets._id;
    seedTransfers[1].asset_id = createdAssets[1]._id;
    seedTransfers.asset_id = createdAssets._id;

    // Insert purchases and transfers
    await Purchase.insertMany(seedPurchases);
    console.log("Seeded purchases");

    await Transfer.insertMany(seedTransfers);
    console.log("Seeded transfers");

    // Seed admin user if not exists
    const hashedPassword = await bcrypt.hash(seedAdmin.password, 10);
    await User.create({ ...seedAdmin, password: hashedPassword });
    console.log("Seeded admin user (email: admin@example.com, password: admin123)");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
