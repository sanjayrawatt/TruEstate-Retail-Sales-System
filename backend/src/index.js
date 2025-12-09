import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5151;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sales", salesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// ... existing code ...

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    await connectDB();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
});
