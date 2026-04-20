import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateQty = async (productId, size, newQty) => {
    if (newQty < 1) return;

    try {
      await axiosInstance.put("/cart/update", {
        productId,
        size,
        quantity: newQty,
      });

      getCart();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (productId, size) => {
    try {
      await axiosInstance.delete("/cart/remove", {
        data: { productId, size },
      });

      toast.success("Item removed");
      getCart();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  if (loading) {
     return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
     );
  }

  return (
    <div className="bg-white px-4 md:px-10 lg:px-16 py-8 md:py-20 min-h-screen">
      <div className="w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-8 md:mb-12 uppercase">
          Your Bag
        </h1>

        {/*  EMPTY CART UI */}
        {cart?.items?.length === 0 || !cart ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl">
            <div className="mb-6 opacity-30">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              YOUR BAG IS EMPTY
            </h2>
            <p className="text-gray-500 mt-3 mb-8 max-w-sm">
              Discover our latest arrivals and fill your bag with something special.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors shadow-sm"
            >
              Discover Fashion
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* LEFT SIDE - CART ITEMS */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
              {cart.items.map((item, i) => (
                <div
                  key={`${item.productId?._id}-${item.size}-${i}`}
                  className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100"
                >
                  {/* IMAGE */}
                  <div className="w-full sm:w-36 h-48 bg-gray-100 rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/productdetail/${item.productId?._id}`)}>
                    <img
                      src={item.productId?.imagePaths?.[0]}
                      alt={item.productId?.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 flex flex-col pt-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h2 className="font-bold text-lg text-black uppercase tracking-tight cursor-pointer hover:underline underline-offset-2" onClick={() => navigate(`/productdetail/${item.productId?._id}`)}>
                          {item.productId?.title}
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
                          Size: {item.size}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-black">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6">
                      {/* QTY CONTROLS */}
                      <div className="flex items-center border border-gray-300 rounded-full bg-white h-10 w-28">
                        <button
                          onClick={() => updateQty(item.productId._id, item.size, item.quantity - 1)}
                          className="flex-1 flex justify-center items-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-full h-full transition-colors"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="flex-1 text-center font-semibold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId._id, item.size, item.quantity + 1)}
                          className="flex-1 flex justify-center items-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-full h-full transition-colors"
                        >
                          <FiPlus size={14}/>
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() => removeItem(item.productId._id, item.size)}
                        className="text-gray-400 hover:text-black flex items-center gap-1.5 text-sm uppercase tracking-wide font-medium transition-colors p-2"
                      >
                        <FiTrash2 size={16} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - SUMMARY */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-gray-50 rounded-2xl p-8 sticky top-24">
                <h3 className="text-lg font-bold uppercase tracking-tight text-black mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between items-center text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">₹{totalPrice}</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="flex justify-between items-center text-gray-600">
                    <span>Taxes</span>
                    <span className="font-medium text-black">Calculated at checkout</span>
                  </div>
                </div>

                <div className="h-px bg-gray-200 w-full mb-6"></div>

                <div className="flex justify-between items-center font-bold text-xl text-black mb-8">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>

                <button 
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-primary hover:bg-gray-900 text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-sm transition-all hover:shadow-md"
                >
                  Checkout
                </button>
                
                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-xs text-center text-gray-500 uppercase flex items-center justify-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                     Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
