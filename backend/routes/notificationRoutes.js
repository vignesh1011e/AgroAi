const express = require("express");
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET NOTIFICATIONS
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      (notification) => !notification.read
    ).length;

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      message: "Failed to get notifications",
    });
  }
});

// ==========================================
// CREATE NOTIFICATION
// ==========================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      user: req.user._id,
      title,
      message,
      type: type || "System",
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      message: "Failed to create notification",
    });
  }
});

// ==========================================
// MARK ALL AS READ
// IMPORTANT: Keep this BEFORE /:id/read
// ==========================================

router.put("/read-all", protect, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error
    );

    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
});

// ==========================================
// MARK ONE AS READ
// ==========================================

router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    res.status(500).json({
      message: "Failed to update notification",
    });
  }
});

// ==========================================
// DELETE NOTIFICATION
// ==========================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete notification",
    });
  }
});

module.exports = router;