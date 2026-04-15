const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      // required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    size: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    brand: {
      type: String,
    },

    colors: {
      type: [String],
    },

    imagePaths: {
      type: [String],
      required: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
