import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import csv from "csv-parser";
import mongoose from "mongoose";
import Sale from "../src/models/Sale.js";
import connectDB from "../config/db.js";

const CSV_PATH = path.join(process.cwd(), "data/truestate_assignment_dataset.csv");
const BATCH_SIZE = 20000;

const runImport = async () => {
  await connectDB();
  console.log("🟢 MongoDB Connected");
  console.log("📥 Starting CSV import...");

  const buffer = [];
  let totalInserted = 0;

  const stream = fs.createReadStream(CSV_PATH).pipe(csv());

  stream.on("data", async (row) => {
    stream.pause();

    buffer.push({
      transactionId: row["Transaction ID"],
      date: new Date(row["Date"]),

      customerId: row["Customer ID"],
      customerName: row["Customer Name"],
      phoneNumber: row["Phone Number"],
      gender: row["Gender"],
      age: Number(row["Age"]),
      customerRegion: row["Customer Region"],
      customerType: row["Customer Type"],

      productId: row["Product ID"],
      productName: row["Product Name"],
      brand: row["Brand"],
      productCategory: row["Product Category"],
      tags: row["Tags"]
        ? row["Tags"].split(",").map((t) => t.trim())
        : [],

      quantity: Number(row["Quantity"]),
      pricePerUnit: Number(row["Price per Unit"]),
      discountPercentage: Number(row["Discount Percentage"]),
      totalAmount: Number(row["Total Amount"]),
      finalAmount: Number(row["Final Amount"]),

      paymentMethod: row["Payment Method"],
      orderStatus: row["Order Status"],
      deliveryType: row["Delivery Type"],

      storeId: row["Store ID"],
      storeLocation: row["Store Location"],
      salespersonId: row["Salesperson ID"],
      employeeName: row["Employee Name"],
    });

    if (buffer.length >= BATCH_SIZE) {
      await Sale.insertMany(buffer, { ordered: false });
      totalInserted += buffer.length;
      console.log(`✅ Inserted ${totalInserted} records`);
      buffer.length = 0;
    }

    stream.resume();
  });

  stream.on("end", async () => {
    if (buffer.length) {
      await Sale.insertMany(buffer, { ordered: false });
      totalInserted += buffer.length;
    }

    console.log(`🎉 DONE — Imported ${totalInserted} sales records`);
    await mongoose.connection.close();
    process.exit(0);
  });

  stream.on("error", (err) => {
    console.error("❌ Import failed:", err);
    process.exit(1);
  });
};

runImport();
