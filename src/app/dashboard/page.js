"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  FiUser, FiShoppingBag, FiHeart, FiMapPin, FiSettings, 
  FiLock, FiLogOut, FiPlus, FiTrash2, FiClock 
} from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { wishlist, toggleWishlist } = useCart();
  
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'orders' | 'wishlist' | 'addresses' | 'profile' | 'security'
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [dashboardStatus, setDashboardStatus] = useState({ success: null, message: "" });

  const profileForm = useForm();
  const securityForm = useForm();
  const addressForm = useForm();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    } else if (user) {
      profileForm.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, loading, router, profileForm]);

  if (loading || !user) {
    return <div className="h-screen bg-brand-navy flex items-center justify-center text-brand-gold font-luxury tracking-widest uppercase">Verifying registry status...</div>;
  }

  const handleProfileSubmit = (data) => {
    updateProfile(data);
    setDashboardStatus({ success: true, message: "Registry profile updated successfully." });
    setTimeout(() => setDashboardStatus({ success: null, message: "" }), 3000);
  };

  const handleSecuritySubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setDashboardStatus({ success: false, message: "Passwords do not match." });
      return;
    }
    setDashboardStatus({ success: true, message: "Security credentials updated successfully." });
    securityForm.reset();
    setTimeout(() => setDashboardStatus({ success: null, message: "" }), 3000);
  };

  const handleAddressSubmit = (data) => {
    addAddress(data);
    setShowAddressForm(false);
    addressForm.reset();
    setDashboardStatus({ success: true, message: "Address added to registry." });
    setTimeout(() => setDashboardStatus({ success: null, message: "" }), 3000);
  };

  const menuItems = [
    { id: "overview", name: "Overview", icon: FiUser },
    { id: "orders", name: "My Orders", icon: FiShoppingBag },
    { id: "wishlist", name: "Wishlist", icon: FiHeart },
    { id: "addresses", name: "Addresses", icon: FiMapPin },
    { id: "profile", name: "Profile Settings", icon: FiSettings },
    { id: "security", name: "Security Settings", icon: FiLock },
  ];

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[120px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-luxury text-3xl md:text-4xl font-extrabold tracking-widest text-brand-navy border-b border-brand-navy/10 pb-6 mb-12 uppercase">
            Member Dashboard
          </h1>

          {dashboardStatus.message && (
            <div className={`p-4 text-xs font-semibold text-center border rounded-sm mb-6 ${
              dashboardStatus.success ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {dashboardStatus.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 bg-white border border-brand-navy/10 rounded-sm p-6 space-y-2">
              <div className="pb-6 border-b border-brand-navy/10 mb-4 text-center lg:text-left">
                <p className="font-luxury text-sm font-bold text-brand-navy tracking-wider truncate">{user.name}</p>
                <p className="text-[10px] text-brand-charcoal/50 uppercase tracking-widest mt-1">Registry Member</p>
              </div>

              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setDashboardStatus({ success: null, message: "" });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === item.id
                        ? "bg-brand-navy text-brand-gold"
                        : "text-brand-charcoal/70 hover:bg-brand-white hover:text-brand-navy"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {item.name}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  router.push("/auth");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-all mt-4"
              >
                <FiLogOut className="w-4 h-4" /> Log Out
              </button>
            </aside>

            {/* Core Workspace Panel */}
            <div className="lg:col-span-9 bg-white border border-brand-navy/10 rounded-sm p-8 min-h-[500px]">
              
              {/* OVERVIEW PANEL */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="border-b border-brand-navy/10 pb-4">
                    <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Registry Overview</h2>
                    <p className="text-xs text-brand-charcoal/60 mt-1">Welcome back to your private account hub.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-brand-navy/10 p-6 rounded bg-brand-white/40 space-y-2">
                      <FiShoppingBag className="w-6 h-6 text-brand-gold" />
                      <h4 className="text-xs uppercase tracking-widest text-brand-charcoal/50">Total Orders</h4>
                      <p className="text-xl font-extrabold text-brand-navy">{user.orders?.length || 0}</p>
                    </div>
                    <div className="border border-brand-navy/10 p-6 rounded bg-brand-white/40 space-y-2">
                      <FiHeart className="w-6 h-6 text-brand-gold" />
                      <h4 className="text-xs uppercase tracking-widest text-brand-charcoal/50">Wishlist Size</h4>
                      <p className="text-xl font-extrabold text-brand-navy">{wishlist.length}</p>
                    </div>
                    <div className="border border-brand-navy/10 p-6 rounded bg-brand-white/40 space-y-2">
                      <FiMapPin className="w-6 h-6 text-brand-gold" />
                      <h4 className="text-xs uppercase tracking-widest text-brand-charcoal/50">Saved Addresses</h4>
                      <p className="text-xl font-extrabold text-brand-navy">{user.addresses?.length || 0}</p>
                    </div>
                  </div>

                  {/* Quick Profile Snapshot */}
                  <div className="border border-brand-navy/10 rounded p-6">
                    <h3 className="font-luxury text-sm font-bold text-brand-navy uppercase tracking-wider mb-4">Registry Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-brand-charcoal/70">
                      <p>Name: <span className="font-bold text-brand-navy">{user.name}</span></p>
                      <p>Email: <span className="font-bold text-brand-navy">{user.email}</span></p>
                      <p>Phone: <span className="font-bold text-brand-navy">{user.phone || "Not specified"}</span></p>
                    </div>
                  </div>
                </div>
              )}

              {/* ORDERS LIST PANEL */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy/10 pb-4">
                    <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Order Archive</h2>
                    <p className="text-xs text-brand-charcoal/60 mt-1">Review items currently processing or shipped.</p>
                  </div>

                  {(!user.orders || user.orders.length === 0) ? (
                    <div className="text-center py-16 text-brand-charcoal/50 text-xs">No orders recorded yet.</div>
                  ) : (
                    <div className="space-y-6">
                      {user.orders.map((order) => (
                        <div key={order.id} className="border border-brand-navy/10 rounded p-6 space-y-4 bg-brand-white/20">
                          <div className="flex flex-wrap justify-between items-center border-b border-brand-navy/10 pb-3 gap-2">
                            <div>
                              <span className="text-xs font-extrabold text-brand-navy mr-4">{order.id}</span>
                              <span className="text-xs text-brand-charcoal/50">{order.date}</span>
                            </div>
                            <span className="px-3 py-1 bg-brand-navy text-brand-gold rounded text-[10px] font-bold tracking-widest uppercase">
                              {order.status}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-bold text-brand-navy">{item.name}</p>
                                  <p className="text-[10px] text-brand-charcoal/50 uppercase mt-0.5">
                                    {item.color} / {item.size} (Qty: {item.qty})
                                  </p>
                                </div>
                                <span className="font-semibold text-brand-navy">${item.price * item.qty}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-brand-navy/10 pt-3 flex justify-between items-center text-xs font-bold">
                            <span className="uppercase text-brand-charcoal/60">Total Cost</span>
                            <span className="text-brand-gold text-sm font-extrabold">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* WISHLIST PANEL */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy/10 pb-4">
                    <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Registry Wishlist</h2>
                    <p className="text-xs text-brand-charcoal/60 mt-1">Items saved for future boutique curation.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 text-brand-charcoal/50 text-xs">Your wishlist is currently empty.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="border border-brand-navy/10 rounded-sm p-4 flex gap-4 bg-white relative group">
                          <img src={item.images[0]} alt="" className="w-16 h-16 object-cover border border-brand-navy/10 rounded" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-luxury text-xs font-bold text-brand-navy tracking-wider">{item.name}</h4>
                              <p className="text-xs text-brand-gold font-bold mt-1">${item.price}</p>
                            </div>
                            <Link href={`/product/${item.id}`} className="text-[10px] text-brand-navy hover:underline uppercase tracking-widest font-semibold mt-2">
                              View Details
                            </Link>
                          </div>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                            aria-label="Remove wishlist"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES BOOK PANEL */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy/10 pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Address Registry</h2>
                      <p className="text-xs text-brand-charcoal/60 mt-1">Manage delivery locations.</p>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="px-4 py-2 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all"
                    >
                      <FiPlus className="inline mr-1" /> Add New
                    </button>
                  </div>

                  {showAddressForm && (
                    <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="border border-brand-navy/10 rounded p-6 bg-brand-white/30 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Label Name</label>
                          <input type="text" {...addressForm.register("name", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" placeholder="e.g. Vacation Home" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Street Address</label>
                          <input type="text" {...addressForm.register("street", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">City</label>
                          <input type="text" {...addressForm.register("city", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">State</label>
                          <input type="text" {...addressForm.register("state", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Zip Code</label>
                          <input type="text" {...addressForm.register("zip", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Country</label>
                          <input type="text" {...addressForm.register("country", { required: true })} className="w-full bg-white border border-brand-navy/15 px-3 py-2 text-xs rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border border-brand-navy/20 text-xs font-bold uppercase tracking-wider text-brand-navy">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-wider">Save Address</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {user.addresses?.map((addr) => (
                      <div key={addr.id} className="border border-brand-navy/10 rounded p-6 bg-brand-white/10 relative space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-luxury text-xs font-bold text-brand-navy tracking-wider uppercase">{addr.name}</h4>
                          {addr.isDefault && <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-gold">Default</span>}
                        </div>
                        <p className="text-xs text-brand-charcoal/80 leading-relaxed font-light">
                          {addr.street}, {addr.city}, <br />
                          {addr.state} - {addr.zip}, {addr.country}
                        </p>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="absolute bottom-6 right-6 text-red-500 hover:text-red-700"
                          aria-label="Delete address"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE SETTINGS PANEL */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy/10 pb-4">
                    <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Profile Details</h2>
                    <p className="text-xs text-brand-charcoal/60 mt-1">Amend registry contact information.</p>
                  </div>

                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Full Name</label>
                      <input type="text" {...profileForm.register("name", { required: true })} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                      <input type="email" {...profileForm.register("email", { required: true })} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Contact Number</label>
                      <input type="text" {...profileForm.register("phone")} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <button type="submit" className="px-6 py-3 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-widest border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300">
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}

              {/* SECURITY SETTINGS PANEL */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="border-b border-brand-navy/10 pb-4">
                    <h2 className="font-luxury text-xl font-bold tracking-wider text-brand-navy">Credential Security</h2>
                    <p className="text-xs text-brand-charcoal/60 mt-1">Modify registry passcode credentials.</p>
                  </div>

                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Current Password</label>
                      <input type="password" {...securityForm.register("currentPassword", { required: true })} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">New Password</label>
                      <input type="password" {...securityForm.register("newPassword", { required: true })} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Confirm New Password</label>
                      <input type="password" {...securityForm.register("confirmPassword", { required: true })} className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded" />
                    </div>
                    <button type="submit" className="px-6 py-3 bg-brand-navy text-brand-gold text-xs font-bold uppercase tracking-widest border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300">
                      Reset Password
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
