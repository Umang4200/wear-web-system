import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import { useEffect } from "react";

function UpdateProduct({ productId }) {
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [product, setProduct] = useState(null);
  const [removeImages, setRemoveImages] = useState([]);
  
const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const validateSchema = {
    titleValidator: {
      required: {
        value: true,
        message: "Product title is required",
      },
      minLength: {
        value: 3,
        message: "Title must be at least 3 characters",
      },
    },

    descriptionValidator: {
      required: {
        value: true,
        message: "Description is required",
      },
      minLength: {
        value: 10,
        message: "Description must be at least 10 characters",
      },
    },

    priceValidator: {
      required: {
        value: true,
        message: "Price is required",
      },
      min: {
        value: 1,
        message: "Price must be greater than 0",
      },
    },

    quantityValidator: {
      required: {
        value: true,
        message: "Quantity is required",
      },
      min: {
        value: 1,
        message: "Quantity must be at least 1",
      },
    },

    colorsValidator: {
      required: {
        value: true,
        message: "Colors are required",
      },
    },

    skuValidator: {
      required: {
        value: true,
        message: "SKU is required",
      },
      minLength: {
        value: 3,
        message: "SKU must be at least 3 characters",
      },
    },

    sizeValidator: {
      required: {
        value: true,
        message: "Select at least one size",
      },
    },
  };

  const getProductById = async () => {
    try {
      const response = await axiosInstance.get(`/product/product-by-id/${id}`);

      console.log("API:", response.data);

      setProduct(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching product");
    }
  };

  useEffect(() => {
    if (id) {
      getProductById();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("quantity", product.quantity);
      setValue("colors", product.colors.join(","));
      setValue("sku", product.sku);
      setValue("size", product.size);

      // ✅ show existing images
      setPreview(product.imagePaths);
    }
  }, [product]);

  const handleRemoveImage = (img, index) => {
    // remove from preview
    setPreview((prev) => prev.filter((_, i) => i !== index));

    // check if it's old image (URL)
    if (typeof img === "string") {
      setRemoveImages((prev) => [...prev, img]);
    } else {
      // new image → remove from images array
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + preview.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    // Append new files
    setImages((prev) => [...prev, ...files]);

    // Generate preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setPreview((prev) => [...prev, ...previewUrls]);
  };

  const submitHandler = async (data) => {
    try {
      const formData = new FormData();

      // ✅ convert colors string → array
      data.colors = data.colors.split(",").map((c) => c.trim());

      // ✅ append normal fields
      for (let key in data) {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      }

      // ✅ append new images
      images.forEach((img) => {
        formData.append("images", img);
      });

      // ✅ send removed images
      formData.append("removeImages", JSON.stringify(removeImages));

      const response = await axiosInstance.put(
        `/product/update-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-2 py-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-8 md:p-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          Update Product
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* images */}
          <div className="w-full flex gap-3">
            {/* Upload Box */}
            <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition">
              <span className="text-gray-400 text-2xl">
                <MdOutlineAddPhotoAlternate />
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Preview Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {preview.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img, index)}
                    className="absolute top-1 right-1 bg-primary text-white text-xs px-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TITLE */}
          <div>
            <input
              type="text"
              placeholder="Product Title"
              {...register("title", validateSchema.titleValidator)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <input
              type="text"
              placeholder="Product Description"
              {...register("description", validateSchema.descriptionValidator)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* PRICE + QUANTITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="number"
                placeholder="Price"
                {...register("price", validateSchema.priceValidator)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                placeholder="Quantity"
                {...register("quantity", validateSchema.quantityValidator)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* SIZES */}

          <div>
            <div className="flex flex-wrap gap-4">
              {sizes.map((size, index) => (
                <label
                  key={index}
                  className="inline-flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={size}
                    {...register("size", validateSchema.sizeValidator)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>

            {errors.size && (
              <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>
            )}
          </div>

          {/* COLORS */}

          <div>
            <input
              type="text"
              placeholder="Colors (comma separated)"
              {...register("colors", validateSchema.colorsValidator)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            {errors.colors && (
              <p className="text-red-500 text-sm mt-1">
                {errors.colors.message}
              </p>
            )}
          </div>

          {/* SKU */}

          <div>
            <input
              type="text"
              placeholder="SKU"
              {...register("sku", validateSchema.skuValidator)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            {errors.sku && (
              <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
            )}
          </div>

          {/* SUBMIT BUTTON */}

          <div className="text-center mt-6">
            <button
            onClick={()=> {navigate("/seller/products")}}
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProduct;
