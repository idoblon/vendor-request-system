const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://enriquednes:JlofyGBQnoDxQ1U9@cluster0.mvvpef3.mongodb.net/Vendor-Request-System?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      console.log("Admin user already exists");
    } else {
      // Create admin user
      const admin = new User({
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: process.env.ADMIN_PASSWORD || "Password@123",
        role: "admin",
        isApproved: true,
      });

      await admin.save();
      console.log("Admin user created successfully");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding admin user:", error);
    mongoose.disconnect();
  }
};

seedAdmin();
