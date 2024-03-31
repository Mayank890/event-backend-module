// routes/bookingRoutes.js

const express = require("express");
const Event = require("../models/eventModel"); // Adjust the path as necessary

const Booking = require("../models/bookingModel"); // Adjust the path as necessary

const router = express.Router();

router.post("/book-event", async (req, res) => {
  console.log("Received request body:", req.body); // Log the entire body

  const {
    event_id,
    user_email,
    total_amount,
    no_seats,
    platform_charges,
    payment_id,
  } = req.body;

  try {
    console.log("Received event_id:", event_id);

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.number_of_seats < no_seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }
    const newBooking = new Booking({
      event_id,
      user_email,
      total_amount,
      no_seats,
      platform_charges,
      payment_id,
    });
    await newBooking.save();

    // Deduct the seats and save the event
    event.number_of_seats -= no_seats;
    await event.save();

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating booking", error: error.message });
  }
});
router.get("/allbooking", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("event_id");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
});

// Fetch bookings by event_id
router.get("/event/:event_id", async (req, res) => {
  const { event_id } = req.params;
  try {
    const bookings = await Booking.find({ event_id }).populate("event_id");
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this event" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for event:", error);
    res.status(500).json({
      message: "Failed to fetch bookings for event",
      error: error.message,
    });
  }
});

router.get("/user/:user_email", async (req, res) => {
  const { user_email } = req.params;
  try {
    const bookings = await Booking.find({ user_email }).populate("event_id");
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for user:", error);
    res.status(500).json({
      message: "Failed to fetch bookings for user",
      error: error.message,
    });
  }
});

module.exports = router;
