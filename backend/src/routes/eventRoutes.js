const express = require("express");
const multer = require("multer");
const Event = require("../models/eventModel"); // Corrected import path for the Event model
const fs = require("fs");
const path = require("path");
const { dir } = require("console");
const router = express.Router();

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // Prepend the timestamp to avoid filename conflicts
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Event creation route
router.post(
  "/create",
  upload.fields([
    { name: "artist_img" },
    { name: "banner_img" },
    { name: "poster_img" },
  ]),
  async (req, res) => {
    const eventFields = req.body;
    if (req.files) {
      if (req.files.artist_img)
        eventFields.artist_img = req.files.artist_img[0].path;
      if (req.files.banner_img)
        eventFields.banner_img = req.files.banner_img[0].path;
      if (req.files.poster_img)
        eventFields.poster_img = req.files.poster_img[0].path;
    }
    try {
      const newEvent = new Event(eventFields);
      await newEvent.save();
      res
        .status(201)
        .json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create the event", error: error.message });
    }
  }
);
//all events api this is for only admin side
router.get("/eventlist", async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    res.json(events); // Send events as JSON response
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
});
// Route to list events by vendor email
router.get("/vendor/:email", async (req, res) => {
  const vendorEmail = req.params.email;
  try {
    const events = await Event.find({ vendor_email: vendorEmail });
    res.json(events);
  } catch (error) {
    res.status(404).json({
      message: "Error listing events by vendor email",
      error: error.message,
    });
  }
});
// Route to list events by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    // Find events by category and status
    const events = await Event.find({
      category: category,
      status: "activate", // Ensure only events with 'activate' status are fetched
    });

    if (events.length > 0) {
      res.status(200).json(events);
    } else {
      res
        .status(404)
        .json({ message: `No active events found in category: ${category}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching active events by category",
      error: error.message,
    });
  }
});

//delete event api
router.delete("/delete/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Define a helper function to delete files synchronously
    const deleteFile = (filePath) => {
      const fullPath = path.join(__dirname, "..", "..", filePath); // Adjust the path based on your directory structure
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Successfully deleted file: ${fullPath}`);
        } catch (err) {
          console.error(`Failed to delete file: ${fullPath}`, err);
        }
      } else {
        console.log(`File not found, cannot delete: ${fullPath}`);
      }
    };

    // Delete associated images
    ["artist_img", "banner_img", "poster_img"].forEach((imgField) => {
      if (event[imgField]) {
        deleteFile(event[imgField]);
      }
    });

    await Event.findByIdAndDelete(req.params.id);
    res.send("Event and associated images deleted successfully");
  } catch (error) {
    console.error("Failed to delete event:", error);
    res.status(500).send("Server error");
  }
});

//event details api using event id
router.get("/details/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding event details", error: error.message });
  }
});

// API to list all active events
router.get("/active", async (req, res) => {
  try {
    const activeEvents = await Event.find({ status: "activate" });
    res.json(activeEvents);
  } catch (error) {
    console.error("Failed to fetch active events:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch active events", error: error.message });
  }
});

router.put(
  "/update/:id",
  upload.fields([
    { name: "artist_img", maxCount: 1 },
    { name: "banner_img", maxCount: 1 },
    { name: "poster_img", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const eventUpdates = req.body;
      // Handling file uploads
      if (req.files) {
        if (req.files.artist_img)
          eventUpdates.artist_img = req.files.artist_img[0].path;
        if (req.files.banner_img)
          eventUpdates.banner_img = req.files.banner_img[0].path;
        if (req.files.poster_img)
          eventUpdates.poster_img = req.files.poster_img[0].path;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        eventUpdates,
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update the event", error: error.message });
    }
  }
);

// API to update event status
// This would be in your backend routes file

router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "activate") {
      return res.status(400).json({ message: "Event is already activated." });
    }

    event.status = "activate"; // or whatever status means 'activated' in your schema
    await event.save();

    res.json({ message: "Event activated successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating event status", error: error.message });
  }
});

router.get("/fetch-event", async (req, res) => {
  const { eventTitle } = req.query;

  try {
    // Assuming you have an Event model
    const events = await Event.find({
      event_name: { $regex: new RegExp(eventTitle, "i") },
    });

    if (events.length > 0) {
      const eventData = events.map((event) => ({
        title: event.event_name,
        id: event._id,
        // Add other properties as needed
      }));
      res.send(eventData);
    } else {
      res
        .status(404)
        .send({ message: "No events found with the provided search term" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
