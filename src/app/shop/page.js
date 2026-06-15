"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiSliders, FiGrid, FiList, FiSearch, FiX, FiChevronDown } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import ProductCard from "@/components/product/ProductCard";
import QuickViewModal from "@/components/product/QuickViewModal";
// Removed mockProducts to keep storefront fully database-driven
import { apiFetch } from "@/utils/api";
import { mapBackendProduct } from "@/utils/productMapper";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(20750);
  const [sortBy, setSortBy] = useState("default");
  
  // Mobile filter sidebar toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dynamic API State
  const [categoriesList, setCategoriesList] = useState(["All"]);
  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch Category ID mappings
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/categories");
        if (res.success && res.data) {
          const list = ["All", ...res.data.map(cat => cat.name)];
          setCategoriesList(list);
          
          const map = {};
          res.data.forEach(cat => {
            map[cat.name] = cat._id;
            // Map simplified category tags or names to IDs
            const nameLower = cat.name.toLowerCase();
            if (nameLower.includes("classic") || nameLower.includes("snapback")) {
              map["Classic"] = cat._id;
            }
            if (nameLower.includes("suede") || nameLower.includes("dad")) {
              map["Suede"] = cat._id;
            }
            if (nameLower.includes("cashmere") || nameLower.includes("knit")) {
              map["Cashmere"] = cat._id;
            }
            if (nameLower.includes("linen")) {
              map["Linen"] = cat._id;
            }
            if (nameLower.includes("custom") || nameLower.includes("bespoke")) {
              map["Custom"] = cat._id;
            }
          });
          setCategoriesMap(map);
        }
      } catch (err) {
        console.error("Failed to load categories map:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products on filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let queryParams = `?limit=${itemsPerPage}&page=${currentPage}`;
        
        if (search.trim()) {
          queryParams += `&search=${encodeURIComponent(search)}`;
        }
        
        if (category !== "All") {
          const catId = categoriesMap[category];
          if (catId) {
            queryParams += `&category=${catId}`;
          }
        }
        
        queryParams += `&maxPrice=${maxPrice / 83}`;
        
        if (sortBy === "price-asc") {
          queryParams += `&sort=price`;
        } else if (sortBy === "price-desc") {
          queryParams += `&sort=-price`;
        } else if (sortBy === "rating") {
          queryParams += `&sort=-rating`;
        }

        const res = await apiFetch(`/products${queryParams}`);
        if (res.success && res.data && res.data.items) {
          const mapped = res.data.items.map(mapBackendProduct);
          setProducts(mapped);
          setTotalProductsCount(res.data.total);
        } else {
          setProducts([]);
          setTotalProductsCount(0);
        }
      } catch (err) {
        console.error("Failed to load filtered products:", err);
        setProducts([]);
        setTotalProductsCount(0);
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetch = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(debouncedFetch);
  }, [search, category, maxPrice, sortBy, currentPage, categoriesMap]);

  // Reset page when filter dependencies change
  const [prevFilters, setPrevFilters] = useState({ search, category, maxPrice, sortBy });
  if (
    search !== prevFilters.search ||
    category !== prevFilters.category ||
    maxPrice !== prevFilters.maxPrice ||
    sortBy !== prevFilters.sortBy
  ) {
    setPrevFilters({ search, category, maxPrice, sortBy });
    setCurrentPage(1);
  }

  // Handle Quick View
  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  // Pagination calculation
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + products.length;
  const currentItems = products;
  const totalPages = Math.ceil(totalProductsCount / itemsPerPage);
  const filteredProducts = products; // alias for length checks in layout

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice(20750);
    setSortBy("default");
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[118px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header & Subtitle */}
          <div className="border-b border-brand-navy/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Quality Boutique</span>
              <h1 className="font-luxury text-3xl md:text-5xl font-extrabold tracking-widest text-brand-navy mt-2">
                THE SHOP
              </h1>
            </div>
            <p className="text-sm text-brand-charcoal/60 max-w-md font-light">
              Explore custom headwear collections curated for style connoisseurs. Enjoy free worldwide delivery on orders over ₹12,450.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT SIDEBAR: FILTERS (DESKTOP) */}
            <aside className="hidden lg:block w-64 space-y-8 flex-shrink-0">
              {/* Search Bar */}
              <div className="space-y-3">
                <h4 className="font-luxury text-xs uppercase tracking-widest font-bold text-brand-navy">Search</h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search boutique..."
                    value={mounted ? search : ""}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-brand-navy/10 px-4 py-2.5 rounded text-xs"
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-luxury text-xs uppercase tracking-widest font-bold text-brand-navy">Collections</h4>
                <div className="flex flex-col space-y-2">
                  {mounted ? (
                    categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-left text-xs uppercase tracking-wider py-1 hover:text-brand-gold transition-colors flex items-center gap-2 ${
                          category === cat ? "text-brand-gold font-bold" : "text-brand-charcoal/70"
                        }`}
                      >
                        {category === cat && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                        {cat}
                      </button>
                    ))
                  ) : (
                    <button className="text-left text-xs uppercase tracking-wider py-1 text-brand-gold font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      All
                    </button>
                  )}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-luxury text-xs uppercase tracking-widest font-bold text-brand-navy">Price Range</h4>
                  <span className="text-xs font-semibold text-brand-gold">₹{mounted ? maxPrice.toLocaleString("en-IN") : "20,750"} max</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20750"
                  step="250"
                  value={mounted ? maxPrice : 20750}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-gold bg-brand-navy/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-brand-charcoal/50">
                  <span>₹0</span>
                  <span>₹20,750</span>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full py-2.5 border border-brand-navy/20 hover:border-brand-gold text-brand-navy hover:text-brand-gold uppercase tracking-widest text-[10px] font-bold transition-all duration-300"
              >
                Clear Filters
              </button>
            </aside>

            {/* RIGHT COLUMN: PRODUCT GRID & OPTIONS */}
            <div className="flex-1 space-y-8">
              
              {/* Grid Control & Sorting Bar */}
              <div className="flex justify-between items-center bg-white border border-brand-navy/10 p-4 rounded shadow-sm">
                <div className="flex items-center gap-4 text-xs text-brand-charcoal/60">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-1 uppercase tracking-wider font-bold hover:text-brand-gold"
                  >
                    <FiSliders /> Filters
                  </button>
                  <span className="hidden sm:inline">Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products</span>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-xs uppercase tracking-wider text-brand-charcoal/60 hidden sm:inline">Sort by:</label>
                  <div className="relative">
                    <select
                      id="sort-by"
                      value={mounted ? sortBy : "default"}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-white border border-brand-navy/10 text-xs pl-3 pr-8 py-2 rounded-sm cursor-pointer focus:outline-none focus:border-[#C8A96A] font-light tracking-wide text-brand-navy min-w-[140px]"
                    >
                      <option value="default">Default</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-navy/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-brand-navy/10 rounded space-y-4">
                  <p className="font-luxury text-lg text-brand-navy uppercase tracking-widest">No Products Found</p>
                  <p className="text-xs text-brand-charcoal/60">Try adjusting your filters or resetting the search query.</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-brand-navy transition-all border border-brand-gold"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center justify-items-center">
                  {currentItems.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={openQuickView} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 pt-8">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-10 h-10 border rounded flex items-center justify-center text-xs font-bold transition-colors ${
                        currentPage === idx + 1
                          ? "bg-brand-navy text-brand-gold border-brand-gold"
                          : "bg-white text-brand-navy border-brand-navy/20 hover:border-brand-navy"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* MOBILE FILTERS SIDEBAR */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-110 flex justify-end">
          <div className="fixed inset-0 bg-brand-charcoal/50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-80 bg-[#F8F6F1] h-full p-6 shadow-2xl overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b border-brand-navy/10 pb-4 mb-6">
                <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <FiX className="w-5 h-5 text-brand-navy" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mb-6 space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search boutique..."
                    value={mounted ? search : ""}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white border border-brand-navy/10 px-4 py-2 rounded text-xs"
                  />
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="mb-6 space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Collections</label>
                <div className="flex flex-col space-y-2">
                  {mounted ? (
                    categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowMobileFilters(false);
                        }}
                        className={`text-left text-xs uppercase tracking-wider py-1 flex items-center gap-2 ${
                          category === cat ? "text-brand-gold font-bold" : "text-brand-charcoal/70"
                        }`}
                      >
                        {category === cat && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />}
                        {cat}
                      </button>
                    ))
                  ) : (
                    <button className="text-left text-xs uppercase tracking-wider py-1 text-brand-gold font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                      All
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-8 space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs uppercase tracking-wider font-semibold text-brand-navy">Price Limit</label>
                  <span className="text-xs font-semibold text-brand-gold">₹{mounted ? maxPrice.toLocaleString("en-IN") : "20,750"}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20750"
                  step="250"
                  value={mounted ? maxPrice : 20750}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-gold"
                />
              </div>
            </div>

            <button
              onClick={() => {
                resetFilters();
                setShowMobileFilters(false);
              }}
              className="w-full py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

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

export default function Shop() {
  return (
    <Suspense fallback={<div className="h-screen bg-brand-navy flex items-center justify-center text-brand-gold font-luxury tracking-widest uppercase">Loading boutique...</div>}>
      <ShopContent />
    </Suspense>
  );
}
