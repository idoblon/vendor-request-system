const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

// Import all models
const User = require("./models/User");
const Category = require("./models/Category");
const Admin = require("./models/Admin");
const Application = require("./models/Application");
const Message = require("./models/Message");
const Order = require("./models/Order");
const Payment = require("./models/Payment");
const Product = require("./models/Product");

// Load environment variables
dotenv.config();

// Define file paths
const dataDir = path.join(__dirname, 'data');
const provincesFilePath = path.join(dataDir, 'provinces.json');
const districtsFilePath = path.join(dataDir, 'districts.json');
const bankDetailsFilePath = path.join(dataDir, 'bankDetails.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory');
}

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://localhost:27017/vendors-request-system"
  )
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Helper functions to write data to JSON files
const writeProvinces = (provinces) => {
  try {
    fs.writeFileSync(provincesFilePath, JSON.stringify(provinces, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing provinces file:', err);
    return false;
  }
};

const writeDistricts = (districts) => {
  try {
    fs.writeFileSync(districtsFilePath, JSON.stringify(districts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing districts file:', err);
    return false;
  }
};

const writeBankDetails = (bankDetails) => {
  try {
    fs.writeFileSync(bankDetailsFilePath, JSON.stringify(bankDetails, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing bank details file:', err);
    return false;
  }
};

// Seed admin user
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
    return true;
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return false;
  }
};

// Seed categories
const seedCategories = async () => {
  try {
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
      { name: "Construction Materials", description: "Building and renovation supplies" },
      { name: "Electrical Equipment", description: "Electrical tools and components" },
      { name: "Software", description: "Computer programs and applications" },
      { name: "Other", description: "Miscellaneous items" },
    ];

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Existing categories cleared");

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created successfully`);
    return true;
  } catch (error) {
    console.error("Error seeding categories:", error);
    return false;
  }
};

// Seed sample products (optional)
const seedProducts = async () => {
  try {
    // Check if we already have products
    const productsCount = await Product.countDocuments();
    if (productsCount > 0) {
      console.log(`${productsCount} products already exist, skipping product seeding`);
      return true;
    }
    
    // Get categories to reference in products
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log("No categories found, cannot seed products");
      return false;
    }
    
    // Sample products data
    const sampleProducts = [
      {
        name: "Sample Laptop",
        description: "A high-performance laptop for professionals",
        price: 85000,
        category: categories.find(c => c.name === "Electronics")?._id || categories[0]._id,
        inStock: true,
        quantity: 10
      },
      {
        name: "Office Chair",
        description: "Ergonomic office chair with lumbar support",
        price: 12000,
        category: categories.find(c => c.name === "Furniture")?._id || categories[0]._id,
        inStock: true,
        quantity: 15
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable cotton t-shirt for daily wear",
        price: 800,
        category: categories.find(c => c.name === "Clothing")?._id || categories[0]._id,
        inStock: true,
        quantity: 50
      }
    ];
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length} sample products created successfully`);
    return true;
  } catch (error) {
    console.error("Error seeding products:", error);
    return false;
  }
};

// Seed provinces and districts data
const seedLocationData = () => {
  try {
    // Nepal provinces and districts data
    const provincesData = [
      'Province 1',
      'Madhesh Province',
      'Bagmati Province',
      'Gandaki Province',
      'Lumbini Province',
      'Karnali Province',
      'Sudurpashchim Province'
    ];

    const districtsData = {
      'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'],
      'Madhesh Province': ['Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'],
      'Bagmati Province': ['Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'],
      'Gandaki Province': ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalparasi East', 'Parbat', 'Syangja', 'Tanahun'],
      'Lumbini Province': ['Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Nawalparasi West', 'Palpa', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'],
      'Karnali Province': ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'],
      'Sudurpashchim Province': ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur']
    };

    // Create provinces array with IDs
    const provinces = provincesData.map((name, index) => ({
      id: (index + 1).toString(),
      name
    }));

    // Create districts array with province references
    let districtId = 1;
    const districts = [];

    for (const [provinceName, districtNames] of Object.entries(districtsData)) {
      const provinceId = (provincesData.indexOf(provinceName) + 1).toString();
      
      for (const districtName of districtNames) {
        districts.push({
          id: districtId.toString(),
          name: districtName,
          provinceId
        });
        districtId++;
      }
    }

    // Write data to files
    if (writeProvinces(provinces) && writeDistricts(districts)) {
      console.log('Location data seeded successfully');
      return true;
    } else {
      console.error('Error seeding location data');
      return false;
    }
  } catch (err) {
    console.error('Error seeding location data:', err);
    return false;
  }
};

// Seed bank details data
const seedBankDetailsData = () => {
  try {
    const bankDetails = [
      {
        id: "1",
        bankName: "Nepal Bank Limited",
        branch: "",  // This will be filled by user input
        accountNumber: "0123456789",
        accountHolderName: "Example Account"
      },
      {
        id: "2",
        bankName: "Rastriya Banijya Bank",
        branch: "",  // This will be filled by user input
        accountNumber: "9876543210",
        accountHolderName: "Sample Account"
      },
      {
        id: "3",
        bankName: "NIC Asia Bank",
        branch: "",  // This will be filled by user input
        accountNumber: "5678901234",
        accountHolderName: "Test Account"
      }
    ];

    if (writeBankDetails(bankDetails)) {
      console.log('Bank details data seeded successfully');
      return true;
    } else {
      console.error('Error seeding bank details data');
      return false;
    }
  } catch (err) {
    console.error('Error seeding bank details data:', err);
    return false;
  }
};

// Run all seed functions
const seedAll = async () => {
  try {
    console.log('Starting database seeding process...');
    
    // Seed JSON files (locations and bank details)
    const locationSuccess = seedLocationData();
    const bankDetailsSuccess = seedBankDetailsData();
    
    // Seed MongoDB collections
    const adminSuccess = await seedAdmin();
    const categoriesSuccess = await seedCategories();
    const productsSuccess = await seedProducts();
    
    // Check if all seeding operations were successful
    if (locationSuccess && bankDetailsSuccess && adminSuccess && categoriesSuccess) {
      console.log('All data seeded successfully');
    } else {
      console.error('Error seeding some data');
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error in seeding process:', error);
    mongoose.disconnect();
  }
};

// Execute the seed function
seedAll();