// index.js (Backend Entry Point)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoute");
const vendorRoutes = require("./routes/vendorRoutes");
dotenv.config();
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require("./routes/shopRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// ========================
// 1. Port & ENV Variables
// ========================
const PORT = process.env.PORT || 5000;
const CLIENT_URLS = process.env.CLIENT_URLS?.split(",") || ["http://localhost:5173"];

// ========================
// 2. Middlewares
// ========================
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Handling (Multiple URLs Allowed)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || CLIENT_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ========================
// 3. Import Routes
// ========================
const authRoutes = require("./routes/auth");
// Future Expansion Routes (example placeholders):
// const productRoutes = require("./routes/productRoutes");
// const serviceRoutes = require("./routes/serviceRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const vendorRoutes = require("./routes/vendorRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api", shopRoutes);
app.use("/api/order", orderRoutes);


// ========================
// 4. Mount Routes
// ========================
app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/services", serviceRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/vendors", vendorRoutes);

// ========================
// 5. Test Route
// ========================
app.get("/", (req, res) => {
  res.send("Multi-Vendor Interior E-commerce API is running 🚀");
});

// ========================
// 6. Global Error Handling Middleware
// ========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ========================
// 7. MongoDB Connection & Server Start
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
