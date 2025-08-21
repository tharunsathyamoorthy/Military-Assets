import mongoose from "mongoose";
import dotenv from "dotenv";
import Asset from "./models/Asset.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import Purchase from "./models/Purchase.js";
import Transfer from "./models/Transfer.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedAssets = [
  // Weapons
  { name: "Rifle", type: "Weapon", base: "Base Alpha", openingBalance: 100, closingBalance: 90 },
  { name: "Grenade", type: "Weapon", base: "Base Bravo", openingBalance: 200, closingBalance: 180 },
  { name: "Mortar", type: "Weapon", base: "Base Charlie", openingBalance: 30, closingBalance: 28 },
  { name: "Launcher", type: "Weapon", base: "Base Delta", openingBalance: 15, closingBalance: 14 },
  { name: "Anti-Aircraft System", type: "Weapon", base: "Base Alpha", openingBalance: 5, closingBalance: 5 },

  // Armored & Tactical Vehicles
  { name: "Tank", type: "Vehicle", base: "Base Charlie", openingBalance: 10, closingBalance: 9 },
  { name: "APC", type: "Vehicle", base: "Base Bravo", openingBalance: 8, closingBalance: 7 },
  { name: "MRAP", type: "Vehicle", base: "Base Delta", openingBalance: 6, closingBalance: 6 },
  { name: "Humvee", type: "Vehicle", base: "Base Alpha", openingBalance: 20, closingBalance: 18 },

  // Aircraft & Aviation Assets
  { name: "Fighter Jet", type: "Aircraft", base: "Base Alpha", openingBalance: 4, closingBalance: 4 },
  { name: "Helicopter", type: "Aircraft", base: "Base Bravo", openingBalance: 6, closingBalance: 5 },
  { name: "UAV", type: "Aircraft", base: "Base Charlie", openingBalance: 10, closingBalance: 10 },
  { name: "Transport Plane", type: "Aircraft", base: "Base Delta", openingBalance: 3, closingBalance: 3 },

  // Naval Assets
  { name: "Submarine", type: "Naval", base: "Naval Base", openingBalance: 2, closingBalance: 2 },
  { name: "Destroyer", type: "Naval", base: "Naval Base", openingBalance: 3, closingBalance: 3 },
  { name: "Patrol Boat", type: "Naval", base: "Naval Base", openingBalance: 8, closingBalance: 7 },
  { name: "Aircraft Carrier", type: "Naval", base: "Naval Base", openingBalance: 1, closingBalance: 1 },

  // Cyber & Electronic Warfare
  { name: "Firewall", type: "Cyber", base: "HQ", openingBalance: 10, closingBalance: 10 },
  { name: "Intrusion Detection System", type: "Cyber", base: "HQ", openingBalance: 5, closingBalance: 5 },
  { name: "Jamming Device", type: "Cyber", base: "Base Alpha", openingBalance: 7, closingBalance: 7 },
  { name: "Encryption Module", type: "Cyber", base: "Base Bravo", openingBalance: 12, closingBalance: 12 },

  // Surveillance & Recon Tools
  { name: "Drone", type: "Recon", base: "Base Alpha", openingBalance: 15, closingBalance: 14 },
  { name: "Radar System", type: "Recon", base: "Base Bravo", openingBalance: 3, closingBalance: 3 },
  { name: "Satellite Imagery", type: "Recon", base: "HQ", openingBalance: 1, closingBalance: 1 },
  { name: "Thermal Scope", type: "Recon", base: "Base Charlie", openingBalance: 25, closingBalance: 24 },

  // Engineering & Construction
  { name: "Bulldozer", type: "Engineering", base: "Base Delta", openingBalance: 4, closingBalance: 4 },
  { name: "Crane", type: "Engineering", base: "Base Bravo", openingBalance: 2, closingBalance: 2 },
  { name: "Mobile Bridge", type: "Engineering", base: "Base Alpha", openingBalance: 3, closingBalance: 3 },
  { name: "Fortification Kit", type: "Engineering", base: "Base Charlie", openingBalance: 10, closingBalance: 10 },

  // Medical & Rescue Equipment
  { name: "Field Hospital", type: "Medical", base: "Base Bravo", openingBalance: 1, closingBalance: 1 },
  { name: "Ambulance", type: "Medical", base: "Base Alpha", openingBalance: 5, closingBalance: 5 },
  { name: "Trauma Kit", type: "Medical", base: "Base Delta", openingBalance: 50, closingBalance: 48 },
  { name: "Decontamination Unit", type: "Medical", base: "Base Charlie", openingBalance: 2, closingBalance: 2 },

  // Logistics & Supply Chain
  { name: "Fuel Tanker", type: "Logistics", base: "Base Alpha", openingBalance: 6, closingBalance: 6 },
  { name: "Ration Pack", type: "Logistics", base: "Base Bravo", openingBalance: 500, closingBalance: 480 },
  { name: "Water Purification Unit", type: "Logistics", base: "Base Delta", openingBalance: 3, closingBalance: 3 },
  { name: "Mobile Kitchen", type: "Logistics", base: "Base Charlie", openingBalance: 2, closingBalance: 2 },

  // Training & Simulation
  { name: "VR Combat Simulator", type: "Training", base: "HQ", openingBalance: 2, closingBalance: 2 },
  { name: "Mock Weapon", type: "Training", base: "Base Alpha", openingBalance: 30, closingBalance: 30 },
  { name: "Tactical Drill", type: "Training", base: "Base Bravo", openingBalance: 10, closingBalance: 10 },
  { name: "Obstacle Course", type: "Training", base: "Base Charlie", openingBalance: 1, closingBalance: 1 },

  // Protective Gear
  { name: "Ballistic Vest", type: "Protective Gear", base: "Base Alpha", openingBalance: 100, closingBalance: 95 },
  { name: "Helmet", type: "Protective Gear", base: "Base Bravo", openingBalance: 120, closingBalance: 115 },
  { name: "NBC Suit", type: "Protective Gear", base: "Base Delta", openingBalance: 30, closingBalance: 28 },
  { name: "Gas Mask", type: "Protective Gear", base: "Base Charlie", openingBalance: 60, closingBalance: 58 },

  // Infrastructure Assets
  { name: "Barracks", type: "Infrastructure", base: "Base Alpha", openingBalance: 5, closingBalance: 5 },
  { name: "Command Center", type: "Infrastructure", base: "HQ", openingBalance: 1, closingBalance: 1 },
  { name: "Airfield", type: "Infrastructure", base: "Base Bravo", openingBalance: 1, closingBalance: 1 },
  { name: "Depot", type: "Infrastructure", base: "Base Delta", openingBalance: 2, closingBalance: 2 },

  // Communication Systems
  { name: "Radio", type: "Communication", base: "Base Alpha", openingBalance: 50, closingBalance: 48 },
  { name: "Satellite Uplink", type: "Communication", base: "HQ", openingBalance: 2, closingBalance: 2 },
  { name: "Secure Router", type: "Communication", base: "Base Bravo", openingBalance: 10, closingBalance: 10 },
  { name: "Signal Repeater", type: "Communication", base: "Base Charlie", openingBalance: 6, closingBalance: 6 },

  // Personnel Assets (as a count, not a real asset)
  { name: "Troop Roster", type: "Personnel", base: "Base Alpha", openingBalance: 300, closingBalance: 295 },
  { name: "Specialized Unit", type: "Personnel", base: "Base Bravo", openingBalance: 50, closingBalance: 50 },
  { name: "Command Hierarchy", type: "Personnel", base: "HQ", openingBalance: 1, closingBalance: 1 },
];

