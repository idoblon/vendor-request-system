const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB with the new URI
mongoose.connect(
  process.env.MONGODB_URI || "mongodb+srv://enriquednes:JlofyGBQnoDxQ1U9@cluster0.mvvpef3.mongodb.net/Vendor-Request-System?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection failed:", err);
});
