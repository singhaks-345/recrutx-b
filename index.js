
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { recruiterRoute } = require("./routes/recruiterRoute");
const { seekerRoute } = require("./routes/seekerRoute");
const { AdminRoute } = require("./routes/AdminRoute");

const app = express();

require("dotenv").config();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
const MONGODB_URI = process.env.MONGODB;
const PORT_URI = process.env.PORT || 9000;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.log("MongoDB Error:", error));

// Routes
app.use("/api", AdminRoute);
app.use("/api", recruiterRoute);
app.use("/api", seekerRoute);
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        message: err.message
    });
});
// Server
app.listen(PORT_URI, () => {
    console.log(`Server is Running at ${PORT_URI} port`);
});