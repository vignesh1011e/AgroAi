const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("./models/Listing");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    process.exit(1);
  }
};

const sampleListings = [
  {
    title: "Mahindra 575 DI Tractor",
    description:
      "Reliable tractor suitable for ploughing, cultivation, transportation and general farm work.",
    category: "Tractors",
    type: "Sell",
    price: 620000,
    location: "Vadodara, Gujarat",
    image: "",
    sellerName: "Ramesh Patel",
    sellerPhone: "9876543210",
  },

  {
    title: "Swaraj 744 FE Tractor",
    description:
      "Powerful tractor suitable for medium and large agricultural fields.",
    category: "Tractors",
    type: "Sell",
    price: 710000,
    location: "Anand, Gujarat",
    image: "",
    sellerName: "Suresh Patel",
    sellerPhone: "9876543211",
  },

  {
    title: "John Deere 5310 Tractor",
    description:
      "Well-maintained tractor available for agricultural work on a daily rental basis.",
    category: "Tractors",
    type: "Rent",
    price: 1500,
    location: "Vadodara, Gujarat",
    image: "",
    sellerName: "Kiran Patel",
    sellerPhone: "9876543212",
  },

  {
    title: "Fieldking Cultivator",
    description:
      "Heavy-duty cultivator suitable for soil preparation and field cultivation.",
    category: "Farm Machinery",
    type: "Sell",
    price: 45000,
    location: "Ahmedabad, Gujarat",
    image: "",
    sellerName: "Mahesh Kumar",
    sellerPhone: "9876543213",
  },

  {
    title: "Shaktiman Rotavator",
    description:
      "Agricultural rotavator suitable for seedbed preparation and soil mixing.",
    category: "Farm Machinery",
    type: "Sell",
    price: 115000,
    location: "Nadiad, Gujarat",
    image: "",
    sellerName: "Dinesh Patel",
    sellerPhone: "9876543214",
  },

  {
    title: "Mahindra Seed Drill",
    description:
      "Efficient seed drill designed for accurate seed placement and agricultural field work.",
    category: "Farm Machinery",
    type: "Rent",
    price: 1200,
    location: "Bharuch, Gujarat",
    image: "",
    sellerName: "Ajay Patel",
    sellerPhone: "9876543215",
  },

  {
    title: "Kirloskar 5 HP Water Pump",
    description:
      "5 HP agricultural water pump suitable for irrigation and farm water supply.",
    category: "Irrigation",
    type: "Sell",
    price: 32000,
    location: "Vadodara, Gujarat",
    image: "",
    sellerName: "Vijay Shah",
    sellerPhone: "9876543216",
  },

  {
    title: "Battery Agricultural Sprayer",
    description:
      "Portable battery-powered sprayer suitable for pesticides, fertilizers and crop protection.",
    category: "Tools",
    type: "Sell",
    price: 8500,
    location: "Godhra, Gujarat",
    image: "",
    sellerName: "Harish Patel",
    sellerPhone: "9876543217",
  },

  {
    title: "Farm Tractor Trailer",
    description:
      "Strong agricultural trailer suitable for transporting crops, fertilizer and farm materials.",
    category: "Vehicles",
    type: "Sell",
    price: 95000,
    location: "Dahod, Gujarat",
    image: "",
    sellerName: "Bharat Patel",
    sellerPhone: "9876543218",
  },

  {
    title: "Paddy Harvester",
    description:
      "Agricultural harvester available for seasonal rental. Suitable for harvesting paddy crops.",
    category: "Farm Machinery",
    type: "Rent",
    price: 3500,
    location: "Anand, Gujarat",
    image: "",
    sellerName: "Rajesh Kumar",
    sellerPhone: "9876543219",
  },
];

const seedListings = async () => {
  try {
    await connectDB();

    // Remove existing sample listings created by this seed
    await Listing.deleteMany({
      sellerName: {
        $in: [
          "Ramesh Patel",
          "Suresh Patel",
          "Kiran Patel",
          "Mahesh Kumar",
          "Dinesh Patel",
          "Ajay Patel",
          "Vijay Shah",
          "Harish Patel",
          "Bharat Patel",
          "Rajesh Kumar",
        ],
      },
    });

    await Listing.insertMany(
      sampleListings
    );

    console.log(
      `✅ ${sampleListings.length} sample listings added successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Failed to seed listings:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedListings();