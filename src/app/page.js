"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiEdit2, FiInstagram } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";
// Removed mockProducts to keep storefront fully database-driven
import { apiFetch } from "@/utils/api";
import { mapBackendProduct } from "@/utils/productMapper";


const testimonials = [
  {
    quote: "Qwality Caps has redefined luxury casualwear. The cashmere series fits like a glove and feels as soft as silk. It is the Rolex of headwear.",
    author: "Marquess Arthur Penhaligon",
    location: "London",
    yOffset: "md:translate-y-0"
  },
  {
    quote: "Bespoke service at its finest. The custom gold monogram embroidery is absolutely flawless, crafted with total discretion.",
    author: "Lady Genevieve",
    location: "St. Moritz",
    yOffset: "md:translate-y-8"
  },
  {
    quote: "Unparalleled structural profile. The raw Italian calfskin suede unboxing experience feels like receiving a Swiss masterpiece.",
    author: "Sir Alistair Vance",
    location: "Milan",
    yOffset: "md:translate-y-4"
  }
];

// Motion Stagger Animation Settings
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/products?limit=12");
        if (res.success && res.data && res.data.items) {
          const mapped = res.data.items.map(mapBackendProduct);
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load products from API:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const bestSellers = products.filter((p) => p.tags.includes("Best Seller") || p.isFeatured).slice(0, 3);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 3);

  const categories = [
    { name: "The Classic Line", desc: "Timeless silhouettes in wool & cashmere", path: "/shop?category=Classic", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800" },
    { name: "Monarch Suede", desc: "Ultra-soft Italian calfskin suede", path: "/shop?category=Suede", img: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&q=80&w=800" },
    { name: "Imperial Knits", desc: "Mongolian cashmere and fine merino", path: "/shop?category=Cashmere", img: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-0 overflow-hidden bg-brand-white relative">
        {/* Fixed vertical background architectural grid lines */}
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl luxury-grid-lines pointer-events-none z-0 opacity-40" />

        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-navy z-10">
          {/* Animated Background Zoom */}
          <motion.div 
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.45 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src="https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1920"
              alt="Luxury Headwear Banner"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Linear luxury dark overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-brand-navy/60 z-0" />
          <div className="absolute inset-0 bg-black/15 z-0" />

          {/* Staggered text reveal container */}
          <motion.div 
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-5xl mx-auto text-center px-6 text-brand-white flex flex-col items-center"
          >
            <motion.p
              variants={heroItemVariants}
              className="text-[10px] sm:text-xs uppercase text-brand-gold tracking-[0.45em] font-bold mb-5"
            >
              Exquisite Craftsmanship
            </motion.p>
            
            <motion.h1
              variants={heroItemVariants}
              className="font-luxury text-5xl sm:text-7xl lg:text-[92px] font-light tracking-[0.06em] leading-[1.03] text-brand-white mb-8"
            >
              CRAFTED FOR THE <br />
              <span className="italic text-brand-gold font-normal">Distinguished</span>
            </motion.h1>
            
            <motion.p
              variants={heroItemVariants}
              className="text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed text-brand-white/70 mb-12 tracking-wide"
            >
              Every cap is a custom statement. Hand-assembled with Grade-A cashmere, Italian suede, and signature gold bullion embroidery. Made with uncompromising standards.
            </motion.p>

            <motion.div
              variants={heroItemVariants}
              className="flex flex-col sm:flex-row justify-center items-center gap-5 w-full sm:w-auto"
            >
              <Link
                href="/shop"
                className="w-full sm:w-auto px-11 py-4.5 bg-brand-gold text-brand-navy font-bold text-xs uppercase tracking-widest border border-brand-gold hover:bg-transparent hover:text-brand-white transition-all duration-500 ease-out shadow-[0_10px_30px_rgba(200,169,106,0.2)]"
              >
                Explore Collection
              </Link>
              <Link
                href="/shop?category=Custom"
                className="w-full sm:w-auto px-11 py-4.5 border border-brand-white/20 text-brand-white font-bold text-xs uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold hover:bg-white/5 transition-all duration-500 ease-out backdrop-blur-sm"
              >
                Bespoke Design
              </Link>
            </motion.div>
          </motion.div>

          {/* Luxury watch Tourbillon/Pendulum scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 select-none">
            <span className="text-[8px] uppercase tracking-[0.35em] text-brand-white/35 mb-3.5 font-bold">Atelier Entrance</span>
            <div className="w-5 h-8 rounded-full border border-brand-gold/30 flex justify-center p-1 bg-brand-navy/60 backdrop-blur-sm shadow-lg">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="w-1 h-1.5 rounded-full bg-brand-gold"
              />
            </div>
            <div className="w-[1px] h-10 bg-gradient-to-b from-brand-gold/30 to-transparent mt-2 animate-pulse" />
          </div>
        </section>

        {/* BRAND STATEMENT BANNER */}
        <section className="bg-brand-white border-y border-brand-gold/15 py-10 overflow-hidden select-none z-10 relative">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-20 text-center font-luxury tracking-[0.25em] text-[10px] md:text-xs font-bold uppercase text-brand-navy/60">
            <span>• Italian calfskin suede</span>
            <span>• Grade-A Cashmere</span>
            <span>• Hand-embroidered in Gold</span>
            <span>• Made to Order</span>
          </div>
        </section>

        {/* CATEGORIES SECTION (Staggered Magazine-style Layout) */}
        <section className="py-36 px-6 max-w-7xl mx-auto z-10 relative">
          <div className="text-center max-w-xl mx-auto mb-24 space-y-3">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Exquisite Lines</span>
            <h2 className="font-luxury text-4xl sm:text-5xl font-light tracking-widest text-brand-navy">
              SHOP BY COLLECTION
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto my-4" />
            <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light">
              Explore silhouettes structured specifically for elegant wardrobes.
            </p>
          </div>

          {/* Staggered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pb-16">
            {categories.map((cat, index) => {
              // Asymmetric staggered column offsets
              const yOffset = index === 0 ? "md:translate-y-0" : index === 1 ? "md:translate-y-16" : "md:translate-y-8";
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 55 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--x", `${x}px`);
                    e.currentTarget.style.setProperty("--y", `${y}px`);
                  }}
                  className={`group relative h-[500px] overflow-hidden rounded-none border border-brand-navy/5 shadow-md cursor-pointer ${yOffset}`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/35 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />
                  <div className="hover-glow-overlay" />
                  
                  {/* Subtle inner gold frame indicator */}
                  <div className="absolute inset-4 border border-brand-gold/20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none scale-95 group-hover:scale-100" />

                  <div className="absolute bottom-8 left-8 right-8 text-brand-white space-y-3 z-10">
                    <span className="px-2 py-0.5 bg-brand-gold text-brand-navy text-[8px] font-extrabold tracking-widest uppercase inline-block border border-brand-white/10 shadow-sm">
                      Boutique Edition
                    </span>
                    <h3 className="font-luxury text-2xl font-light tracking-wider">{cat.name}</h3>
                    <p className="text-xs text-brand-white/75 font-light leading-relaxed">{cat.desc}</p>
                    <div className="pt-2">
                      <Link
                        href={cat.path}
                        className="inline-flex items-center gap-2 text-[9px] text-brand-gold uppercase tracking-widest font-bold border-b border-brand-gold/0 group-hover:border-brand-gold/60 pb-0.5 transition-all duration-300"
                      >
                        <span>Explore Collection</span>
                        <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>



        {/* THE ART OF ATELIER (CORE VALUES) */}
        <section className="py-24 bg-white border-y border-brand-navy/5 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Complimentary Delivery",
                desc: "Fully tracked priority worldwide dispatch on all orders exceeding $150.",
              },
              {
                title: "Bespoke Monograms",
                desc: "Personalize with custom hand-embroidery, tailored by our design team.",
              },
              {
                title: "Exquisite Materials",
                desc: "Grade-A Mongolian Cashmere, Italian calfskin, and premium organic wools.",
              },
              {
                title: "Signature Packaging",
                desc: "Every order is packaged in a silk-lined box with a certificate of authenticity.",
              }
            ].map((val, idx) => (
              <div 
                key={val.title}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--x", `${x}px`);
                  e.currentTarget.style.setProperty("--y", `${y}px`);
                }}
                className="group relative border border-brand-navy/5 p-8 flex flex-col justify-between h-56 bg-brand-white/20 hover:border-brand-gold/40 transition-all duration-500 overflow-hidden cursor-default"
              >
                <div className="hover-glow-overlay" />
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
                    <FiCheckCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-luxury text-lg text-brand-navy uppercase tracking-wider mb-2">{val.title}</h4>
                  <p className="text-[11px] text-brand-charcoal/60 leading-relaxed font-light">{val.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* BEST SELLERS (THE EXQUISITE VAULT) */}
        <section className="py-36 px-6 max-w-7xl mx-auto z-10 relative">
          <div className="text-center max-w-xl mx-auto mb-24 space-y-3">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Exquisite Selection</span>
            <h2 className="font-luxury text-4xl font-light tracking-widest text-brand-navy">
              THE EXQUISITE VAULT
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto my-4" />
            <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light">
              Highly demanded headwear currently circulating the elite community.
            </p>
          </div>

          {displayProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-brand-navy/10 rounded-sm space-y-4">
              <p className="font-luxury text-lg text-brand-navy uppercase tracking-widest">Atelier Catalog Empty</p>
              <p className="text-xs text-brand-charcoal/60">No products found in the catalog. Add products in the admin panel to view them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} onQuickView={openQuickView} />
              ))}
            </div>
          )}
        </section>

        {/* BRAND STORY SECTION (ARTISAN HERITAGE) */}
        <section className="py-36 bg-[#F5F2EB] border-t border-brand-gold/10 overflow-hidden z-10 relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Layered dual picture composition */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full pr-12 pb-12"
            >
              {/* Primary Image */}
              <div className="aspect-[4/3] w-full overflow-hidden border border-brand-navy/5 shadow-lg group relative">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800"
                  alt="Cap Hand-sewing Artisan"
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 border border-brand-gold/15 m-4 pointer-events-none" />
                <div className="absolute inset-0 bg-[#0F2744]/5 pointer-events-none" />
              </div>
              
              {/* Secondary Overlapping Image representing cashmere materials */}
              <div className="absolute bottom-0 right-0 w-36 sm:w-48 aspect-square overflow-hidden border-2 border-brand-white bg-brand-white shadow-2xl z-20">
                <img
                  src="https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=400"
                  alt="Raw organic thread weaves close-up"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-navy/5 pointer-events-none" />
              </div>
            </motion.div>
            
            <div className="space-y-7 max-w-xl">
              <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold block">Our Heritage</span>
              <h2 className="font-luxury text-4xl sm:text-5xl font-light tracking-wide text-brand-navy leading-tight">
                HANDCRAFTED <br />
                <span className="italic font-normal">Excellence</span>
              </h2>
              <div className="w-12 h-[1px] bg-brand-gold/60 my-4" />
              
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light first-letter:text-4xl first-letter:font-luxury first-letter:float-left first-letter:mr-2.5 first-letter:text-brand-gold first-letter:font-bold">
                Since our inception, Qwality Caps has stood as a hallmark of luxury headwear. Nestled in historical design traditions, every single piece is cut, aligned, and monogrammed by hands that have curated royalty fashion portfolios.
              </p>
              <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
                We believe in conscious excellence. Using certified merino wools, sustainable linings, and solid gold thread embroideries, we present style that outlives seasons.
              </p>
              
              {/* Handwritten script signature graphic */}
              <div className="pt-6 flex items-center gap-4 select-none">
                <div className="h-[1px] w-8 bg-brand-gold/40" />
                <span className="font-signature text-brand-gold text-4xl leading-none tracking-normal">
                  Arthur Penhaligon
                </span>
                <span className="text-[8px] uppercase tracking-widest text-brand-charcoal/40 font-bold -ml-1">
                  — Head Seamstress
                </span>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 text-[10px] text-brand-navy font-bold uppercase tracking-widest hover:text-brand-gold transition-colors duration-300"
                >
                  <span>Read Our Heritage Story</span>
                  <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS (CONNOISSEURS CAROUSEL / CARD STAGGER GRID) */}
        <section className="py-36 bg-brand-navy text-brand-white relative overflow-hidden border-y border-brand-gold/15 z-10">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl luxury-grid-lines-dark pointer-events-none z-0 opacity-15" />
          
          {/* Luxury Large Quote Mark in background */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 font-luxury text-[240px] text-brand-gold/[0.03] pointer-events-none select-none">
            “
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center space-y-3 mb-20">
              <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold block">Elite Reviews</span>
              <h2 className="font-luxury text-3xl md:text-4xl font-light tracking-widest uppercase">
                WHAT CONNOISSEURS SAY
              </h2>
              <div className="h-[1px] w-14 bg-brand-gold mx-auto" />
            </div>
            
            {/* Staggered Testimony Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:pb-12">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 45 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--x", `${x}px`);
                    e.currentTarget.style.setProperty("--y", `${y}px`);
                  }}
                  className={`bg-brand-charcoal/30 backdrop-blur-md border border-brand-gold/15 p-8 flex flex-col justify-between h-80 shadow-2xl relative ${t.yOffset} group overflow-hidden`}
                >
                  <div className="hover-glow-overlay" />
                  
                  {/* Gold-foil corner accent line */}
                  <div className="absolute top-0 right-0 w-8 h-[1px] bg-brand-gold/40" />
                  <div className="absolute top-0 right-0 w-[1px] h-8 bg-brand-gold/40" />

                  <p className="font-luxury text-[16px] sm:text-[17px] font-light italic leading-relaxed text-brand-white/90 relative z-10">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="relative z-10">
                    <div className="h-[1px] w-8 bg-brand-gold/30 mb-4" />
                    <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                      {t.author}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-white/40 font-light mt-0.5">
                      {t.location}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* INSTAGRAM GALLERY (SOCIAL REGISTRY) */}
        <section className="py-36 max-w-7xl mx-auto px-6 z-10 relative">
          <div className="text-center max-w-xl mx-auto mb-24 space-y-3">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Social Registry</span>
            <h2 className="font-luxury text-4xl font-light tracking-widest text-brand-navy">
              #QWALITYCAPS STYLE
            </h2>
            <div className="w-12 h-[1px] bg-brand-gold mx-auto my-4" />
            <p className="text-xs sm:text-sm text-brand-charcoal/60 font-light">
              Follow our aesthetic narrative on Instagram.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=400",
              "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=400"
            ].map((img, idx) => (
              <div key={idx} className="relative aspect-square group overflow-hidden rounded-none border border-brand-navy/5 shadow-sm cursor-pointer">
                <img src={img} alt="Instagram Showcase" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" />
                <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <FiInstagram className="text-brand-gold w-7 h-7 transform scale-75 group-hover:scale-100 transition-transform duration-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      {/* QUICK VIEW MODAL */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}
