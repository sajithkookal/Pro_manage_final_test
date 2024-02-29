const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/task')
const authRoutes = require("./routes/user")

require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Health API
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running",
    });
});

// Routes Head
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

//Error handler middleware
app.use((err, req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' })
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Successfully Connected to MongoDB")
        }).catch(err => {
            console.error('Failed to connect to MongoDB:', err);
        });
});
