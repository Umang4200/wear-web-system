const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "Card", "COD"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["Success", "Failed"],
        required: true
    },
    
}, {
    timestamps: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);