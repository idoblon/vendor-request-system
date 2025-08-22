const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Application = require("../models/Application");

// Get center profile
router.get("/profile", auth, async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user.id,
      applicationType: "center",
    });

    if (!application) {
      return res.status(404).json({ message: "Center profile not found" });
    }

    res.json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
