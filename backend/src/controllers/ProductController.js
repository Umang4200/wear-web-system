const Product = require("../models/ProductModel");
const uploadToCloudinary = require("../utils/Cloudinary");

exports.addProduct = async (req, res) => {
  try {
    //sellerID
    const sellerId = req.user._id;

    const {
      categoryId,
      title,
      description,
      price,
      quantity,
      size,
      colors,
      sku,
      brand,
    } = req.body;


    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path, "wear-web-system/products");
        imageUrls.push(result.secure_url);
      }
    }
    console.log(imageUrls);

    try {
      const createdProduct = await Product.create({
        sellerId,
        categoryId,
        title,
        description,
        price,
        quantity,
        size,
        colors,
        sku,
        brand,
        imagePaths: imageUrls,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: createdProduct,
      });
    } catch (error) {
      console.log("error", error);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while creating product",
      error,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const products = await Product.find().limit(limit);
    res.status(200).json({
      success: true,
      data: products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching products",
      error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const productId = req.params.id;
    const deletedProduct = await Product.findOneAndDelete({
      _id: productId,
      sellerId,
    });
    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//get Product By Seller ID
exports.getProductBySellerId = async (req, res) => {
  try {
    const sellerId = req.user._id;

    //  2. Validate sellerId
    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is missing",
      });
    }

    // 3. Role-based validation
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only sellers can view their products",
      });
    }

    const fetchedProducts = await Product.find({ sellerId });

    // Handle empty result
    if (!fetchedProducts || fetchedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this seller",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      count: fetchedProducts.length,
      data: fetchedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching products",
    });
  }
};

// update a product
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    //  1. Find existing product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updatedImages = [...product.imagePaths];

    //  2. REMOVE IMAGES
    if (req.body.removeImages) {
      let removeImages = req.body.removeImages;

      // convert string → array
      if (typeof removeImages === "string") {
        removeImages = JSON.parse(removeImages);
      }

      updatedImages = updatedImages.filter(
        (img) => !removeImages.includes(img)
      );
    }

    //  3. ADD NEW IMAGES
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path, "wear-web-system/products");
        updatedImages.push(result.secure_url);
      }
    }

    //  4. Prepare update data
    const updateData = {
      ...req.body,
      imagePaths: updatedImages,
    };

    // remove unwanted field
    delete updateData.removeImages;

    //  convert colors if needed
    if (updateData.colors && typeof updateData.colors === "string") {
      updateData.colors = updateData.colors.split(",");
    }

    // 5. Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { returnDocument: "after" }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);

    res.status(500).json({
      success: false,
      message: "Error while updating product",
    });
  }
};
// get product by product ID single product
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const fetchedProduct = await Product.findById(id);

    // Handle empty result
    if (!fetchedProduct) {
      return res.status(404).json({
        success: false,
        message: "No products found for this id",
      });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: fetchedProduct,
    });
    console.log(fetchedProduct);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching products",
    });
  }
};




exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      page = 1,
      limit = 8,
      minPrice = 0,
      maxPrice = 100000,
      sort,
      colors,
      brands,
    } = req.query;

    const skip = (page - 1) * limit;

    //  SORT
    let sortOption = {};
    if (sort === "low") sortOption.price = 1;
    if (sort === "high") sortOption.price = -1;
    if (sort === "new") sortOption.createdAt = -1;

    //  BASE FILTER
    let filter = {
      categoryId,
      price: { $gte: minPrice, $lte: maxPrice },
    };

    //  COLOR FILTER
    if (colors) {
      const colorArray = colors.split(",");
      filter.colors = { $in: colorArray };
    }

    // BRAND FILTER (IMPROVED)
    if (brands) {
      const brandArray = brands.split(",").map((b) => b.trim());

      // case-insensitive match using regex
      filter.brand = {
        $in: brandArray.map(
          (b) => new RegExp(`^${b}$`, "i") // exact match but ignore case
        ),
      };
    }

    //  FETCH PRODUCTS
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: products,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    const regex = new RegExp(`(^|\\s)${query}(\\s|$)`, "i");

    const products = await Product.find({
      $or: [
        { title: regex },
        { brand: regex },
        { description: regex },
      ],
    }).limit(20);

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};