const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  contact: { type: Number, required: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  img: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 🔒 Hash password before saving
AdminSchema.pre("save", async function (next) {
  try {
    // Only hash if password is new or modified
    if (!this.isModified("password")) {
      console.log("Password not modified, skipping hash");
      return next();
    }
    
    console.log("Hashing password..."); // Debug log
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully"); // Debug log
    next();
  } catch (error) {
    console.error("Error in pre-save hook:", error);
    next(error);
  }
});

const AdminTable = mongoose.model("Admin", AdminSchema);
module.exports = { AdminTable };