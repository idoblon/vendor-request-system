const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const auth = require("../middleware/auth");

// @route   GET api/locations/provinces
// @desc    Get all provinces
// @access  Public
router.get("/provinces", locationController.getAllProvinces);

// @route   GET api/locations/districts
// @desc    Get all districts
// @access  Public
router.get("/districts", locationController.getAllDistricts);

// @route   GET api/locations/provinces/:provinceId/districts
// @desc    Get districts by province
// @access  Public
router.get("/provinces/:provinceId/districts", locationController.getDistrictsByProvince);

// @route   POST api/locations/provinces
// @desc    Add a new province
// @access  Private (Admin only)
router.post("/provinces", auth, locationController.addProvince);

// @route   POST api/locations/districts
// @desc    Add a new district
// @access  Private (Admin only)
router.post("/districts", auth, locationController.addDistrict);

// @route   POST api/locations/seed
// @desc    Seed location data
// @access  Private (Admin only)
router.post("/seed", auth, locationController.seedLocationData);

module.exports = router;