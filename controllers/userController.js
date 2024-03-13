// This module help to listen request
const Web3 = require("web3");
const web3 = new Web3();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cacheOTP, sendEmail, checkOTP } = require("../utils/mails.js");
const { validationResult } = require("express-validator");
const UserModel = require("../Models/UserModel");
const { generateOTP } = require("../utils/mails.js");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashed Password := ", hashedPassword);

  return hashedPassword;
}

// User signup API
exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      country,
      phoneNumber,
    } = req.body;

    const hashedPassword = await hashPassword(password);

    // Create a new user document
    const newUser = new UserModel({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      country,
      phoneNumber,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);

    if (error.code == 11000) {
      console.log("Name := ", Object.keys(error?.keyValue)[0]);

      const duplicateFieldName = Object.keys(error?.keyValue)[0];

      return res.status(400).json({
        message: "User already registered with this " + duplicateFieldName,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User login API
exports.login = async (req, res) => {
  const errors = validationResult(req);

  try {
    const { userName, password } = req.body;

    const user = await UserModel.findOne({ userName: userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token with the user's ID as the payload
    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h", // Token expires in 1 hour (adjust as needed)
      }
    );

    // Saving token in the user document
    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "User login successful!",
      token,
      userId: user._id,
      email: user.email,
      userName: userName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for handling user forgot password request
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    // Generate a unique reset token and set an expiration time (e.g., 1 hour)
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Update the user's document with the reset token and expiration time
    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: Date.now() + 3600000, // Token expires in 1 hour (adjust as needed)
      }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("hello");
    await forgotPasswordOtp(email);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for handling user reset password
exports.resetPassword = async (req, res) => {
  const { newPassword, email, otp } = req.body;
  const verify = await checkOTP(email, otp);
  console.log(verify);

  if (!verify) {
    return res.status(400).json({ message: "Reset token has expired" });
  }
  try {
    // Verify the reset token and find the user
    // const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the token is expired

    // Hash the new password and update the user's password field
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const forgotPasswordOtp = async (email) => {
  const otp = await generateOTP();
  console.log(otp);
  const data = {
    from: "kartikeyvaishnav24@gmail.com",
    to: email,
    subject: "Registration OTP",
    text: `Here is your Registration OTP ${otp}`,
  };
  console.log(data);
  await cacheOTP(email, otp);

  const mail = await sendEmail(data)
    .then((body) => {
      console.log(body);
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
  return mail;
};
