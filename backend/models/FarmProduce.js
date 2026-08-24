const mongoose = require("mongoose");

const farmProduceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },
    variety: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Vegetables",
        "Fruits",
        "Grains & Cereals",
        "Pulses & Lentils",
        "Spices & Herbs",
        "Organic Produce",
        "Dairy & Honey",
        "Other",
      ],
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityUnit: {
      type: String,
      required: true,
      enum: [
        "kg",
        "quintal",
        "ton",
        "crate (25kg)",
        "bag (50kg)",
        "box",
        "dozen",
        "liter",
      ],
      default: "kg",
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    distributorMarketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrderQty: {
      type: Number,
      default: 1,
      min: 1,
    },
    harvestDate: {
      type: String,
      default: "Freshly Harvested Today",
    },
    farmLocation: {
      type: String,
      required: true,
      trim: true,
    },
    farmingMethod: {
      type: String,
      enum: [
        "Organic (Certified)",
        "Natural / ZBNF",
        "Conventional",
        "Hydroponic",
      ],
      default: "Natural / ZBNF",
    },
    deliveryOptions: {
      type: [String],
      default: ["Farm Gate Pickup", "Local Delivery (<30km)"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerPhone: {
      type: String,
      default: "",
    },
    farmerWhatsapp: {
      type: String,
      default: "",
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Available", "Sold Out", "Coming Soon"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FarmProduce", farmProduceSchema);
