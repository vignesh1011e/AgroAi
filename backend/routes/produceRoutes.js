const express = require("express");
const FarmProduce = require("../models/FarmProduce");
const protect = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

// Ensure upload directory exists
const uploadDir = "uploads/produce";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
});

// Initial Seed Data if collection is empty
const INITIAL_PRODUCE_SEEDS = [
  {
    cropName: "Organic Desi Tomatoes (హైబ్రిడ్ నాటు టమోటాలు)",
    variety: "Country Heirloom / Desi",
    category: "Vegetables",
    quantityAvailable: 450,
    quantityUnit: "kg",
    pricePerUnit: 28,
    distributorMarketPrice: 45,
    minimumOrderQty: 5,
    harvestDate: "Harvested Today Morning",
    farmLocation: "Madanapalle, Andhra Pradesh",
    farmingMethod: "Natural / ZBNF",
    deliveryOptions: ["Farm Gate Pickup", "Local Delivery (<30km)", "Transport / Courier"],
    description: "Sun-ripened, pesticide-free fresh desi tomatoes with authentic sweet & tangy flavor. Directly from organic farm, zero middleman margin.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
    farmerName: "Ramesh Reddy",
    farmerPhone: "+91 98480 12345",
    farmerWhatsapp: "+919848012345",
    status: "Available",
  },
  {
    cropName: "Sona Masoori Single-Polished Rice (సోనా మసూరి బియ్యం)",
    variety: "BPT 5204 (1-Year Aged)",
    category: "Grains & Cereals",
    quantityAvailable: 80,
    quantityUnit: "bag (50kg)",
    pricePerUnit: 2450,
    distributorMarketPrice: 3200,
    minimumOrderQty: 1,
    harvestDate: "Aged 1 Year (Dry Stored)",
    farmLocation: "Kurnool, Andhra Pradesh",
    farmingMethod: "Organic (Certified)",
    deliveryOptions: ["Farm Gate Pickup", "Transport / Courier", "Bulk Freight"],
    description: "Premium aromatic 1-year naturally aged Sona Masoori rice. Unpolished nutrient-rich bran intact, no chemical bleaching or polishing.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
    farmerName: "Venkata Rao",
    farmerPhone: "+91 94401 67890",
    farmerWhatsapp: "+919440167890",
    status: "Available",
  },
  {
    cropName: "Fresh Alphonso / Banganapalle Mangoes (బంగినపల్లి మామిడి)",
    variety: "Tree-Ripened Premium GI Tagged",
    category: "Fruits",
    quantityAvailable: 120,
    quantityUnit: "box",
    pricePerUnit: 750,
    distributorMarketPrice: 1200,
    minimumOrderQty: 2,
    harvestDate: "Harvested Yesterday",
    farmLocation: "Nuzvid, Krishna District, AP",
    farmingMethod: "Natural / ZBNF",
    deliveryOptions: ["Local Delivery (<30km)", "Transport / Courier"],
    description: "Naturally carbide-free grass-ripened sweet Banganapalle mangoes. Box of 12 handpicked large grade A mangoes directly from our orchards.",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
    farmerName: "Lakshmi Narayana",
    farmerPhone: "+91 98765 43210",
    farmerWhatsapp: "+919876543210",
    status: "Available",
  },
  {
    cropName: "Organic Salem Turmeric Fingers (సేలం పసుపు కొమ్ములు)",
    variety: "Salem High Curcumin (5.2%)",
    category: "Spices & Herbs",
    quantityAvailable: 350,
    quantityUnit: "kg",
    pricePerUnit: 140,
    distributorMarketPrice: 220,
    minimumOrderQty: 5,
    harvestDate: "Sun-Dried This Week",
    farmLocation: "Nizamabad, Telangana",
    farmingMethod: "Organic (Certified)",
    deliveryOptions: ["Farm Gate Pickup", "Transport / Courier", "Bulk Freight"],
    description: "Golden aromatic whole turmeric fingers naturally boiled and sun-dried. High curcumin laboratory certified. Ideal for Ayurvedic use and pure spice grinding.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
    farmerName: "Balram Patil",
    farmerPhone: "+91 98230 45678",
    farmerWhatsapp: "+919823045678",
    status: "Available",
  },
  {
    cropName: "Fresh Red Onions / Nashik Pyaz (ఎర్ర ఉల్లిపాయలు)",
    variety: "Garwa Medium-Large",
    category: "Vegetables",
    quantityAvailable: 12,
    quantityUnit: "quintal",
    pricePerUnit: 2200,
    distributorMarketPrice: 3400,
    minimumOrderQty: 1,
    harvestDate: "Harvested 3 Days Ago",
    farmLocation: "Nashik, Maharashtra",
    farmingMethod: "Conventional",
    deliveryOptions: ["Farm Gate Pickup", "Bulk Freight"],
    description: "Crisp, pungent long-shelf-life Nashik red onions sorted and graded in 50kg aerated mesh bags. Direct farm wholesale rates.",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
    farmerName: "Sanjay Deshmukh",
    farmerPhone: "+91 97654 11223",
    farmerWhatsapp: "+919765411223",
    status: "Available",
  },
  {
    cropName: "Cold-Pressed Raw Organic Wild Honey (స్వచ్ఛమైన తేనె)",
    variety: "Forest Multi-Flora Raw & Unfiltered",
    category: "Dairy & Honey",
    quantityAvailable: 85,
    quantityUnit: "liter",
    pricePerUnit: 480,
    distributorMarketPrice: 750,
    minimumOrderQty: 1,
    harvestDate: "Extracted Last Week",
    farmLocation: "Araku Valley, Andhra Pradesh",
    farmingMethod: "Organic (Certified)",
    deliveryOptions: ["Local Delivery (<30km)", "Transport / Courier"],
    description: "100% pure, unpasteurized, unprocessed tribal forest honey rich in natural pollen, enzymes, and antioxidants. Zero added sugar syrup.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
    farmerName: "Somanna Koya",
    farmerPhone: "+91 94902 33445",
    farmerWhatsapp: "+919490233445",
    status: "Available",
  },
];

const seedIfNeeded = async () => {
  try {
    const count = await FarmProduce.countDocuments();
    if (count === 0) {
      await FarmProduce.insertMany(INITIAL_PRODUCE_SEEDS);
      console.log("🌱 Seeded initial FarmProduce listings for direct farmer sales.");
    }
  } catch (err) {
    console.warn("Could not seed FarmProduce:", err.message);
  }
};

// ==========================================
// GET ALL PRODUCE WITH SEARCH & FILTERS
// ==========================================
router.get("/", async (req, res) => {
  try {
    await seedIfNeeded();

    const { category, method, status, search, location, sort } = req.query;
    const query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (method && method !== "All") {
      query.farmingMethod = method;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (location) {
      query.farmLocation = { $regex: location, $options: "i" };
    }

    if (search) {
      query.$or = [
        { cropName: { $regex: search, $options: "i" } },
        { variety: { $regex: search, $options: "i" } },
        { farmLocation: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { pricePerUnit: 1 };
    if (sort === "price-high") sortOption = { pricePerUnit: -1 };
    if (sort === "qty-high") sortOption = { quantityAvailable: -1 };

    const produceListings = await FarmProduce.find(query).sort(sortOption);

    res.json({
      success: true,
      count: produceListings.length,
      produce: produceListings,
    });
  } catch (error) {
    console.error("Get FarmProduce error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch farm produce" });
  }
});

// ==========================================
// GET MARKETPLACE STATISTICS
// ==========================================
router.get("/stats", async (req, res) => {
  try {
    const totalListings = await FarmProduce.countDocuments({ status: "Available" });
    const distinctFarmers = await FarmProduce.distinct("farmerName");
    const organicCount = await FarmProduce.countDocuments({
      farmingMethod: { $in: ["Organic (Certified)", "Natural / ZBNF"] },
      status: "Available",
    });

    const listings = await FarmProduce.find({ status: "Available" }).select(
      "pricePerUnit distributorMarketPrice"
    );

    let totalDirect = 0;
    let totalDistributor = 0;
    let validPairs = 0;

    listings.forEach((item) => {
      if (item.distributorMarketPrice > item.pricePerUnit) {
        totalDirect += item.pricePerUnit;
        totalDistributor += item.distributorMarketPrice;
        validPairs++;
      }
    });

    const averageSavingsPercent =
      validPairs > 0 && totalDistributor > 0
        ? Math.round(((totalDistributor - totalDirect) / totalDistributor) * 100)
        : 35;

    res.json({
      success: true,
      totalListings,
      activeFarmers: distinctFarmers.length || 1,
      organicSharePercent: totalListings > 0 ? Math.round((organicCount / totalListings) * 100) : 60,
      middlemanCutSavedPercent: averageSavingsPercent,
    });
  } catch (error) {
    console.error("Produce stats error:", error);
    res.status(500).json({ success: false, message: "Failed to get produce statistics" });
  }
});

// ==========================================
// GET CURRENT USER'S PRODUCE LISTINGS
// ==========================================
router.get("/my-listings", protect, async (req, res) => {
  try {
    const myProduce = await FarmProduce.find({
      $or: [{ farmerId: req.user._id }, { farmerName: req.user.name }],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: myProduce.length,
      produce: myProduce,
    });
  } catch (error) {
    console.error("Get my produce error:", error);
    res.status(500).json({ success: false, message: "Failed to get your harvest listings" });
  }
});

// ==========================================
// CREATE NEW DIRECT PRODUCE LISTING
// ==========================================
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const {
      cropName,
      variety,
      category,
      quantityAvailable,
      quantityUnit,
      pricePerUnit,
      distributorMarketPrice,
      minimumOrderQty,
      harvestDate,
      farmLocation,
      farmingMethod,
      deliveryOptions,
      description,
      farmerPhone,
      farmerWhatsapp,
    } = req.body;

    if (!cropName || !category || !quantityAvailable || !pricePerUnit || !farmLocation) {
      return res.status(400).json({
        success: false,
        message: "Crop name, category, quantity, price, and farm location are required",
      });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/produce/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    } else {
      // Default placeholder based on category
      imagePath = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80";
    }

    let parsedDelivery = ["Farm Gate Pickup", "Local Delivery (<30km)"];
    if (deliveryOptions) {
      try {
        parsedDelivery = typeof deliveryOptions === "string" ? JSON.parse(deliveryOptions) : deliveryOptions;
      } catch (e) {
        parsedDelivery = [deliveryOptions];
      }
    }

    const calculatedDistributorPrice =
      distributorMarketPrice && Number(distributorMarketPrice) > 0
        ? Number(distributorMarketPrice)
        : Math.round(Number(pricePerUnit) * 1.4); // Standard 40% distributor markup if not supplied

    const newListing = await FarmProduce.create({
      cropName,
      variety: variety || "",
      category,
      quantityAvailable: Number(quantityAvailable),
      quantityUnit: quantityUnit || "kg",
      pricePerUnit: Number(pricePerUnit),
      distributorMarketPrice: calculatedDistributorPrice,
      minimumOrderQty: minimumOrderQty ? Number(minimumOrderQty) : 1,
      harvestDate: harvestDate || "Freshly Harvested Today",
      farmLocation,
      farmingMethod: farmingMethod || "Natural / ZBNF",
      deliveryOptions: parsedDelivery,
      description: description || "",
      image: imagePath,
      farmerName: req.user.name,
      farmerPhone: farmerPhone || req.user.phone || "",
      farmerWhatsapp: farmerWhatsapp || farmerPhone || req.user.phone || "",
      farmerId: req.user._id,
      status: "Available",
    });

    res.status(201).json({
      success: true,
      message: "Harvest listed successfully! Buyers can now contact you directly.",
      produce: newListing,
    });
  } catch (error) {
    console.error("Create produce error:", error);
    res.status(500).json({ success: false, message: "Failed to list harvest" });
  }
});

