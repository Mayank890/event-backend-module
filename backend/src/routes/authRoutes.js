const express = require("express");
const {
  loginVendor,
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Authentication routes
router.post("/login/vendor", loginVendor); // Route for vendor login
router.post("/register", registerUser); // Route for user registration
router.post("/login/user", loginUser); // Route for user login

// Password reset routes
router.post("/forgot-password", forgotPassword); // Route for requesting password reset OTP
router.post("/verify-otp", verifyOtp); // Route for verifying OTP
router.post("/reset-password", resetPassword); // Route for resetting password

module.exports = router;
