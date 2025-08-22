const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Get all vendors
router.get("/vendors", [auth, isAdmin], async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" });
    res.json(vendors);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Get all centers
router.get("/centers", [auth, isAdmin], async (req, res) => {
  try {
    const centers = await User.find({ role: "center" });
    res.json(centers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Approve or reject vendor/center application
router.put("/users/:id", [auth, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;

    // Update approval status if approved
    if (status === "approved") {
      user.isApproved = true;
    } else if (status === "rejected") {
      user.isApproved = false;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
