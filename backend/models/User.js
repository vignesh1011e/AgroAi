const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
    },

    state: {
      type: String,
    },

    district: {
      type: String,
    },

    region: {
      type: String,
    },

    village: {
      type: String,
    },

    passbookNumber: {
    type: String,
    default: "",
    },

    landArea: {
    type: Number,
    default: null,
    },

    surveyNumber: {
    type: String,
    default: "",
    },

    crops: [
      {
        type: String,
      },
    ],

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);