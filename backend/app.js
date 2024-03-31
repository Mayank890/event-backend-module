const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const sliderRoutes = require("./src/routes/sliderRoutes");
const pollRoutes = require("./src/routes/pollRoutes");
const userRoutes = require("./src/routes/userRoutes"); // Adjust the path to your routes file

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/bookings", bookingRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
