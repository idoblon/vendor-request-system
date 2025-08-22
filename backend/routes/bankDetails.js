const express = require("express");
const router = express.Router();
const bankDetailController = require("../controllers/bankDetailController");
const auth = require("../middleware/auth");

// @route   GET api/bank-details
// @desc    Get all bank details
// @access  Public
router.get("/", bankDetailController.getAllBankDetails);

// @route   POST api/bank-details
// @desc    Add a new bank detail
// @access  Private (Admin only)
router.post("/", auth, bankDetailController.addBankDetail);

module.exports = router;