const express = require("express");
const Listing = require("../models/Listing");
const protect = require("../middleware/authMiddleware");
const path = require("path");
const multer = require("multer");

const router = express.Router();

// ==========================================
// IMAGE UPLOAD CONFIG
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/listings");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================================
// GET ALL LISTINGS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find()
      .sort({ createdAt: -1 });

    res.json({
      listings,
    });
  } catch (error) {
    console.error(
      "Get listings error:",
      error
    );

    res.status(500).json({
      message: "Failed to get listings",
    });
  }
});

// ==========================================
// CREATE LISTING
// ==========================================

router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      price,
      location,
      image,
      sellerPhone,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !type ||
      price === undefined ||
      !location
    ) {
      return res.status(400).json({
        message:
          "Title, description, category, type, price and location are required",
      });
    }

    const imagePath = req.file
  ? `/uploads/listings/${req.file.filename}`
  : "";

const listing = await Listing.create({
  title,
  description,
  category,
  type,
  price,
  location,
  image: imagePath,
  sellerName: req.user.name,
  sellerPhone:
    sellerPhone || req.user.phone || "",
});

    res.status(201).json({
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error(
      "Create listing error:",
      error
    );

    res.status(500).json({
      message: "Failed to create listing",
    });
  }
});

// ==========================================
// UPDATE LISTING
// ==========================================

router.put(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const listing =
        await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          message: "Listing not found",
        });
      }

      // Only the seller should be able to edit
      if (
        listing.sellerName !== req.user.name
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to edit this listing",
        });
      }

      const {
        title,
        description,
        category,
        type,
        price,
        location,
        image,
        sellerPhone,
      } = req.body;

      if (title !== undefined) {
        listing.title = title;
      }

      if (description !== undefined) {
        listing.description =
          description;
      }

      if (category !== undefined) {
        listing.category = category;
      }

      if (type !== undefined) {
        listing.type = type;
      }

      if (price !== undefined) {
        listing.price = price;
      }

      if (location !== undefined) {
        listing.location = location;
      }

      if (image !== undefined) {
        listing.image = image;
      }

      if (sellerPhone !== undefined) {
        listing.sellerPhone =
          sellerPhone;
      }

      await listing.save();

      res.json({
        message: "Listing updated successfully",
        listing,
      });
    } catch (error) {
      console.error(
        "Update listing error:",
        error
      );

      res.status(500).json({
        message: "Failed to update listing",
      });
    }
  }
);

// ==========================================
// DELETE LISTING
// ==========================================

router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const listing =
        await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          message: "Listing not found",
        });
      }

      // Only the seller should be able to delete
      if (
        listing.sellerName !== req.user.name
      ) {
        return res.status(403).json({
          message:
            "You are not allowed to delete this listing",
        });
      }

      await Listing.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Listing deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete listing error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete listing",
      });
    }
  }
);

module.exports = router;