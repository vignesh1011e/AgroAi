const express = require("express");
const Message = require("../models/Message");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get messages for the logged-in farmer's region
router.get("/:region", protect, async (req, res) => {
  try {
    const requestedRegion = req.params.region;

    // Prevent users from requesting another region's chat
    if (
      requestedRegion.toLowerCase() !==
      req.user.region?.toLowerCase()
    ) {
      return res.status(403).json({
        message:
          "You can only access your own regional community.",
      });
    }

    const messages = await Message.find({
      region: req.user.region,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("sender", "name region");

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Failed to load messages",
    });
  }
});

module.exports = router;