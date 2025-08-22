const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    // Add category field for centers
    category: {
      type: String,
      // Only required if applicationType is 'center'
      required: function () {
        return this.applicationType === "center";
      },
    },
    contactPerson1: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    contactPerson2: {
      name: String,
      phone: String,
    },
    bankDetails: {
      bankName: {
        type: String,
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      branch: {
        type: String,
        required: true,
      },
      accountHolderName: {
        type: String,
        required: true,
      },
    },
    panDocument: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    applicationType: {
      type: String,
      enum: ["vendor", "center"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
