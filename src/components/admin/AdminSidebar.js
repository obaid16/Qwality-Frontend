"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiTag, FiPercent, FiLogOut, FiChevronLeft, FiChevronRight,
  FiExternalLink
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard",   path: "/admin",            icon: FiGrid },
  { label: "Products",    path: "/admin/products",   icon: FiPackage },
  { label: "Orders",      path: "/admin/orders",     icon: FiShoppingBag },
  { label: "Users",       path: "/admin/users",      icon: FiUsers },
  { label: "Categories",  path: "/admin/categories", icon: FiTag },
  { label: "Coupons",     path: "/admin/coupons",    icon: FiPercent },
];

export default function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    router.push("/auth");
  };

  return (
    <motion.aside
      animate={{ 
        width: isMobile ? 240 : (collapsed ? 72 : 240),
        x: isMobile ? (mobileOpen ? 0 : -248) : 0
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 bottom-0 h-screen bg-[#0A1628] border-r border-[#C8A96A]/10 flex flex-col z-40 overflow-hidden ${
        isMobile ? "shadow-2xl" : ""
      }`}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[#C8A96A]/10 flex-shrink-0">
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <span className="font-luxury text-lg font-bold tracking-[0.25em] text-[#C8A96A]">
                QWALITY
              </span>
              <span className="text-[8px] tracking-[0.4em] text-[#C8A96A]/50 uppercase -mt-0.5">
                Admin Console
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 rounded-sm bg-[#C8A96A]/10 hover:bg-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] transition-colors flex-shrink-0"
          >
            {collapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              onClick={() => setMobileOpen(false)}
              title={(collapsed && !isMobile) ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-300 group relative ${
                isActive
                  ? "bg-[#C8A96A]/15 text-[#C8A96A] border border-[#C8A96A]/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#C8A96A]" : ""}`} />
              <AnimatePresence mode="wait">
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8A96A] rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="px-3 pb-6 space-y-1 border-t border-[#C8A96A]/10 pt-4 flex-shrink-0">
        <Link
          href="/"
          target="_blank"
          onClick={() => setMobileOpen(false)}
          title={(collapsed && !isMobile) ? "View Store" : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-300"
        >
          <FiExternalLink className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
              >
                View Store
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={handleLogout}
          title={(collapsed && !isMobile) ? "Sign Out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
