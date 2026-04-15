const User = require("../models/UserModel");
const Seller = require("../models/SellerModel");
const bcrypt = require("bcrypt");
const { mailSend } = require("../utils/MailSend");
const Address = require("../models/AddressModel");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      shopName,
      businessEmail,
      gstNumber,
      area,
      city,
      state,
      pincode,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User is already registered",
      });
    }

    const userRole = role || "customer";

    if (userRole === "seller") {
      if (!shopName || !businessEmail || !gstNumber || !area || !city || !state || !pincode) {
        return res.status(400).json({
          message: "All seller fields are required",
        });
      }
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      name,
      email,
      password: encryptedPass,
      role: userRole,
    });

    if (userRole === "seller") {
      await Seller.create({
        userId: createdUser._id,
        shopName,
        gstNumber,
        businessEmail,
      });

      await Address.create({
        userId: createdUser._id,
        area,
        city,
        state,
        pincode,
      });
    }

    try {
      await mailSend(createdUser.email, "Welcome", "Registration Successful");
    } catch (err) {
      console.log("Mail error:", err);
    }

    const userResponse = createdUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Registered successfully",
      data: userResponse,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while registering user",
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!email || !password) {
      return res.json({
        message: "All fields are required",
      });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({
        message: "User is Not registered",
      });
    }

    const isMatched = await bcrypt.compare(password, foundUser.password);

    if (isMatched) {
      const userPayload = foundUser.toObject();
      delete userPayload.password;

      const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.status(200).json({
        success: true,
        message: "login Sucessfully",
        token: token,
        role: foundUser.role,
      });
    } else {
      //401 Unauthorized
      //404 Not Found
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Error While Login",
    });
  }
};


exports.getUserDetail = async (req, res) => {
  try {
    const id = req.user._id;

    const fetchedUser = await User.findById(id);
    const fetchedSeller = await Seller.findOne({ userId: id });
    const fetchedAddress = await Address.findOne({ userId: id });


    if (!fetchedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObj = fetchedUser.toObject();
    delete userObj.password;

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {userObj, fetchedSeller, fetchedAddress}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error While fetching the User",
    });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 1 * 60 * 1000); // 1 mins

    user.resetPasswordOTP = generatedOTP;
    user.resetPasswordExpires = expiry;
    await user.save();

    await mailSend(
      user.email,
      "Password Reset Verification",
      `<h1>Password Reset</h1><p>Your OTP for resetting the password is <strong>${generatedOTP}</strong>. It is valid for 15 minutes.</p>`
    );

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending OTP", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.resetPasswordOTP !== otp ) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

     if ( user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP is expired" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });


    const encryptedPass = await bcrypt.hash(newPassword, 10);
    user.password = encryptedPass;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resetting password", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const { name, email, mobile } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    
    // Warning: typically if emails are changed, further verification is needed.
    // For this implementation, allowing straight update if valid.
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id.toString()) {
        return res.status(400).json({ success: false, message: "Email is already taken" });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      userObj: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};
