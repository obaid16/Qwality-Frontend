"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, onQuickView }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  
  const productId = product.id || product._id;
  const isWishlisted = wishlist.some((item) => item.id === productId);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultColor = product.colors && product.colors[0];
    const defaultSize = product.sizes && product.sizes[0];
    addToCart(product, 1, defaultColor, defaultSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col h-full w-full max-w-[340px] mx-auto bg-white border border-[#C8A96A]/15 rounded-none overflow-hidden transition-all duration-700 hover:border-brand-gold/60 hover:shadow-[0_20px_45px_rgba(200,169,106,0.12)]"
    >
      {/* Luxury hover radial-glow overlay */}
      <div className="hover-glow-overlay" />

      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F2EFE9] border-b border-[#C8A96A]/15">
        <Link href={`/product/${productId}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-103"
          />
        </Link>

        {/* Tags (Premium Gold-Foil Style) */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.tags.map((tag) => {
              const isFoil = tag.toLowerCase() === "best seller" || tag.toLowerCase() === "featured";
              return (
                <span
                  key={tag}
                  className={`px-2.5 py-0.5 text-[8px] font-extrabold tracking-widest uppercase border transition-all duration-300 ${
                    isFoil
                      ? "bg-gold-gradient text-brand-navy border-brand-gold/40 shadow-[0_3px_10px_rgba(200,169,106,0.25)]"
                      : "bg-brand-navy/95 text-brand-gold border-brand-gold/20"
                  }`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-brand-navy/75 backdrop-blur-md border border-brand-gold/20 text-brand-gold hover:text-brand-white transition-all duration-300 z-15 shadow-md cursor-pointer"
          aria-label="Add to wishlist"
        >
          <FiHeart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-brand-gold text-brand-gold" : ""}`} />
        </button>

        {/* Hover Center Actions */}
        <div className="absolute inset-0 bg-brand-navy/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3.5 z-10">
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="w-10 h-10 rounded-full bg-brand-white border border-brand-gold/20 text-brand-navy hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center shadow-lg transition-all duration-350 hover:scale-110 cursor-pointer"
            title="Quick Add"
          >
            <FiShoppingBag className="w-4 h-4" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="w-10 h-10 rounded-full bg-brand-white border border-brand-gold/20 text-brand-navy hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center shadow-lg transition-all duration-350 hover:scale-110 cursor-pointer"
            title="Quick View"
          >
            <FiEye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex-grow flex flex-col justify-between bg-white">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[9px] tracking-[0.25em] text-brand-gold uppercase font-bold">
              {product.category}
            </p>
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 text-brand-gold">
                <span className="text-[10px]">★</span>
                <span className="text-[10px] text-brand-charcoal/40 font-light">{product.rating}</span>
              </div>
            )}
          </div>
          <h3 className="font-luxury text-xl text-brand-navy leading-snug group-hover:text-brand-gold transition-colors duration-500 tracking-wide mt-1.5">
            <Link href={`/product/${productId}`}>{product.name}</Link>
          </h3>
        </div>
        
        <div className="mt-2.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {product.salePrice > 0 ? (
              <>
                <span className="font-bold text-base text-brand-navy">₹{product.salePrice}</span>
                <span className="text-xs text-brand-charcoal/40 line-through font-light">₹{product.originalPrice}</span>
              </>
            ) : (
              <span className="font-semibold text-base text-brand-navy">₹{product.price}</span>
            )}
          </div>
          
          {/* Expanding color bubbles with gold outer indicator ring */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex space-x-2.5 items-center">
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  className="w-3 h-3 rounded-full border border-brand-navy/15 relative group/color cursor-help flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {/* Outer Gold ring */}
                  <span className="absolute inset-[-2px] rounded-full border border-brand-gold/0 group-hover/color:border-brand-gold/50 transition-all duration-300 pointer-events-none" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-navy text-brand-gold text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded-none opacity-0 group-hover/color:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none border border-brand-gold/20 shadow-xl">
                    {color.name}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

