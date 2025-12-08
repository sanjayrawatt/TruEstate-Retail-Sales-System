import express from "express";
import cors from "cors";
import salesRoutes from "./routes/salesRoutes.js";
import { loadSalesData } from "./services/salesService.js";

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

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Load CSV data on startup
  try {
    await loadSalesData();
    console.log("Sales data loaded successfully");
  } catch (error) {
    console.error("Failed to load sales data:", error);
  }
});