// Purchases and transfers will be linked to the first few assets for demo
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
  password: "admin123", // Will be hashed
  role: "Admin",
  base: " ",
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      // options not needed for mongoose >= 6
    });
    console.log("Connected to MongoDB");

    // Seed assets
    await Asset.deleteMany({});
    const createdAssets = await Asset.insertMany(seedAssets);
    console.log("Seeded assets");

    // Set asset_id for purchases and transfers
    seedPurchases[0].asset_id = createdAssets[0]._id;
    seedPurchases[1].asset_id = createdAssets[1]._id;
    seedPurchases[2].asset_id = createdAssets[2]._id;
    seedPurchases[3].asset_id = createdAssets[3]._id;

    seedTransfers[0].asset_id = createdAssets[0]._id;
    seedTransfers[1].asset_id = createdAssets[1]._id;
    seedTransfers[2].asset_id = createdAssets[2]._id;

    // Seed purchases
    await Purchase.deleteMany({});
    await Purchase.insertMany(seedPurchases);
    console.log("Seeded purchases");

    // Seed transfers
    await Transfer.deleteMany({});
    await Transfer.insertMany(seedTransfers);
    console.log("Seeded transfers");

    // Seed admin user if not exists
    const existingAdmin = await User.findOne({ email: seedAdmin.email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(seedAdmin.password, 10);
      await User.create({ ...seedAdmin, password: hashedPassword });
      console.log("Seeded admin user (email: admin@example.com, password: admin123)");
    } else {
      console.log("Admin user already exists");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      // options not needed for mongoose >= 6
    });
    console.log("Connected to MongoDB");

    // Seed assets
    await Asset.deleteMany({});
    const createdAssets = await Asset.insertMany(seedAssets);
    console.log("Seeded assets");

    // Set asset_id for purchases and transfers
    seedPurchases[0].asset_id = createdAssets[0]._id;
    seedPurchases[1].asset_id = createdAssets[1]._id;
    seedPurchases[2].asset_id = createdAssets[2]._id;
    seedPurchases[3].asset_id = createdAssets[3]._id;

    seedTransfers[0].asset_id = createdAssets[0]._id;
    seedTransfers[1].asset_id = createdAssets[1]._id;
    seedTransfers[2].asset_id = createdAssets[2]._id;

    // Seed purchases
    await Purchase.deleteMany({});
    await Purchase.insertMany(seedPurchases);
    console.log("Seeded purchases");

    // Seed transfers
    await Transfer.deleteMany({});
    await Transfer.insertMany(seedTransfers);
    console.log("Seeded transfers");

    // Seed admin user if not exists
    const existingAdmin = await User.findOne({ email: seedAdmin.email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(seedAdmin.password, 10);
      await User.create({ ...seedAdmin, password: hashedPassword });
      console.log("Seeded admin user (email: admin@example.com, password: admin123)");
    } else {
      console.log("Admin user already exists");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
