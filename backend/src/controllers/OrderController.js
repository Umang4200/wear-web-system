const Order = require("../models/OrderModel");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");



exports.placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const productIds = cart.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const sellerMap = {};

    for (const item of cart.items) {
      const product = productMap[item.productId.toString()];
      const sellerId = product.sellerId.toString();

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = { items: [], totalAmount: 0 };
      }

      sellerMap[sellerId].items.push(item);
      sellerMap[sellerId].totalAmount += item.price * item.quantity;
    }

    const orders = [];

    for (const sellerId in sellerMap) {
      const order = await Order.create({
        userId,
        sellerId,
        addressId,
        items: sellerMap[sellerId].items,
        totalAmount: sellerMap[sellerId].totalAmount,
        paymentMethod: "COD",
        paymentStatus: "Unpaid",
      });

      orders.push(order);
    }

    await Cart.findOneAndDelete({ userId });

    res.status(201).json({
      success: true,
      message: "COD Order placed",
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate("items.productId")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data:orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const orders = await Order.find({ sellerId })
      .populate("items.productId")
      .populate("userId", "name email")
      .populate("addressId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data:orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data:order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("items.productId")
      .populate("addressId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Optional: make sure only the owner or seller can view it. Assuming customer route:
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};