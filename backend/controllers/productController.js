const Product = require("../models/Product");

// Get all products for a center
exports.getCenterProducts = async (req, res) => {
  try {
    const products = await Product.find({ center: req.user.id });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, image } = req.body;

    const newProduct = new Product({
      center: req.user.id,
      name,
      description,
      price,
      quantity,
      category,
      image,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, image, isAvailable } =
      req.body;

    // Build product object
    const productFields = {};
    if (name) productFields.name = name;
    if (description) productFields.description = description;
    if (price) productFields.price = price;
    if (quantity !== undefined) productFields.quantity = quantity;
    if (category) productFields.category = category;
    if (image) productFields.image = image;
    if (isAvailable !== undefined) productFields.isAvailable = isAvailable;

    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Make sure center owns product
    if (product.center.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productFields },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Make sure center owns product
    if (product.center.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Product.findByIdAndRemove(req.params.id);

    res.json({ msg: "Product removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
