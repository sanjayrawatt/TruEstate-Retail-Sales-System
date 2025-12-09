import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Sale from "../src/models/Sale.js";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is undefined. Check backend/.env");
  process.exit(1);
}

async function clearSales() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    const result = await Sale.deleteMany({});
    console.log(`🧹 Deleted ${result.deletedCount} sales records`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error clearing sales:", err);
    process.exit(1);
  }
}

clearSales();