// ==========================================
// UPDATE PRODUCE LISTING
// ==========================================
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const item = await FarmProduce.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Produce listing not found" });
    }

    // Ownership check
    const isOwner =
      String(item.farmerId) === String(req.user._id) || item.farmerName === req.user.name;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this listing",
      });
    }

    const fields = [
      "cropName",
      "variety",
      "category",
      "quantityAvailable",
      "quantityUnit",
      "pricePerUnit",
      "distributorMarketPrice",
      "minimumOrderQty",
      "harvestDate",
      "farmLocation",
      "farmingMethod",
      "description",
      "farmerPhone",
      "farmerWhatsapp",
      "status",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    if (req.file) {
      item.image = `/uploads/produce/${req.file.filename}`;
    } else if (req.body.image) {
      item.image = req.body.image;
    }

    if (req.body.deliveryOptions) {
      try {
        item.deliveryOptions =
          typeof req.body.deliveryOptions === "string"
            ? JSON.parse(req.body.deliveryOptions)
            : req.body.deliveryOptions;
      } catch (e) {
        item.deliveryOptions = [req.body.deliveryOptions];
      }
    }

    await item.save();

    res.json({
      success: true,
      message: "Harvest listing updated successfully",
      produce: item,
    });
  } catch (error) {
    console.error("Update produce error:", error);
    res.status(500).json({ success: false, message: "Failed to update listing" });
  }
});

// ==========================================
// DELETE PRODUCE LISTING
// ==========================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await FarmProduce.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Produce listing not found" });
    }

    const isOwner =
      String(item.farmerId) === String(req.user._id) || item.farmerName === req.user.name;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this listing",
      });
    }

    await FarmProduce.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Produce listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete produce error:", error);
    res.status(500).json({ success: false, message: "Failed to delete listing" });
  }
});

module.exports = router;
