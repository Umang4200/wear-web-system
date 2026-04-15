// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Cart = require("../models/CartModel");
// const Product = require("../models/ProductModel");

// exports.createRazorpayOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const cart = await Cart.findOne({ userId });

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Cart is empty",
//       });
//     }

//     let totalAmount = 0;
//     for (const item of cart.items) {
//       totalAmount += item.price * item.quantity;
//     }

//     const instance = new Razorpay({
//       key_id: process.env.RAZORPAY_API_KEY,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });

//     const options = {
//       amount: totalAmount * 100, // amount in the smallest currency unit
//       currency: "INR",
//       receipt: `receipt_${userId.toString().slice(-4)}_${Date.now()}`
//     };

//     const order = await instance.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (expectedSignature === razorpay_signature) {
//       res.status(200).json({
//         success: true,
//         message: "Payment successfully verified",
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Invalid signature",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };




const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const Order = require("../models/OrderModel");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//  CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    //  Calculate total
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${userId.toString().slice(-4)}_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  VERIFY + PLACE ORDER (SECURE FLOW)
exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId
    } = req.body;

    //  Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    //  Get cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    //  Optimize product fetching
    const productIds = cart.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    //  Group by seller
    const sellerMap = {};

    for (const item of cart.items) {
      const product = productMap[item.productId.toString()];

      if (!product) throw new Error("Product not found");

      const sellerId = product.sellerId.toString();

      if (!sellerMap[sellerId]) {
        sellerMap[sellerId] = {
          items: [],
          totalAmount: 0,
        };
      }

      sellerMap[sellerId].items.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });

      sellerMap[sellerId].totalAmount += item.price * item.quantity;
    }

    // Create orders per seller
    const orders = [];

    for (const sellerId in sellerMap) {
      const order = await Order.create({
        userId,
        sellerId,
        addressId,
        items: sellerMap[sellerId].items,
        totalAmount: sellerMap[sellerId].totalAmount,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      orders.push(order);
    }

    //  Clear cart
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      success: true,
      message: "Payment verified & order placed",
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};