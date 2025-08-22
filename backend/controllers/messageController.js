const Message = require("../models/Message");
const User = require("../models/User");

// Get all messages for a user
exports.getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "email role")
      .populate("receiver", "email role")
      .populate("relatedProduct", "name")
      .populate("relatedOrder", "_id")
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, relatedProductId, relatedOrderId } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    const newMessage = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
      relatedProduct: relatedProductId || null,
      relatedOrder: relatedOrderId || null,
    });

    const message = await newMessage.save();

    // Populate sender and receiver info for response
    await message.populate("sender", "email role").execPopulate();
    await message.populate("receiver", "email role").execPopulate();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Only receiver can mark message as read
    if (message.receiver.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    message.read = true;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false,
    });

    res.json({ count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
