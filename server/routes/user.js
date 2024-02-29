const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isLoggedIn = require("../middleware/requireAuth");

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      name: name,
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log(user);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect Credentials" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

    return res.status(200).json({
      status: "OK", message: "Successfully LoggedIn", token, user
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Route to Change password
router.put("/users/profile", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided old password with the hashed password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Update the user's new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Profile update failed", error);
    res.status(500).json({ error: "Profile update failed" });
  }
});


// Route to fetch user details by ID
router.get("/users/:userId", isLoggedIn, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { name } = user;
    res.status(200).json({ name });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Route to fetch userId from the authenticated user
router.get("/users/me", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from the request object
    res.status(200).json({ userId });
  } catch (error) {
    console.error("Error fetching userId:", error);
    res.status(500).json({ error: "Failed to fetch userId" });
  }
});

module.exports = router;