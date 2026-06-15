"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingBag, FiHeart, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");

  const [prevProduct, setPrevProduct] = useState(null);
  if (product && product.id !== prevProduct?.id) {
    setPrevProduct(product);
    setSelectedColor(product.colors[0]);
    setSelectedSize(product.sizes[0]);
    setQuantity(1);
    setActiveImage(product.images[0]);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-105 flex items-center justify-center p-4">
        {/* Background Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-brand-charcoal cursor-pointer"
        />

        {/* Modal Sheet Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-4xl bg-[#F8F6F1] shadow-2xl overflow-hidden rounded-sm z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-brand-navy hover:text-brand-gold transition-colors z-20"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Left: Product Images Gallery */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-white border-r border-brand-navy/10 overflow-y-auto">
            <div className="aspect-[4/5] w-full overflow-hidden rounded mb-4">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded border overflow-hidden ${
                    activeImage === img ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-navy/10"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details Sheet */}
          <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] text-brand-charcoal/50 uppercase font-semibold">
                {product.category}
              </span>
              <h2 className="font-luxury text-brand-navy text-2xl font-bold tracking-wider mt-2 mb-3">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-extrabold text-brand-navy">₹{product.price.toLocaleString("en-IN")}</span>
                <span className="h-4 w-[1px] bg-brand-navy/20" />
                <div className="flex items-center gap-1 text-brand-gold text-sm">
                  {"★".repeat(Math.round(product.rating))}
                  {"☆".repeat(5 - Math.round(product.rating))}
                  <span className="text-xs text-brand-charcoal/60 ml-1 font-light">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light mb-6">
                {product.description}
              </p>

              {/* Color Select */}
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-brand-navy">
                  Color: <span className="text-brand-charcoal/60 normal-case font-normal">{selectedColor?.name}</span>
                </span>
                <div className="flex space-x-3 mt-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center p-0.5 ${
                        selectedColor?.name === color.name 
                          ? "border-brand-gold ring-1 ring-brand-gold" 
                          : "border-brand-navy/25"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Select */}
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-brand-navy">
                  Size
                </span>
                <div className="flex gap-2 mt-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-xs tracking-wider font-semibold rounded-sm transition-all ${
                        selectedSize === size
                          ? "bg-brand-navy text-brand-gold border-brand-gold"
                          : "bg-white text-brand-navy border-brand-navy/20 hover:border-brand-navy"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Select */}
              <div className="mb-8">
                <span className="text-xs uppercase tracking-widest font-semibold text-brand-navy">
                  Quantity
                </span>
                <div className="flex items-center border border-brand-navy/25 w-32 mt-3 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                  >
                    <FiMinus className="w-3.5 h-3.5" />
                  </button>
                  <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-brand-navy text-brand-gold border border-brand-gold/30 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-300 shadow-md"
              >
                <FiShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 border rounded-sm transition-colors ${
                  isWishlisted 
                    ? "bg-brand-navy border-brand-gold text-brand-gold" 
                    : "bg-white border-brand-navy/20 text-brand-navy hover:border-brand-navy"
                }`}
                aria-label="Wishlist"
              >
                <FiHeart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
