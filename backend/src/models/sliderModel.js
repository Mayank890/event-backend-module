const mongoose = require("mongoose");

const sliderItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  link: { type: String },
});

module.exports = mongoose.model("Slider", sliderItemSchema);