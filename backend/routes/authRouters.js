import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import authMiddleware from "../middleware/authMiddleware.js"
const router = express.Router();

router.post("/", authMiddleware, (req, res) => {
  const { id,} = req.user;
  console.log("Hello");
   

  return res.json({
      message: "User authenticated successfully",
      id,
     
  });
});
router.post('/getuser', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('name email password');
    
    // console.log(user.name);
    if (!user) return res.status(404).send('User not found');

    res.json(user.email);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Test route
router.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, "process.env.JWT_SECRET", {
      expiresIn: "10h",
    });
    console.log(token);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// User Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password ,phone} = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, password,phone });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "process.env.JWT_SECRET", {
      expiresIn: "10h",
    });



    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});




export default router;