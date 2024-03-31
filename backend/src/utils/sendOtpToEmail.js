const nodemailer = require("nodemailer");

// Function to send OTP to user's email
async function sendOtpToEmail(email, otp) {
  // Create a nodemailer transporter using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Replace with your email
      pass: process.env.EMAIL_PASSWORD, // Replace with your email password
    },
  });

  // Email message
  let mailOptions = {
    from: process.env.EMAIL_USER, // Replace with your email
    to: email,
    subject: "Password Reset OTP",
    text: `We have received a password reset request. Please use the below otp to reset your password \n \n Your OTP is: ${otp}`,
  };

  try {
    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

module.exports = { sendOtpToEmail };
