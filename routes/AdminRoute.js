const express = require("express");
const AdminRoute = express.Router();
const { AdminTable } = require('../models/AdminModel');
const { seekerTable } = require('../models/seekerModel');
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const bcrypt = require('bcrypt');

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename or generate unique name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// ✅ Make sure uploads folder exists
/*const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}*/

// ✅ Use multer correctly - field name should match frontend
AdminRoute.post('/Admregister', upload.single('img'), async (req, res) => {
  try {
    console.log("Incoming body:", req.body);
    console.log("Incoming file:", req.file); // ✅ req.file (singular) for multer

    const { name, email, contact, password, location } = req.body;

    // ✅ Check for file with multer
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    console.log("File uploaded:", req.file.path);

    // ✅ Save data in DB
    const data = new AdminTable({
      name,
      email,
      contact,
      password,
      location,
      img: req.file.filename, // ✅ Save the filename
    });

    const result = await data.save();

    res.json({
      code: 200,
      data: result,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error("Error in Admin-register:", error);
    res.status(500).json({ error: error.message });
  }
});

// ... rest of your routes

module.exports = { AdminRoute };


/*AdminRoute.post("/Admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login body:", req.body);

    // ✅ 1. Find admin by email only
    const emailLower = email.toLowerCase();
    const result = await AdminTable.findOne({ email: emailLower  });
    console.log("The result is:", result);

    // ✅ 2. If no user found
    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "Invalid Email or Password",
      });
    }

    // ✅ 3. Compare plain password with hashed password
    const match = await bcrypt.compare(password, result.password);

    // ✅ 4. Send response based on comparison
    if (match) {
      return res.json({
        code: 200,
        message: "Login Successful!...",
        data: result,
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
});
module.exports = { AdminRoute };*/
// ✅ Add this debug route BEFORE your other routes




AdminRoute.get("/admin-seekerlist",async(req,res)=>{
   try{
    const result= await seekerTable.find();
    res.json({
      code:200,
      message:"Data found Successfull",
      data:result
    })

   } catch(err){
    console.log(err)
   }
})  


 module.exports={AdminRoute}


 AdminRoute.post("/Admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("\n==========================================");
    console.log("🔍 LOGIN ATTEMPT STARTED");
    console.log("==========================================");
    console.log("📧 Email received:", email);
    console.log("🔑 Password received:", password);
    console.log("------------------------------------------");

    // Validate input
    if (!email || !password) {
      console.log("❌ VALIDATION FAILED: Missing email or password");
      return res.status(400).json({
        code: 400,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const emailLower = email.toLowerCase().trim();
    console.log("📧 Email normalized:", emailLower);
    console.log("------------------------------------------");

    // Find admin
    console.log("🔍 Searching database for admin...");
    const admin = await AdminTable.findOne({ email: emailLower });
    
    if (!admin) {
      console.log("❌ NO ADMIN FOUND");
      console.log("📋 Let me check all admins in database:");
      const allAdmins = await AdminTable.find({}).select('email name');
      console.log("Total admins:", allAdmins.length);
      allAdmins.forEach((a, index) => {
        console.log(`  ${index + 1}. Email: "${a.email}", Name: "${a.name}"`);
      });
      console.log("==========================================\n");
      
      return res.status(404).json({
        code: 404,
        message: "Invalid Email or Password",
      });
    }

    console.log("✅ ADMIN FOUND!");
    console.log("------------------------------------------");
    console.log("👤 Admin Details:");
    console.log("   ID:", admin._id);
    console.log("   Name:", admin.name);
    console.log("   Email:", admin.email);
    console.log("   Contact:", admin.contact);
    console.log("   Location:", admin.location);
    console.log("------------------------------------------");
    console.log("🔐 Password Analysis:");
    console.log("   Password in DB:", admin.password);
    console.log("   Password length:", admin.password.length);
    console.log("   First 10 chars:", admin.password.substring(0, 10));
    console.log("   Starts with $2a$ or $2b$?:", admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$"));
    console.log("   Is likely hashed?:", admin.password.length === 60 && (admin.password.startsWith("$2a$") || admin.password.startsWith("$2b$")));
    console.log("------------------------------------------");

    // Compare passwords
    console.log("🔐 Attempting password comparison...");
    console.log("   Plain password:", password);
    console.log("   Hashed password:", admin.password.substring(0, 29) + "...");
    
    const match = await bcrypt.compare(password, admin.password);
    
    console.log("------------------------------------------");
    console.log("🎯 Password Match Result:", match);
    console.log("------------------------------------------");

    if (match) {
      console.log("✅✅✅ LOGIN SUCCESSFUL ✅✅✅");
      console.log("==========================================\n");
      
      const responseData = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        contact: admin.contact,
        location: admin.location,
        img: admin.img,
      };

      return res.json({
        code: 200,
        message: "Login Successful!",
        data: responseData,
      });
    } else {
      console.log("❌❌❌ PASSWORD MISMATCH ❌❌❌");
      console.log("==========================================\n");
      
      return res.status(401).json({
        code: 401,
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    console.error("==========================================");
    console.error("💥 LOGIN ERROR:");
    console.error(error);
    console.error("==========================================\n");
    
    return res.status(500).json({
      code: 500,
      message: "Server error",
      error: error.message,
    });
  }
});

