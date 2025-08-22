const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../middleware/auth");

// @route   GET api/messages
// @desc    Get all messages for a user
// @access  Private
router.get("/", auth, messageController.getUserMessages);

// @route   POST api/messages
// @desc    Send a new message
// @access  Private
router.post("/", auth, messageController.sendMessage);

// @route   PUT api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put("/:id/read", auth, messageController.markAsRead);

// @route   GET api/messages/unread
// @desc    Get unread message count
// @access  Private
router.get("/unread", auth, messageController.getUnreadCount);

module.exports = router;
