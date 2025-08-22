const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

// @route   POST api/applications
// @desc    Submit application
// @access  Private
router.post(
  "/",
  auth,
  upload.single("panDocument"),
  applicationController.submitApplication
);

// @route   GET api/applications
// @desc    Get all applications (admin only)
// @access  Private/Admin
router.get("/", [auth, admin], applicationController.getAllApplications);

// @route   GET api/applications/me
// @desc    Get user's application
// @access  Private
router.get("/me", auth, applicationController.getUserApplication);

// @route   PUT api/applications/:id
// @desc    Update application status (admin only)
// @access  Private/Admin
router.put(
  "/:id",
  [auth, admin],
  applicationController.updateApplicationStatus
);

module.exports = router;
