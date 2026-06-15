"use client";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiHeart, FiMinus, FiPlus, FiStar, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";
// Removed mockProducts to keep storefront fully database-driven
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/utils/api";
import { mapBackendProduct } from "@/utils/productMapper";

export default function ProductDetails({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { addToCart, wishlist, toggleWishlist } = useCart();
  
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [bundleProduct, setBundleProduct] = useState(null);
  const [bundleChecked, setBundleChecked] = useState(true);

  // Zoom magnifier effect state
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        let fetchedProduct = null;
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(id));
        
        if (isMongoId) {
          const res = await apiFetch(`/products/${id}`);
          if (res.success && res.data) {
            fetchedProduct = mapBackendProduct(res.data);
          }
        }

        if (!fetchedProduct) {
          setError(true);
          return;
        }

        setProduct(fetchedProduct);
        setActiveImage(fetchedProduct.images[0]);
        setSelectedColor(fetchedProduct.colors[0]);
        setSelectedSize(fetchedProduct.sizes[0]);
        
        // Fetch related products
        try {
          const relatedRes = await apiFetch("/products?limit=5");
          if (relatedRes.success && relatedRes.data && relatedRes.data.items) {
            const mappedRelated = relatedRes.data.items
              .map(mapBackendProduct)
              .filter(p => p.id !== fetchedProduct.id);
            
            setRelatedProducts(mappedRelated.slice(0, 3));
            setBundleProduct(mappedRelated.find(p => p.id !== fetchedProduct.id) || null);
          } else {
            setRelatedProducts([]);
            setBundleProduct(null);
          }
        } catch (e) {
          setRelatedProducts([]);
          setBundleProduct(null);
        }
      } catch (err) {
        console.error("Failed loading product details:", err);
        setError(true);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (error) {
    return (
      <>
        <Navbar />
        <div className="h-screen bg-[#F8F6F1] flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-luxury text-3xl text-brand-navy tracking-widest uppercase mb-4">Exquisite Item Not Found</h1>
          <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light max-w-sm mb-8">
            The particular handcrafted article of distinction you are seeking does not exist or has been removed from our catalog.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-brand-navy text-brand-gold uppercase tracking-widest text-[10px] font-bold hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 border border-brand-gold shadow-md"
          >
            Return to Boutique
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <PageLoader />
        <div className="h-screen bg-[#F8F6F1] flex items-center justify-center text-brand-navy font-luxury tracking-widest uppercase">
          Loading details...
        </div>
      </>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Handle Zoom Magnifier
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    if (bundleChecked && bundleProduct) {
      addToCart(bundleProduct, 1, bundleProduct.colors[0], bundleProduct.sizes[0]);
    }
  };

  const openQuickView = (p) => {
    setQuickViewProduct(p);
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="text-xs uppercase tracking-widest text-brand-charcoal/40 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-brand-gold transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-brand-navy font-semibold">{product.name}</span>
          </nav>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            
            {/* Gallery Zoom Visualizer */}
            <div className="lg:col-span-7 space-y-4">
              <div 
                className="relative aspect-[4/5] bg-white border border-brand-navy/10 overflow-hidden cursor-zoom-in rounded-sm"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Magnifier Glass overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none border border-brand-gold/30 rounded"
                  style={{
                    ...zoomStyle,
                    position: "absolute",
                  }}
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 border overflow-hidden rounded ${
                      activeImage === img ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-navy/10"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buying Config Form */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-brand-gold tracking-[0.25em] font-semibold">{product.category}</span>
                <h1 className="font-luxury text-3xl lg:text-4xl font-extrabold tracking-widest text-brand-navy mt-2 mb-4 leading-tight">
                  {product.name}
                </h1>

                {/* Stars and Price */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-brand-navy/10">
                  <span className="text-3xl font-extrabold text-brand-navy">₹{product.price.toLocaleString("en-IN")}</span>
                  <div className="h-4 w-[1px] bg-brand-navy/25" />
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-brand-gold text-sm">
                      {"★".repeat(Math.round(product.rating))}
                      {"☆".repeat(5 - Math.round(product.rating))}
                    </div>
                    <span className="text-xs text-brand-charcoal/60 font-light">({product.reviewCount} customer reviews)</span>
                  </div>
                </div>

                <p className="text-sm text-brand-charcoal/70 leading-relaxed font-light mb-8">
                  {product.description}
                </p>

                {/* Colors Select */}
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest font-semibold text-brand-navy">
                    Bespoke Colors: <span className="text-brand-charcoal/60 normal-case font-normal">{selectedColor?.name}</span>
                  </span>
                  <div className="flex space-x-3 mt-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center p-0.5 ${
                          selectedColor?.name === color.name 
                            ? "border-brand-gold ring-1 ring-brand-gold" 
                            : "border-brand-navy/20"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizing Select */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs uppercase tracking-widest font-semibold text-brand-navy">Sizing Fit</span>
                    <button className="text-xs text-brand-gold underline tracking-wider font-light">Size Guide</button>
                  </div>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 border text-xs tracking-wider font-bold rounded-sm transition-all ${
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

                {/* Quantity & Buy Buttons */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="flex items-center border border-brand-navy/25 h-12 w-32 rounded-sm bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors h-full"
                    >
                      <FiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-brand-navy hover:bg-brand-navy hover:text-brand-white transition-colors h-full"
                    >
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-brand-navy text-brand-gold border border-brand-gold/30 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-brand-navy hover:border-brand-gold transition-all duration-300 shadow-md"
                  >
                    <FiShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 border rounded-sm h-12 transition-colors ${
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

              {/* Guarantees */}
              <div className="bg-white border border-brand-navy/10 rounded p-4 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-brand-charcoal/80">
                <div className="flex flex-col items-center gap-1.5">
                  <FiTruck className="w-5 h-5 text-brand-gold" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FiShield className="w-5 h-5 text-brand-gold" />
                  <span>Secure Pay</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <FiRefreshCw className="w-5 h-5 text-brand-gold" />
                  <span>Easy Return</span>
                </div>
              </div>

            </div>
          </div>

          {/* Details & Reviews Tabs */}
          <div className="bg-white border border-brand-navy/10 rounded-sm mb-20">
            <div className="flex border-b border-brand-navy/10 bg-brand-white/50">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border-r border-brand-navy/10 transition-colors ${
                  activeTab === "description" ? "bg-white text-brand-gold border-b-2 border-b-brand-gold" : "text-brand-charcoal/60 hover:text-brand-navy"
                }`}
              >
                Materials & Fit
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${
                  activeTab === "reviews" ? "bg-white text-brand-gold border-b-2 border-b-brand-gold" : "text-brand-charcoal/60 hover:text-brand-navy"
                }`}
              >
                Reviews ({product.reviews.length})
              </button>
            </div>

            <div className="p-8">
              {activeTab === "description" ? (
                <div className="space-y-6">
                  <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm">Product Specifications</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-charcoal/80 font-light">
                    {product.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-8">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="pb-6 border-b border-brand-navy/10 last:pb-0 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-brand-navy">{rev.user}</span>
                        <span className="text-xs text-brand-charcoal/40 font-light">{rev.date}</span>
                      </div>
                      <div className="flex text-brand-gold text-xs mb-3">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>
                      <p className="text-sm text-brand-charcoal/80 font-light italic">&quot;{rev.comment}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Frequently Bought Together Bundle Builder */}
          <div className="bg-white border border-brand-navy/15 p-8 rounded-sm mb-20">
            <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-widest text-sm mb-6">Frequently Bought Together</h3>
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Product 1 */}
                <div className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="w-16 h-16 object-cover border border-brand-navy/10 rounded" />
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{product.name}</p>
                    <p className="text-xs text-brand-gold font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <span className="text-brand-gold font-bold text-lg">+</span>

                {/* Product 2 */}
                <div className="flex items-center gap-3">
                  <img src={bundleProduct.images[0]} alt="" className="w-16 h-16 object-cover border border-brand-navy/10 rounded" />
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{bundleProduct.name}</p>
                    <p className="text-xs text-brand-gold font-bold">₹{bundleProduct.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>

              {/* Action Checkbox */}
              <div className="flex items-center gap-6 border-t md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-between">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-brand-navy cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bundleChecked}
                      onChange={(e) => setBundleChecked(e.target.checked)}
                      className="rounded text-brand-gold focus:ring-brand-gold w-4 h-4"
                    />
                    Add Bundle Item
                  </label>
                  <p className="text-xs text-brand-charcoal/60 mt-1">Total Price: <span className="font-bold text-brand-gold">₹{(product.price + (bundleChecked ? bundleProduct.price : 0)).toLocaleString("en-IN")}</span></p>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
                >
                  Buy Both Items
                </button>
              </div>
            </div>
          </div>

          {/* Related Products Grid */}
          <div>
            <h2 className="font-luxury text-brand-navy text-2xl font-bold tracking-widest uppercase mb-8 text-center">Related Masterpieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center justify-items-center">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={openQuickView} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />

      {/* QUICK VIEW FOR SUGGESTIONS */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
