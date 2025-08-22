const Application = require("../models/Application");
const User = require("../models/User");

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const {
      businessName,
      pan,
      email,
      phone,
      province,
      district,
      contactPerson1,
      contactPerson2,
      bankDetails,
      applicationType,
    } = req.body;

    // Create new application
    const application = new Application({
      user: req.user.id,
      businessName,
      pan,
      email,
      phone,
      province,
      district,
      contactPerson1,
      contactPerson2,
      bankDetails,
      panDocument: req.file.path,
      applicationType,
    });

    await application.save();

    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all applications (admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate("user", "email");
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get user's application
exports.getUserApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ user: req.user.id });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // If application is approved, update user's approval status
    if (status === "approved") {
      await User.findByIdAndUpdate(application.user, { isApproved: true });
    }

    res.json({ message: "Application status updated", application });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
