"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiPercent } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    applyPromo, 
    subtotal, 
    discountAmount, 
    shipping, 
    total, 
    promoCode 
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState({ success: null, message: "" });

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      const res = applyPromo(promoInput);
      setPromoStatus({ success: res.success, message: res.message });
    }
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[120px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-luxury text-3xl md:text-4xl font-extrabold tracking-widest text-brand-navy border-b border-brand-navy/10 pb-6 mb-12 uppercase">
            Your Shopping Bag
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-24 bg-white border border-brand-navy/10 rounded-sm space-y-6">
              <FiShoppingBag className="w-16 h-16 text-brand-gold/40 mx-auto" />
              <h2 className="font-luxury text-xl text-brand-navy uppercase tracking-widest">Your Bag is Empty</h2>
              <p className="text-sm text-brand-charcoal/60 max-w-sm mx-auto font-light">
                Fill it with our premium handcrafted headwear and experience the pinnacle of luxury.
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-8 space-y-6">
                {cart.map((item) => (
                  <div 
                    key={`${item.id}-${item.selectedColor?.name}-${item.selectedSize}`} 
                    className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-brand-navy/10 rounded-sm items-center sm:items-stretch"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-28 h-28 object-cover border border-brand-navy/10 rounded"
                    />
                    <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                          <h3 className="font-luxury text-brand-navy font-bold tracking-wider text-base">
                            {item.name}
                          </h3>
                          <span className="font-bold text-brand-navy">${item.price * item.quantity}</span>
                        </div>
                        <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest mt-1">
                          Collection: {item.category}
                        </p>
                        <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold mt-1">
                          Color: {item.selectedColor?.name} / Size: {item.selectedSize}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-brand-navy/20 rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize, item.quantity - 1)}
                            className="px-3 py-1.5 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-4 text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize, item.quantity + 1)}
                            className="px-3 py-1.5 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Remove item */}
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedColor?.name, item.selectedSize)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        >
                          <FiTrash2 className="w-4 h-4" /> Remove Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-4 bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6 shadow-sm">
                <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-widest text-sm border-b border-brand-navy/10 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-brand-charcoal/70">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span className="flex items-center gap-1"><FiPercent /> Promo Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-charcoal/70">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-brand-navy/10 pt-4 flex justify-between text-base font-extrabold text-brand-navy">
                    <span>Total</span>
                    <span className="text-brand-gold">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="pt-4 border-t border-brand-navy/10">
                  <label htmlFor="promo" className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      type="text"
                      placeholder="e.g. GOLDEN"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-brand-white border border-brand-navy/15 px-3 py-2 rounded text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
                    >
                      Apply
                    </button>
                  </div>
                  {promoStatus.message && (
                    <p className={`text-[10px] mt-2 font-medium tracking-wide ${promoStatus.success ? "text-green-600" : "text-red-500"}`}>
                      {promoStatus.message}
                    </p>
                  )}
                  {promoCode && (
                    <p className="text-[10px] text-green-600 font-semibold mt-1">Active Code: {promoCode.toUpperCase()}</p>
                  )}
                </form>

                <div className="pt-4 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full text-center block py-4 bg-brand-navy text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy uppercase tracking-widest text-xs font-bold transition-all duration-300 shadow-md"
                  >
                    Proceed to Checkout <FiArrowRight className="inline ml-1" />
                  </Link>
                  <Link
                    href="/shop"
                    className="w-full text-center block py-3 text-brand-navy hover:text-brand-gold text-xs uppercase tracking-widest font-bold transition-all"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
