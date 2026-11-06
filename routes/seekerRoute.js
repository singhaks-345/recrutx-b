const express = require("express");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const seekerRoute = express.Router();
const { seekerTable } = require('../models/seekerModel');

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'img') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only images allowed for profile picture'));
      }
    }
    if (file.fieldname === 'resume') {
      const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowed.includes(file.mimetype)) {
        return cb(new Error('Only PDF/DOC allowed for resume'));
      }
    }
    cb(null, true);
  }
});

// Helper to strip quotes
const stripQuotes = (str) => {
  if (typeof str === 'string') {
    return str.replace(/^["']+|["']+$/g, '').trim();
  }
  return str;
};

// ✅ Seeker Registration
seekerRoute.post(
  "/seeker-register",
  upload.fields([
    { name: 'img', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("Incoming body:", req.body);
      console.log("Incoming files:", req.files);

      let { name, email, contact, password, qualification, location, preference } = req.body;

      // Sanitize inputs (remove extra quotes)
      name = stripQuotes(name);
      email = stripQuotes(email);
      password = stripQuotes(password);
      qualification = stripQuotes(qualification);
      location = stripQuotes(location);
      preference = stripQuotes(preference);

      // Validate required fields
      if (!name || !email || !contact || !password || !qualification || !location || !preference) {
        return res.status(400).json({
          code: 400,
          message: "All fields are required"
        });
      }

      // Check if files exist
      if (!req.files || !req.files.img || !req.files.resume) {
        return res.status(400).json({
          code: 400,
          message: "Profile image and resume are required"
        });
      }

      // Check if seeker already exists
      const emailLower = email.toLowerCase();
      const existingSeeker = await seekerTable.findOne({ email: emailLower });

      if (existingSeeker) {
        return res.status(409).json({
          code: 409,
          message: "Seeker with this email already exists"
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new seeker
      const data = new seekerTable({
        name,
        email: emailLower,
        contact,
        password: hashedPassword,
        qualification,
        location,
        preference,
        img: req.files.img[0].filename,
        resume: req.files.resume[0].filename
      });

      const result = await data.save();
      console.log("✅ Seeker registered successfully");

      // Send response without password
      res.json({
        code: 200,
        message: "Seeker registered successfully",
        data: {
          _id: result._id,
          name: result.name,
          email: result.email,
          contact: result.contact,
          qualification: result.qualification,
          location: result.location,
          preference: result.preference,
          img: result.img,
          resume: result.resume,
          createdAt: result.createdAt
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        code: 500,
        message: "Server error",
        error: error.message
      });
    }
  }
);

// ✅ Seeker Login
seekerRoute.post("/seeker-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        message: "Email and password are required"
      });
    }

    // Find seeker
    const emailLower = email.toLowerCase().trim();
    const seeker = await seekerTable.findOne({ email: emailLower });

    if (!seeker) {
      return res.status(404).json({
        code: 404,
        message: "Invalid Email or Password"
      });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, seeker.password);

    if (match) {
      // Send response without password
      res.json({
        code: 200,
        message: "Login Successful!",
        data: {
          _id: seeker._id,
          name: seeker.name,
          email: seeker.email,
          contact: seeker.contact,
          qualification: seeker.qualification,
          location: seeker.location,
          preference: seeker.preference,
          img: seeker.img,
          resume: seeker.resume
        }
      });
    } else {
      res.status(401).json({
        code: 401,
        message: "Invalid Email or Password"
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = { seekerRoute };