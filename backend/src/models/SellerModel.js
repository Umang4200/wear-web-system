const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shopName: {
      type: String,
      required: true,
    },

    businessEmail: {
      type: String,
      required: true,
    },

    gstNumber: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    bankDetails: {
      name: {
        type: String,
      },
      ifscCode: {
        type: String
      },
      accountNumber: {
        type: String,
        min: 12,
        max: 12
      }
    }
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
