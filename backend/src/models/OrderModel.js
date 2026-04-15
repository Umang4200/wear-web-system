const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    orderStatus: {
        type: String,
        enum: ["Placed", "Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Placed"
    },

    paymentStatus: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid"
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD"
    },

    orderDate: {
        type: Date,
        default: Date.now
    },

    deliveryDate: {
        type: Date
    },
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,

}, {
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema);