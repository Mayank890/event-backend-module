// routes/slider.js
const express = require("express");
const multer = require("multer");
const SliderItem = require("../models/sliderModel");
const router = express.Router();
const fs = require("fs");
const path = require("path");
// Set up Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Insert a slider item
router.post("/create", upload.single("image"), async (req, res) => {
  const { title, description, link } = req.body;
  const imageUrl = req.file.path; // Using the file path as the image URL

  try {
    const sliderItem = new SliderItem({ title, description, imageUrl, link });
    await sliderItem.save();
    res.status(201).json(sliderItem);
  } catch (error) {
    res.status(400).json({ message: "Error creating slider item", error });
  }
});
//get all slider items
router.get("/allslider", async (req, res) => {
  try {
    const sliderItems = await SliderItem.find();
    res.status(200).json(sliderItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
//slider delete api delete with image
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sliderItem = await SliderItem.findById(id);

    if (!sliderItem) {
      return res.status(404).json({ message: "Slider item not found" });
    }

    // Construct the full path to the image file
    const filePath = path.join(__dirname, "..", "..", sliderItem.imageUrl);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    // Delete the slider item from the database
    await SliderItem.findByIdAndDelete(id);
    res.json({ message: "Slider item and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting slider item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;