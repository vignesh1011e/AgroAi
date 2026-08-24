const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Tractors",
        "Farm Machinery",
        "Tools",
        "Vehicles",
        "Irrigation",
        "Other",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: ["Sell", "Rent"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    sellerName: {
      type: String,
      required: true,
    },

    sellerPhone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Listing", listingSchema);