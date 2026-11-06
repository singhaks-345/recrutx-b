
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const { recruiterRoute } = require("./routes/recruiterRoute");
const { seekerRoute } = require("./routes/seekerRoute");
const { AdminRoute } = require("./routes/AdminRoute");

const app = express();

// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://YOUR-FRONTEND.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose.connect(process.env.MONGODB)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((error) => console.error("MongoDB Error:", error));

// Routes
app.use("/api", AdminRoute);
app.use("/api", recruiterRoute);
app.use("/api", seekerRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        message: err.message || "Internal Server Error"
    });
});

// Export Express app for Vercel
module.exports = app;
