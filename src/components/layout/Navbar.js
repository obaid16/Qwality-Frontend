"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, 
  FiTrash2, FiPlus, FiMinus, FiArrowRight, FiChevronDown, FiLogOut 
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist, removeFromCart, updateQuantity, total, toggleWishlist } = useCart();
  const { user, logout } = useAuth();
  
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when any drawer or overlay is open
  useEffect(() => {
    const shouldLock = isMobileMenuOpen || isCartOpen || isWishlistOpen || isSearchOpen;
    if (shouldLock) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isCartOpen, isWishlistOpen, isSearchOpen]);

  // On non-home pages, always show dark navbar (white text won't be invisible)
  const isDark = !isHomePage || isScrolled;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Boutique", path: "/shop", hasDropdown: true },
    { name: "Our Heritage", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const megaMenuCollections = [
    {
      name: "The Classic Line",
      desc: "Structured wool & cashmere snapbacks",
      path: "/shop?category=Classic",
      img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Monarch Suede",
      desc: "Italian calfskin unstructured straps",
      path: "/shop?category=Suede",
      img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Imperial Cashmere",
      desc: "Pure Grade-A Himalayan knits",
      path: "/shop?category=Cashmere",
      img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=300"
    }
  ];

  return (
    <>


      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isDark
            ? "glass-effect py-4 shadow-xl" 
            : "bg-transparent py-7"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          {/* Logo - Rolex/Apple aesthetic */}
          <Link href="/" className="flex flex-col items-start select-none group">
            <span className="font-luxury text-2xl lg:text-3xl font-extrabold tracking-[0.25em] text-brand-white group-hover:text-brand-gold transition-colors duration-500">
              QWALITY
            </span>
            <span className="text-[9px] tracking-[0.45em] text-brand-gold uppercase -mt-1 pl-[2px] font-bold">
              Caps & Co.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav 
            className="hidden md:flex items-center space-x-12"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <div 
                  key={link.path}
                  className="relative group"
                  onMouseEnter={() => setHoveredLink(link.name)}
                >
                  <Link
                    href={link.path}
                    className="flex items-center gap-1 text-[11px] font-bold tracking-regal uppercase text-brand-white hover:text-brand-gold transition-colors duration-300 py-2"
                  >
                    {link.name}
                    {link.hasDropdown && <FiChevronDown className="w-3 h-3 text-brand-gold/80" />}
                  </Link>

                  {/* Underline trace */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold transform transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />

                  {/* Mega Menu Dropdown */}
                  {link.hasDropdown && hoveredLink === "Boutique" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-[560px] z-50 pointer-events-auto"
                    >
                      <div className="bg-brand-navy border border-brand-gold/25 p-6 rounded-sm shadow-2xl grid grid-cols-3 gap-4">
                        {megaMenuCollections.map((col) => (
                          <Link 
                            key={col.name} 
                            href={col.path}
                            className="group/item flex flex-col space-y-3 cursor-pointer"
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden border border-brand-gold/10">
                              <img 
                                src={col.img} 
                                alt={col.name} 
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" 
                              />
                            </div>
                            <div>
                              <h5 className="font-luxury text-brand-gold text-xs font-bold uppercase tracking-wider group-hover/item:text-brand-white transition-colors">
                                {col.name}
                              </h5>
                              <p className="text-[10px] text-brand-white/60 font-light leading-snug mt-1">
                                {col.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-7">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-brand-white hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Search"
            >
              <FiSearch className="w-4.5 h-4.5" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative text-brand-white hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Wishlist"
            >
              <FiHeart className="w-4.5 h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-navy text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-brand-white hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Cart"
            >
              <FiShoppingBag className="w-4.5 h-4.5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-gold text-brand-navy text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Dashboard Profile */}
            <div 
              className="relative hidden sm:block"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <Link
                href={user?.role === "admin" ? "/admin" : "/dashboard"}
                className="text-brand-white hover:text-brand-gold transition-colors duration-300 flex items-center py-2 cursor-pointer"
                aria-label="Dashboard"
              >
                <FiUser className="w-4.5 h-4.5" />
              </Link>
              <AnimatePresence>
                {user && isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full pt-2 w-52 z-50 pointer-events-auto"
                  >
                    <div className="bg-brand-navy border border-brand-gold/25 rounded-sm shadow-2xl overflow-hidden backdrop-blur-md">
                      <div className="bg-brand-navy/90 px-4 py-3 border-b border-brand-gold/15">
                        <p className="text-[10px] text-brand-gold/80 font-light uppercase tracking-widest">Logged In As</p>
                        <p className="text-xs text-brand-white font-bold truncate mt-0.5">{user.name}</p>
                        <p className="text-[9px] text-brand-white/40 truncate font-light mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-1.5 bg-brand-navy/95 space-y-0.5">
                        <Link
                          href={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 text-[10px] text-brand-white/80 hover:text-brand-navy hover:bg-brand-gold px-3 py-2.5 rounded-sm transition-all duration-300 uppercase tracking-widest font-bold"
                        >
                          <FiUser className="w-3.5 h-3.5" />
                          {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 text-[10px] text-red-400 hover:text-white hover:bg-red-950/40 px-3 py-2.5 rounded-sm transition-all duration-300 uppercase tracking-widest font-bold text-left cursor-pointer"
                        >
                          <FiLogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-brand-white hover:text-brand-gold transition-colors duration-300 cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5.5 h-5.5" /> : <FiMenu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Slide-out Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[76px] left-0 w-full bg-brand-navy/95 backdrop-blur-xl border-b border-brand-gold/20 z-40 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-brand-white hover:text-brand-gold transition-colors duration-300 py-3 border-b border-brand-gold/10"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href={user?.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-bold uppercase tracking-widest text-brand-white hover:text-brand-gold transition-colors duration-300 py-3 border-b border-brand-gold/10 flex items-center gap-2"
              >
                <FiUser /> {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-brand-charcoal z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F8F6F1] shadow-2xl z-55 flex flex-col border-l border-brand-gold/10"
            >
              <div className="p-6 border-b border-brand-gold/15 flex justify-between items-center bg-brand-navy text-brand-white">
                <h3 className="font-luxury text-md tracking-[0.2em] uppercase flex items-center gap-2">
                  <FiShoppingBag className="text-brand-gold" /> Shopping Bag ({totalItems})
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-brand-white hover:text-brand-gold transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator for Free Shipping */}
              {totalItems > 0 && (
                <div className="bg-brand-white border-b border-brand-gold/10 px-6 py-3.5 text-[10px] uppercase tracking-wider text-brand-navy flex justify-between items-center">
                  {total >= 12450 ? (
                    <span className="font-semibold text-green-700">Congratulations! Free Shipping Applied.</span>
                  ) : (
                    <span>Add <strong className="text-brand-gold">₹{Math.round(12450 - total).toLocaleString("en-IN")}</strong> more for free worldwide delivery</span>
                  )}
                  <div className="w-24 bg-brand-navy/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-gold h-full transition-all duration-500" 
                      style={{ width: `${Math.min((total / 12450) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                    <FiShoppingBag className="w-12 h-12 text-brand-gold/30" />
                    <p className="font-luxury text-brand-navy text-lg uppercase tracking-wider">Your Bag is Empty</p>
                    <p className="text-xs text-brand-charcoal/50 leading-relaxed font-light max-w-xs">
                      Acquire from our curated collections of custom monograms and luxury materials.
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-block px-8 py-3.5 bg-brand-navy text-brand-gold uppercase tracking-widest text-[10px] font-bold hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 border border-brand-gold shadow-md"
                    >
                      Explore Boutique
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor?.name}-${item.selectedSize}`} className="flex gap-5 pb-6 border-b border-brand-navy/5">
                      <div className="w-20 h-20 overflow-hidden bg-brand-white border border-brand-navy/10">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-luxury text-brand-navy text-xs font-bold uppercase tracking-wider leading-snug">{item.name}</h4>
                            <span className="text-xs font-bold text-brand-navy">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-[9px] text-brand-charcoal/50 mt-1 uppercase tracking-widest">
                            {item.selectedColor?.name} / {item.selectedSize}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center border border-brand-navy/20 rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize, item.quantity - 1)}
                              className="px-2.5 py-1 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                            >
                              <FiMinus className="w-2.5 h-2.5" />
                            </button>
                            <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.selectedColor?.name, item.selectedSize, item.quantity + 1)}
                              className="px-2.5 py-1 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors"
                            >
                              <FiPlus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.selectedColor?.name, item.selectedSize)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-gold/15 bg-brand-navy text-brand-white">
                  <div className="flex justify-between mb-4">
                    <span className="text-xs uppercase tracking-widest text-brand-white/80">Total Value</span>
                    <span className="font-bold text-lg text-brand-gold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[10px] text-brand-white/50 mb-6 uppercase tracking-wider">Duties included. VAT added on next step.</p>
                  <div className="space-y-3">
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full text-center block py-3.5 border border-brand-white hover:border-brand-gold text-brand-white hover:text-brand-gold font-bold uppercase tracking-widest text-[10px] transition-all duration-500"
                    >
                      View Shopping Bag
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full text-center block py-3.5 bg-brand-gold text-brand-navy hover:bg-brand-white hover:text-brand-navy font-bold uppercase tracking-widest text-[10px] transition-all duration-500 shadow-lg"
                    >
                      Secure Checkout
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 bg-brand-charcoal z-50 cursor-pointer"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#F8F6F1] shadow-2xl z-55 flex flex-col border-l border-brand-gold/10"
            >
              <div className="p-6 border-b border-brand-gold/15 flex justify-between items-center bg-brand-navy text-brand-white">
                <h3 className="font-luxury text-md tracking-[0.2em] uppercase flex items-center gap-2">
                  <FiHeart className="text-brand-gold" /> Wishlist ({wishlist.length})
                </h3>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-brand-white hover:text-brand-gold transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                    <FiHeart className="w-12 h-12 text-brand-gold/30" />
                    <p className="font-luxury text-brand-navy text-lg uppercase tracking-wider">Wishlist is Empty</p>
                    <p className="text-xs text-brand-charcoal/50 leading-relaxed font-light max-w-xs">
                      Build your dream collection. Keep caps of visual distinction in private registry bookmarks.
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setIsWishlistOpen(false)}
                      className="inline-block px-8 py-3.5 bg-brand-navy text-brand-gold uppercase tracking-widest text-[10px] font-bold hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 border border-brand-gold shadow-md"
                    >
                      Browse Shop
                    </Link>
                  </div>
                ) : (
                  wishlist.map((item) => (
                    <div key={item.id} className="flex gap-5 pb-6 border-b border-brand-navy/5">
                      <div className="w-20 h-20 overflow-hidden bg-brand-white border border-brand-navy/10">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-luxury text-brand-navy text-xs font-bold uppercase tracking-wider leading-snug">{item.name}</h4>
                            <span className="text-xs font-bold text-brand-navy">₹{item.price.toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-[9px] text-brand-charcoal/50 mt-1 uppercase tracking-widest">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <Link
                            href={`/product/${item.id}`}
                            onClick={() => setIsWishlistOpen(false)}
                            className="text-[10px] text-brand-gold hover:text-brand-navy transition-colors font-bold uppercase tracking-widest flex items-center gap-1"
                          >
                            View details <FiArrowRight />
                          </Link>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search Overlay - Apple Style */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-navy/98 z-55 flex flex-col justify-center items-center px-6 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 text-brand-white hover:text-brand-gold transition-colors"
            >
              <FiX className="w-8 h-8" />
            </button>
            <div className="w-full max-w-2xl text-center space-y-10">
              <h2 className="font-luxury text-brand-gold text-2xl lg:text-3xl tracking-regal uppercase">
                Search Boutique
              </h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="relative border-b-2 border-brand-gold/40 focus-within:border-brand-gold py-3"
              >
                <input
                  type="text"
                  placeholder="Enter keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 text-brand-white placeholder-brand-white/20 text-xl lg:text-4xl text-center focus:ring-0 uppercase tracking-widest font-luxury"
                  autoFocus
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-white transition-colors">
                  <FiSearch className="w-7 h-7" />
                </button>
              </form>
              <p className="text-[10px] text-brand-white/40 tracking-regal uppercase">
                Trending: &quot;Snapback&quot;, &quot;Suede&quot;, &quot;Cashmere&quot;, &quot;Navy&quot;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
