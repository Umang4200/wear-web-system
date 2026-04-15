const Wishlist = require("../models/WishlistModel");
const mongoose = require("mongoose");

// 1 Add Product to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // validation
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "UserId and ProductId are required",
      });
    }

    // check valid object id
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid UserId or ProductId",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    // create wishlist if not exists
    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [productId],
      });

      await wishlist.save();

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        data: wishlist,
      });
    }

    // check if product already exists
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2 Get User Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId }).populate("products");

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3 Remove Product From Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "UserId and ProductId are required",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: productId } },
      { new: true }
    );

    // wishlist.products = wishlist.products.filter(
    //     (pId) => pId.toString() !== productId
    // );

    // await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: updatedWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4 Clear Wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5 Check Product in Wishlist
// exports.isInWishlist = async (req, res) => {

//     try {

//         const { userId, productId } = req.params;

//         const wishlist = await Wishlist.findOne({ userId });

//         if (!wishlist) {
//             return res.status(200).json({
//                 success: true,
//                 exists: false
//             });
//         }

//         const exists = wishlist.products.includes(productId);

//         res.status(200).json({
//             success: true,
//             exists
//         });

//     } catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }
// };
