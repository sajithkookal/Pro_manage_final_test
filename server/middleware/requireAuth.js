// Middleware for Authorization
const jwt = require('jsonwebtoken');
// Load environment variables from .env file
require('dotenv').config(); 
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = requireAuth;