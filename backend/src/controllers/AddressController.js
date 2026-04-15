const { default: mongoose } = require("mongoose");
const Address = require("../models/AddressModel");
const User = require("../models/UserModel");

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { area, city, state, pincode, mobile } = req.body;

    const existUser = await User.findById(userId);

    if (!existUser) {
      res.status(404).json({
        message: "User Not found",
      });
    }

    const savedAddress = await Address.create({
      userId,
      area,
      city,
      state,
      pincode,
      mobile,
    });

    res.status(201).json({
      success: true,
      message: "Address created Successfully",
      data: savedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAddressByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ userId });

    // 4️⃣ If no address found
    if (!addresses || addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No address found for this user",
      });
    }

    // 5 Success response
    return res.status(200).json({
      success: true,
      message: "User address fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.query;

    // Check if address exists
    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // convert a userid to string
    const StrUserId = address.userId.toString();

    // Check if address belongs to the user
    if (StrUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this address",
      });
    }

    // 5 Delete address
    await Address.findByIdAndDelete(addressId);

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    console.log(addressId);
    const userId = req.user._id;
    const { area, city, state, pincode, mobile } = req.body;

    const existUser = await User.findById(userId);

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findById(addressId);

    if (address.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this address",
      });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        area,
        city,
        state,
        pincode,
        mobile,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated Successfully ",
      data: updatedAddress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
