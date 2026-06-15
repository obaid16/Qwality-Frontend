"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiCheckCircle, FiLock, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/utils/api";

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, shipping, total, clearCart, promoCode } = useCart();
  const { user, refreshSession } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        address: user.addresses?.find(a => a.isDefault)?.street || "",
        city: user.addresses?.find(a => a.isDefault)?.city || "",
        state: user.addresses?.find(a => a.isDefault)?.state || "",
        zip: user.addresses?.find(a => a.isDefault)?.zip || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!user) {
      setErrorMsg("Please log in to complete checkout.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const orderItems = cart.map((item) => ({
      product: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      color: item.selectedColor?.name || "Default",
      size: item.selectedSize || "Adjustable",
    }));

    const shippingAddress = {
      name: `${data.firstName} ${data.lastName}`,
      street: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: "United States",
    };

    const payload = {
      items: orderItems,
      shippingAddress,
      billingAddress: shippingAddress,
      paymentMethod: paymentMethod === "card" ? "razorpay" : "cod",
    };

    if (paymentMethod === "card") {
      payload.razorpayPaymentId = "pay_mock_1234567890";
      payload.razorpaySignature = "sig_mock_signature_1234567890";
    }

    if (promoCode) {
      payload.couponCode = promoCode;
    }

    try {
      const res = await apiFetch("/orders", {
        method: "POST",
        body: payload,
      });

      if (res.success) {
        clearCart();
        await refreshSession(); // reload order list in user context
        setCheckoutComplete(true);
      } else {
        setErrorMsg(res.message || "Failed to place order.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Checkout failed. Please review details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkoutComplete) {
    return (
      <>
        <PageLoader />
        <Navbar />
        <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1] flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-brand-navy/10 rounded p-8 text-center space-y-6 shadow-xl">
            <FiCheckCircle className="w-16 h-16 text-brand-gold mx-auto" />
            <h1 className="font-luxury text-2xl font-bold tracking-widest text-brand-navy uppercase">Order Confirmed</h1>
            <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light">
              Your order has been registered in our system. A concierge email receipt and tracking code will be dispatched shortly. Thank you for choosing Qwality Caps.
            </p>
            <div className="pt-4 space-y-3">
              <Link
                href="/dashboard"
                className="w-full text-center block py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/shop"
                className="w-full text-center block py-2 text-brand-navy hover:text-brand-gold text-xs uppercase tracking-widest font-bold transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-luxury text-3xl md:text-4xl font-extrabold tracking-widest text-brand-navy border-b border-brand-navy/10 pb-6 mb-12 uppercase">
            Secure Checkout
          </h1>

          {!user ? (
            <div className="text-center py-20 bg-white border border-brand-navy/10 rounded-sm space-y-4">
              <p className="font-luxury text-lg text-brand-navy uppercase tracking-widest">Login Required</p>
              <p className="text-xs text-brand-charcoal/60">You must be logged in to place a secure order.</p>
              <Link href="/auth" className="inline-block px-8 py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all">
                Sign In or Register
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-navy/10 rounded-sm">
              <p className="font-luxury text-lg text-brand-navy uppercase tracking-widest mb-4">No Items for Checkout</p>
              <Link href="/shop" className="inline-block px-6 py-2.5 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold transition-all">
                Shop Our Collection
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Checkout Form */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Shipping Details */}
                <div className="bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6">
                  <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-widest text-sm border-b border-brand-navy/10 pb-4">
                    1. Shipping Information
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">First Name</label>
                      <input
                        type="text"
                        {...register("firstName", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.firstName && <span className="text-[10px] text-red-500 mt-1 block">First name is required</span>}
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Last Name</label>
                      <input
                        type="text"
                        {...register("lastName", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.lastName && <span className="text-[10px] text-red-500 mt-1 block">Last name is required</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 mt-1 block">Email address is required</span>}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Delivery Address</label>
                    <input
                      type="text"
                      {...register("address", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                    />
                    {errors.address && <span className="text-[10px] text-red-500 mt-1 block">Address is required</span>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">City</label>
                      <input
                        type="text"
                        {...register("city", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.city && <span className="text-[10px] text-red-500 mt-1 block">City is required</span>}
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">State / Province</label>
                      <input
                        type="text"
                        {...register("state", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.state && <span className="text-[10px] text-red-500 mt-1 block">State is required</span>}
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Postal / Zip Code</label>
                      <input
                        type="text"
                        {...register("zip", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.zip && <span className="text-[10px] text-red-500 mt-1 block">Zip is required</span>}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6">
                  <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-widest text-sm border-b border-brand-navy/10 pb-4">
                    2. Payment Details
                  </h3>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-4 border rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentMethod === "card"
                          ? "bg-brand-navy text-brand-gold border-brand-gold shadow-md"
                          : "bg-white text-brand-navy border-brand-navy/20"
                      }`}
                    >
                      <FiCreditCard /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex-1 py-4 border rounded-sm flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentMethod === "paypal"
                          ? "bg-brand-navy text-brand-gold border-brand-gold shadow-md"
                          : "bg-white text-brand-navy border-brand-navy/20"
                      }`}
                    >
                      PayPal
                    </button>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="•••• •••• •••• ••••"
                          {...register("cardNumber", { required: paymentMethod === "card" })}
                          className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                        />
                        {errors.cardNumber && <span className="text-[10px] text-red-500 mt-1 block">Card number is required</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            {...register("cardExpiry", { required: paymentMethod === "card" })}
                            className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                          />
                          {errors.cardExpiry && <span className="text-[10px] text-red-500 mt-1 block">Expiry is required</span>}
                        </div>

                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">CVC / Security Code</label>
                          <input
                            type="text"
                            placeholder="•••"
                            {...register("cardCvc", { required: paymentMethod === "card" })}
                            className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                          />
                          {errors.cardCvc && <span className="text-[10px] text-red-500 mt-1 block">CVC is required</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 border border-dashed border-brand-navy/10 bg-brand-white/20 rounded">
                      <p className="text-xs text-brand-charcoal/60">
                        You will be redirected to the secure PayPal interface to authorize payment upon clicking submit.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Checkout Summary Panel */}
              <div className="lg:col-span-4 bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6 shadow-sm">
                <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-widest text-sm border-b border-brand-navy/10 pb-4">
                  Bag Items ({cart.length})
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor?.name}-${item.selectedSize}`} className="flex justify-between items-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-brand-navy">{item.name}</p>
                        <p className="text-[10px] text-brand-charcoal/50 uppercase">
                          Qty: {item.quantity} / {item.selectedColor?.name} / {item.selectedSize}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-brand-navy">₹{Math.round(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-3 text-xs border-t border-brand-navy/10 pt-6">
                  <div className="flex justify-between text-brand-charcoal/70">
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal).toLocaleString("en-IN")}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span>-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-charcoal/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${Math.round(shipping).toLocaleString("en-IN")}`}</span>
                  </div>
                  <div className="border-t border-brand-navy/10 pt-4 flex justify-between text-sm font-extrabold text-brand-navy">
                    <span>Total Order</span>
                    <span className="text-brand-gold">₹{Math.round(total).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-500 font-semibold text-center mb-3">
                    {errorMsg}
                  </p>
                )}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand-navy text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy uppercase tracking-widest text-xs font-bold transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiLock className="w-3.5 h-3.5" /> {isSubmitting ? "Processing..." : "Place Secure Order"}
                  </button>
                  <Link
                    href="/cart"
                    className="w-full text-center block py-3 text-xs text-brand-charcoal/60 hover:text-brand-gold uppercase tracking-wider font-semibold transition-all mt-2 flex items-center justify-center gap-1"
                  >
                    <FiArrowLeft /> Return to Cart
                  </Link>
                </div>
              </div>

            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
