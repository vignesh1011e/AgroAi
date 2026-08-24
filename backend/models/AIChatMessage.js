const mongoose = require("mongoose");

const aiChatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    disease: {
      type: Object,
      default: null,
    },
    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIChatMessage", aiChatMessageSchema);
