const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with the new URI
mongoose
  .connect(
    process.env.MONGOBD_URI ||
      "mongodb+srv://VRS:8Jer2Q4m3xYAVeLB@cluster0.je7udrp.mongodb.net/VendorRS?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Define Routes
app.use("/api/locations", require("./routes/locations"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/bank-details", require("./routes/bankDetails"));
// Add other routes as needed

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
