"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  FaFacebookF, FaInstagram, FaTwitter, FaPinterestP, 
  FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal 
} from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-charcoal text-brand-white border-t border-brand-gold/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-brand-white/5">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex flex-col items-start select-none group">
            <span className="font-luxury text-2xl font-light tracking-[0.25em] text-brand-white group-hover:text-brand-gold transition-colors duration-500">
              QWALITY
            </span>
            <span className="text-[9px] tracking-[0.45em] text-brand-gold uppercase -mt-0.5 pl-[2px] transition-colors duration-500">
              Caps & Co.
            </span>
          </Link>
          <p className="text-xs text-brand-white/55 leading-relaxed font-light">
            Crafting the world&apos;s most premium, custom-embellished headwear. From the finest materials to bespoke monograms, our caps represent the pinnacle of quality and sophistication.
          </p>
          <div className="flex space-x-3 pt-2">
            <a href="#" className="w-8.5 h-8.5 border border-brand-white/10 rounded-full flex items-center justify-center text-brand-white/60 hover:border-brand-gold hover:text-brand-gold transition-all duration-300" aria-label="Facebook">
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8.5 h-8.5 border border-brand-white/10 rounded-full flex items-center justify-center text-brand-white/60 hover:border-brand-gold hover:text-brand-gold transition-all duration-300" aria-label="Instagram">
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8.5 h-8.5 border border-brand-white/10 rounded-full flex items-center justify-center text-brand-white/60 hover:border-brand-gold hover:text-brand-gold transition-all duration-300" aria-label="Twitter">
              <FaTwitter className="w-3.5 h-3.5" />
            </a>
            <a href="#" className="w-8.5 h-8.5 border border-brand-white/10 rounded-full flex items-center justify-center text-brand-white/60 hover:border-brand-gold hover:text-brand-gold transition-all duration-300" aria-label="Pinterest">
              <FaPinterestP className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-6">
          <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-gold font-bold">
            Collections
          </h4>
          <ul className="space-y-3.5 text-xs text-brand-white/55 font-light">
            <li>
              <Link href="/shop?category=Classic" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                The Classic Line
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Suede" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Monarch Suede Collection
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Cashmere" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Imperial Cashmere Knits
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Custom" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Bespoke Monograms
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-6">
          <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-gold font-bold">
            Boutique Services
          </h4>
          <ul className="space-y-3.5 text-xs text-brand-white/55 font-light">
            <li>
              <Link href="/about" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Our Heritage Story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Consult an Artisan
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Privacy & Discretion
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-brand-gold hover:pl-0.5 transition-all duration-300">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-6">
          <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-brand-gold font-bold">
            Bespoke Updates
          </h4>
          <p className="text-xs text-brand-white/55 leading-relaxed font-light">
            Subscribe to receive exclusive access to private vault openings, seasonal releases, and personalized embroidery drops.
          </p>
          {subscribed ? (
            <p className="text-xs text-brand-gold font-bold tracking-wider pt-2">
              Thank you. You have been added to our Registry.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-brand-gold/20 px-4 py-3.5 text-brand-white placeholder-brand-white/30 text-xs rounded-none focus:border-brand-gold focus:ring-0"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-gold text-brand-navy uppercase tracking-widest text-[9px] font-bold hover:bg-brand-white hover:text-brand-navy transition-all duration-500 cursor-pointer shadow-md"
              >
                Join Registry
              </button>
            </form>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] tracking-widest uppercase text-brand-white/30 font-light">
        <p>&copy; {new Date().getFullYear()} Quality Caps & Co. All Rights Reserved. Crafted with absolute discretion.</p>
        <div className="flex space-x-4 text-xl text-brand-white/20">
          <FaCcVisa className="hover:text-brand-white hover:opacity-60 transition-opacity" />
          <FaCcMastercard className="hover:text-brand-white hover:opacity-60 transition-opacity" />
          <FaCcAmex className="hover:text-brand-white hover:opacity-60 transition-opacity" />
          <FaCcPaypal className="hover:text-brand-white hover:opacity-60 transition-opacity" />
        </div>
      </div>
    </footer>
  );
}

