const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  permissions: {
    manageVendors: {
      type: Boolean,
      default: false,
    },
    manageCenters: {
      type: Boolean,
      default: false,
    },
    manageProducts: {
      type: Boolean,
      default: false,
    },
    manageOrders: {
      type: Boolean,
      default: false,
    },
    managePayments: {
      type: Boolean,
      default: false,
    },
    manageAdmins: {
      type: Boolean,
      default: false,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Admin", AdminSchema);
