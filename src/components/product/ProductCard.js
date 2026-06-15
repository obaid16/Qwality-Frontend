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
      className="group relative flex flex-col h-full bg-white border border-[#C8A96A]/15 rounded-none overflow-hidden transition-all duration-700 hover:border-brand-gold/60 hover:shadow-[0_20px_45px_rgba(200,169,106,0.12)]"
    >
      {/* Luxury hover radial-glow overlay */}
      <div className="hover-glow-overlay" />

      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFE9] border-b border-brand-navy/5">
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

        {/* Sliding Action Panel (Luxury bar) */}
        <div className="absolute inset-x-0 bottom-0 h-11 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 flex border-t border-brand-gold/20 bg-brand-navy/95 backdrop-blur-md">
          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className="w-11 h-full flex items-center justify-center text-brand-gold hover:text-brand-white border-r border-brand-gold/15 transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <FiHeart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-brand-gold text-brand-gold" : ""}`} />
          </button>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="flex-grow h-full flex items-center justify-center gap-1.5 text-[9px] tracking-widest uppercase font-bold text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 cursor-pointer"
          >
            <FiShoppingBag className="w-3 h-3" />
            <span>Quick Add</span>
          </button>

          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="w-11 h-full flex items-center justify-center text-brand-gold hover:text-brand-white border-l border-brand-gold/15 transition-colors cursor-pointer"
            aria-label="Quick View"
          >
            <FiEye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-grow flex flex-col justify-between bg-white">
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
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {product.salePrice > 0 ? (
              <>
                <span className="font-bold text-base text-brand-navy">${product.salePrice}</span>
                <span className="text-xs text-brand-charcoal/40 line-through font-light">${product.originalPrice}</span>
              </>
            ) : (
              <span className="font-semibold text-base text-brand-navy">${product.price}</span>
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

