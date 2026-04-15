const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");

// 1. ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.user._id;
    const { productId, quantity, size } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId and price are required",
      });
    }

    let    cart = await Cart.findOne({ userId });

    const product = await Product.findById(productId);

    // If cart does not exist → create new
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, size, price: product.price }],
      });
    } else {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (itemIndex > -1) {
        // If exists → update quantity
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        // If not → push new item
        cart.items.push({ productId, quantity, size, price: product.price });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
};

// 2. GET USER CART
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// 3. UPDATE QUANTITY
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: error.message,
    });
  }
};

// 4. REMOVE ITEM FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message,
    });
  }
};

// CLEAR CART
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
      error: error.message,
    });
  }
};
