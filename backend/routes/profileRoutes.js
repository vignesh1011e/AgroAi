const express = require("express");
const path = require("path");
const multer = require("multer");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// MULTER PROFILE PHOTO CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    cb(
      null,
      `profile-${req.user._id}-${Date.now()}${extension}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ==========================================
// GET PROFILE
// ==========================================

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to get profile",
    });
  }
});

// ==========================================
// UPDATE PROFILE
// ==========================================

router.put("/", protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      state,
      district,
      region,
      village,
      passbookNumber,
      landArea,
      surveyNumber,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update only fields that were provided
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (state !== undefined) user.state = state;
    if (district !== undefined) user.district = district;
    if (region !== undefined) user.region = region;
    if (village !== undefined) user.village = village;

    if (passbookNumber !== undefined) {
      user.passbookNumber = passbookNumber;
    }

    if (landArea !== undefined) {
      user.landArea = landArea;
    }

    if (surveyNumber !== undefined) {
      user.surveyNumber = surveyNumber;
    }

    // Kept for compatibility with the existing profile system
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        district: user.district,
        region: user.region,
        village: user.village,
        landArea: user.landArea,
        surveyNumber: user.surveyNumber,
        profileImage: user.profileImage,

        // Never expose the full passbook number
        passbookNumber: user.passbookNumber
          ? `••••••••${user.passbookNumber.slice(-4)}`
          : "",
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
});

// ==========================================
// UPLOAD PROFILE PHOTO
// ==========================================

router.post(
  "/photo",
  protect,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      user.profileImage = imageUrl;

      await user.save();

      res.json({
        message: "Profile photo uploaded successfully",
        profileImage: imageUrl,
      });
    } catch (error) {
      console.error("Profile photo upload error:", error);

      res.status(500).json({
        message: "Failed to upload profile photo",
      });
    }
  }
);

module.exports = router;