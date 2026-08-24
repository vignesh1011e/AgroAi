const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Land Preparation",
        "Planting",
        "Irrigation",
        "Fertilizing",
        "Pest Control",
        "Maintenance",
        "Harvesting",
        "Farm Management",
        "Other",
      ],
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Upcoming"],
      default: "Pending",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);