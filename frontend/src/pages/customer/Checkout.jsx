import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import { assets } from "../../assets/assets";

import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState("");
  const [cart, setCart] = useState(null);

  const [formData, setFormData] = useState({
    area: "",
    city: "",
    state: "",
    pincode: "",
    mobile: ""
  });

  const fetchData = async () => {
    try {
      const [addressRes, cartRes] = await Promise.all([
        axiosInstance.get("/address/get-address").catch(() => ({ data: { data: [] } })),
        axiosInstance.get("/cart").catch(() => ({ data: null }))
      ]);

      if (addressRes?.data?.data) {
        setAddresses(addressRes.data.data);
        if (addressRes.data.data.length > 0) {
          setSelectedAddress(addressRes.data.data[0]._id);
        } else {
          setShowAddressForm(true);
        }
      }

      if (cartRes?.data?.data) {
        setCart(cartRes.data.data);
      }
    } catch (error) {
      toast.error("Error loading checkout details.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitAddress = async (e) => {
    e.preventDefault();
    if (!formData.area || !formData.city || !formData.state || !formData.pincode || !formData.mobile) {
      toast.warn("Please fill all fields for the address.");
      return;
    }

    try {
      const res = await axiosInstance.post("/address/add-address", formData);
      if (res.data.success) {
        toast.success("Address added successfully!");
        setFormData({ area: "", city: "", state: "", pincode: "", mobile: "" });
        setShowAddressForm(false);
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to add address.");
    }
  };

  const placeOrderInDB = async (paymentMethod, paymentStatus) => {
    try {
      const res = await axiosInstance.post("/order/place", {
        addressId: selectedAddress,
        paymentMethod,
        paymentStatus
      });
      if (res.data.success) {
        toast.success("Order placed successfully!");
        navigate("/profile/orders");
      }
    } catch (error) {
      toast.error("Failed to place order.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.warn("Please select a delivery address.");
      return;
    }
    if (!paymentGateway) {
      toast.warn("Please choose a payment method.");
      return;
    }

    if (paymentGateway === 'cod') {
      try {
        const res = await axiosInstance.post("/order/place-cod", {
          addressId: selectedAddress
        });

        if (res.data.success) {
          toast.success("Order placed successfully!");
          navigate("/profile/orders");
        }
      } catch (error) {
        toast.error("Failed to place order.");
      }
    } else if (paymentGateway === 'razorpay') {
      try {
        const orderRes = await axiosInstance.get("/payment/create-order");
        if (orderRes.data.success) {
          const options = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY,
            amount: orderRes.data.order.amount,
            currency: "INR",
            name: "Wear_Web",
            description: "Thanks for shopping with us!",
            image: assets.logo || "",
            order_id: orderRes.data.order.id,
            method: {
              upi: true,
              card: true,
              wallet: true
            },
            handler: async (response) => {
              try {
                const verifyRes = await axiosInstance.post("/payment/verify", {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  addressId: selectedAddress
                });

                if (verifyRes.data.success) {
                  toast.success("Order placed successfully!");
                  navigate("/profile/orders");
                }
              } catch (verifyError) {
                toast.error("Payment verification failed.");
              }
            },
            prefill: {
              name: "Current User",
              email: "test@example.com",
              contact: "9999999999"
            },
            theme: {
              color: "#000000"
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on("payment.failed", function (response) {
            toast.error("Payment failed. Please try again.");
          });
          rzp.open();
        }
      } catch (error) {
        toast.error("Failed to initiate Razorpay checkout.");
      }
    }
  };

  const totalPrice = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  if (!cart) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black uppercase">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT SECTION - ADDRESSES ONLY */}
          <div className="lg:col-span-7 flex flex-col gap-10">

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Delivery Address</h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-black underline underline-offset-4 text-sm font-semibold hover:text-gray-600 transition"
                  >
                    ADD NEW
                  </button>
                )}
              </div>

              {!showAddressForm ? (
                <div className="grid grid-cols-1 gap-4">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`relative flex flex-col p-6 rounded-xl cursor-pointer transition-all border-2 ${selectedAddress === address._id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-100 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="radio"
                          name="deliveryAddress"
                          className="w-4 h-4 text-black focus:ring-black border-gray-300"
                          checked={selectedAddress === address._id}
                          onChange={() => setSelectedAddress(address._id)}
                        />
                        <span className="font-bold text-gray-900">Address {address.area}</span>
                      </div>
                      <div className="pl-7 space-y-1 text-sm text-gray-600">
                        <p className="font-semibold text-gray-800">{address.area}</p>
                        <p>{address.city}, {address.state}</p>
                        <p>Pincode: {address.pincode}</p>
                        <p className="pt-2">Mob: <span className="font-medium text-gray-900">{address.mobile}</span></p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <form onSubmit={submitAddress} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Area / Street</label>
                      <input
                        type="text" name="area" required
                        value={formData.area} onChange={handleInputChange}
                        className="border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">City</label>
                      <input
                        type="text" name="city" required
                        value={formData.city} onChange={handleInputChange}
                        className="border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">State</label>
                      <input
                        type="text" name="state" required
                        value={formData.state} onChange={handleInputChange}
                        className="border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Pincode</label>
                      <input
                        type="text" name="pincode" required
                        value={formData.pincode} onChange={handleInputChange}
                        className="border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-2">Mobile Number</label>
                      <input
                        type="text" name="mobile" required
                        value={formData.mobile} onChange={handleInputChange}
                        className="border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-primary/90 transition">
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => setShowAddressForm(false)} className="text-gray-500 hover:text-black px-6 py-3 text-sm font-medium uppercase tracking-wide transition">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* RIGHT SECTION - PAYMENT & SUMMARY */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* PAYMENT SECTION */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-6">Choose Payment Method</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-center gap-4 px-2 border-2 rounded-xl cursor-pointer transition-all ${paymentGateway === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                  <input
                    type="radio" name="paymentGateway"
                    checked={paymentGateway === 'razorpay'}
                    onChange={() => setPaymentGateway('razorpay')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <img src={assets.razorpay_img} alt="Razorpay" className="w-32 object-contain" />
                </label>

                <label className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentGateway === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                  <input
                    type="radio" name="paymentGateway"
                    checked={paymentGateway === 'cod'}
                    onChange={() => setPaymentGateway('cod')}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="font-bold text-gray-800 tracking-wide text-sm uppercase">Pay on Delivery</span>
                </label>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold tracking-tight text-black  mb-6">Order Summary</h3>

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
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-full text-sm font-bold tracking-widest uppercase shadow-sm transition-all"
              >
                Place Order
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
