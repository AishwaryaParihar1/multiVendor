// index.js (Backend Entry Point)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoute");
const vendorRoutes = require("./routes/vendorRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth");

dotenv.config();
const app = express();

// ========================
// 1. Port & ENV Variables
// ========================
const PORT = process.env.PORT || 5000;
const CLIENT_URLS =
  process.env.CLIENT_URLS?.split(",").map((url) => url.replace(/\/$/, "")) ||
  ["http://localhost:5173"];

// ========================
// 2. Middlewares
// ========================
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Handling (Multiple URLs Allowed)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || CLIENT_URLS.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        console.error("❌ CORS Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Explicitly handle preflight requests
app.options("*", cors());

// ========================
// 3. Routes
// ========================
app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api", shopRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/auth", authRoutes);

// ========================
// 4. Test Route
// ========================
app.get("/", (req, res) => {
  res.send("Multi-Vendor Interior E-commerce API is running 🚀");
});

// ========================
// 5. Global Error Handling Middleware
// ========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ========================
// 6. MongoDB Connection & Server Start
// ========================
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });
