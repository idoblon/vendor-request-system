const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

// @route   GET api/orders
// @desc    Get all orders for a vendor
// @access  Private (vendor)
router.get("/", auth, orderController.getVendorOrders);

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private (vendor)
router.get("/:id", auth, orderController.getOrderById);

// @route   POST api/orders
// @desc    Create a new order
// @access  Private (vendor)
router.post("/", auth, orderController.createOrder);

// @route   PUT api/orders/:id/payment
// @desc    Update order payment status
// @access  Private (vendor)
router.put("/:id/payment", auth, orderController.updateOrderPayment);

// @route   GET api/orders/stats
// @desc    Get order statistics for vendor
// @access  Private (vendor)
router.get("/stats", auth, orderController.getOrderStats);

module.exports = router;
