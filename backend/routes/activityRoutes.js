const express = require("express");
const Activity = require("../models/Activity");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL ACTIVITIES FOR LOGGED-IN FARMER
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    }).sort({ date: 1 });

    res.json({
      activities,
    });
  } catch (error) {
    console.error("Get activities error:", error);

    res.status(500).json({
      message: "Failed to get activities",
    });
  }
});

// ==========================================
// CREATE ACTIVITY
// ==========================================

router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      type,
      date,
      status,
      description,
    } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({
        message: "Title, type and date are required",
      });
    }

    const activity = await Activity.create({
      title,
      type,
      date,
      status: status || "Pending",
      description: description || "",
      user: req.user._id,
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    console.error("Create activity error:", error);

    res.status(500).json({
      message: "Failed to create activity",
    });
  }
});

// ==========================================
// UPDATE ACTIVITY
// ==========================================

router.put("/:id", protect, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    const {
      title,
      type,
      date,
      status,
      description,
    } = req.body;

    if (title !== undefined) activity.title = title;
    if (type !== undefined) activity.type = type;
    if (date !== undefined) activity.date = date;
    if (status !== undefined) activity.status = status;
    if (description !== undefined) {
      activity.description = description;
    }

    await activity.save();

    res.json({
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    console.error("Update activity error:", error);

    res.status(500).json({
      message: "Failed to update activity",
    });
  }
});

// ==========================================
// DELETE ACTIVITY
// ==========================================

router.delete("/:id", protect, async (req, res) => {
  try {
    const activity = await Activity.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found",
      });
    }

    res.json({
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete activity error:", error);

    res.status(500).json({
      message: "Failed to delete activity",
    });
  }
});

module.exports = router;