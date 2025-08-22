const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ContactPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
});

const BankDetailsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    trim: true,
  },
  accountNumber: {
    type: String,
    trim: true,
  },
  branch: {
    type: String,
    trim: true,
  },
  accountHolderName: {
    type: String,
    trim: true,
  },
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["vendor", "center"],
    default: "select the role",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  // Vendor specific fields
  businessName: {
    type: String,
    trim: true,
  },
  pan: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  province: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  contactPerson1: ContactPersonSchema,
  contactPerson2: ContactPersonSchema,
  bankDetails: BankDetailsSchema,
  panDocument: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
