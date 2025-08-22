require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/vendors-request-system"
  )
  .then(() => console.log("MongoDB connected for category seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Predefined categories
const categories = [
  { name: "Electronics", description: "Electronic devices and accessories" },
  { name: "Clothing", description: "Apparel and fashion items" },
  { name: "Furniture", description: "Home and office furniture" },
  { name: "Groceries", description: "Food and household essentials" },
  { name: "Books", description: "Books, magazines, and publications" },
  { name: "Toys", description: "Children's toys and games" },
  { name: "Spices", description: "Spices and herbs" },
  { name: "Beverages", description: "Beverages and refreshments" },
  { name: "Sports Equipment", description: "Sports and fitness gear" },
  { name: "Beauty Products", description: "Cosmetics and personal care items" },
  { name: "Jewelry", description: "Ornaments and precious items" },
  { name: "Automotive", description: "Car parts and accessories" },
  { name: "Office Supplies", description: "Stationery and office equipment" },
  { name: "Home Decor", description: "Decorative items for home" },
  { name: "Garden Supplies", description: "Gardening tools and plants" },
  { name: "Pet Supplies", description: "Products for pets" },
  { name: "Medical Supplies", description: "Healthcare and medical items" },
  { name: "Art Supplies", description: "Materials for artists" },
  {
    name: "Construction Materials",
    description: "Building and renovation supplies",
  },
  {
    name: "Electrical Equipment",
    description: "Electrical tools and components",
  },
  { name: "Software", description: "Computer programs and applications" },
  { name: "Other", description: "Miscellaneous items" },
];

// Seed categories
const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log("Existing categories cleared");

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created successfully`);

    mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error seeding categories:", error);
    mongoose.disconnect();
  }
};

// Run the seeding function
seedCategories();
