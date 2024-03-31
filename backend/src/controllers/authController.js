const { sendOtpToEmail } = require("../utils/sendOtpToEmail");

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.loginVendor = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // Query using user_email
    const user = await User.findOne({ user_email: user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isuservendor) {
      return res.status(403).json({ message: "Access denied. Not a vendor." });
    }

    res
      .status(200)
      .json({ message: "Login successful", user_name: user.user_name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_password, isuservendor } = req.body;

  try {
    let user = await User.findOne({ user_email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    user = new User({
      user_name,
      user_email,
      user_password: hashedPassword,
      isuservendor,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//write a api for login user only
exports.loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // Query using user_email
    const user = await User.findOne({ user_email: user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      message: "Login successful",
      user_name: user.user_name,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const otpCache = new Map();

exports.forgotPassword = async (req, res) => {
  const { user_email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("found the user");
    // Generate OTP
    const otp = generateOTP();

    // Store OTP in cache
    otpCache.set(user.user_email.toString(), otp);
    console.log("stored the otp");

    // Send OTP to user's email
    await sendOtpToEmail(user_email, otp);
    console.log("send the otp");

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error });
  }
};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}

exports.verifyOtp = async (req, res) => {
  const { user_email, otp } = req.body;

  try {
    // Retrieve the OTP sent to the user from the cache
    const cachedOtp = otpCache.get(user_email.toString());
    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, proceed to password reset route
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { user_email, new_password } = req.body;

  try {
    // Find user by ID
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.user_password = hashedPassword;
    await user.save();

    // Remove the OTP from the cache
    otpCache.delete(user_email.toString());

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
