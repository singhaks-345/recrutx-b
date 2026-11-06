const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SeekerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  qualification: { type: String, required: true },
  location: { type: String, required: true },
  preference: { type: String, required: true },
  resume: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving (backup if not hashed in route)
SeekerSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    // Check if already hashed
    if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const seekerTable = mongoose.model("seeker", SeekerSchema);
module.exports = { seekerTable };