const express = require("express");
const router = express.Router();
const User = require("../models/userModel"); // Adjust the path to your User model

// Endpoint to fetch all users
router.get("/allusers", async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users from the database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//fetch user details by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update user details by id
router.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { user_name, user_email, user_password, isuservendor } = req.body;
    user.user_name = user_name || user.user_name;
    user.user_email = user_email || user.user_email;
    user.user_password = user_password || user.user_password;
    user.isuservendor = isuservendor;
    const updatedUser = await user.save();

    // Send updated user data in response
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
