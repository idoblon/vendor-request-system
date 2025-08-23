const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get("/", categoryController.getAllCategories);

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
