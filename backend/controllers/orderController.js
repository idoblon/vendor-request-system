const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Application = require("../models/Application");

// Get all orders for a vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendor: req.user.id })
      .populate("center", "email")
      .populate("items.product", "name price category");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("center", "email")
      .populate("items.product", "name price category image");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Make sure vendor owns order
    if (order.vendor.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { centerId, items, notes } = req.body;

    // Get vendor district for discount calculation
    const vendorApp = await Application.findOne({
      user: req.user.id,
      applicationType: "vendor",
    });

    if (!vendorApp) {
      return res.status(404).json({ msg: "Vendor profile not found" });
    }

    const vendorDistrict = vendorApp.district;

    // Calculate total amount and apply discounts
    let totalAmount = 0;
    let discountRate = 0;
    let discountAmount = 0;
    let finalAmount = 0;
    let commissionRate = 5; // Default 5% commission
    let commissionAmount = 0;

    // Verify products and calculate amounts
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res
          .status(404)
          .json({ msg: `Product not found: ${item.productId}` });
      }

      if (!product.isAvailable || product.quantity < item.quantity) {
        return res.status(400).json({
          msg: `Product ${product.name} is not available in requested quantity`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Get center info to check if discount applies
    const centerApp = await Application.findOne({
      user: centerId,
      applicationType: "center",
    });

    if (!centerApp) {
      return res.status(404).json({ msg: "Center profile not found" });
    }

    // Apply discount if vendor and center are in the same district
    if (vendorDistrict === centerApp.district) {
      discountRate = 10; // 10% discount for same district
    } else {
      discountRate = 5; // 5% discount for different district
    }

    discountAmount = (totalAmount * discountRate) / 100;
    finalAmount = totalAmount - discountAmount;

    // Calculate commission for admin
    commissionAmount = (finalAmount * commissionRate) / 100;

    // Create new order
    const newOrder = new Order({
      vendor: req.user.id,
      center: centerId,
      items: orderItems,
      totalAmount,
      discountRate,
      discountAmount,
      finalAmount,
      commissionRate,
      commissionAmount,
      vendorDistrict,
      notes,
      status: "pending",
      paymentStatus: "pending",
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update order status (for payment)
exports.updateOrderPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Make sure vendor owns order
    if (order.vendor.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;

    // If payment is completed, update order status to paid
    if (paymentStatus === "completed") {
      order.status = "paid";
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get order statistics for vendor
exports.getOrderStats = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments({ vendor: req.user.id });

    // Total amount spent
    const totalAmountResult = await Order.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ]);
    const totalAmount =
      totalAmountResult.length > 0 ? totalAmountResult[0].total : 0;

    // Total discount received
    const totalDiscountResult = await Order.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: "$discountAmount" } } },
    ]);
    const totalDiscount =
      totalDiscountResult.length > 0 ? totalDiscountResult[0].total : 0;

    // Total commission paid
    const totalCommissionResult = await Order.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: "$commissionAmount" } } },
    ]);
    const totalCommission =
      totalCommissionResult.length > 0 ? totalCommissionResult[0].total : 0;

    // Centers ordered from
    const centersResult = await Order.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: "$center", count: { $sum: 1 } } },
    ]);
    const totalCenters = centersResult.length;

    res.json({
      totalOrders,
      totalAmount,
      totalDiscount,
      totalCommission,
      totalCenters,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
