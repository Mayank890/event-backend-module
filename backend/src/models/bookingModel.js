const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    user_email: {
      type: String,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    no_seats: {
      type: Number,
      required: true,
    },
    platform_charges: {
      type: Number,
      required: true,
    },
    payment_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;