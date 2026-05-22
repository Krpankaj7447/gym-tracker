const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin:
  [ "http://localhost:3000",
    "https://gym-tracker-frontend-ucan.onrender.com"
  ],
    credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/splits", require("./routes/workoutSplitRoutes"));
app.use("/api/exercises", require("./routes/exerciseRoutes"));
app.use("/api/logs", require("./routes/workoutLogRoutes"));
app.use("/api/measurements", require("./routes/measurementRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "GymLog API running ✅" }));

// Connect DB & Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ DB Error:", err));
