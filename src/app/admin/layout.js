"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#C8A96A] text-[10px] tracking-[0.3em] uppercase font-semibold">
            Verifying Credentials
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const sidebarWidthClass = collapsed ? "md:ml-[72px]" : "md:ml-[240px]";

  return (
    <div className="min-h-screen bg-[#0D1B2E] flex relative">
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content wrapper */}
      <div
        className={`flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ml-0 ${sidebarWidthClass}`}
      >
        {/* Mobile Header Bar */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-[60px] bg-[#0A1628] border-b border-[#C8A96A]/10 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 bg-[#C8A96A]/10 hover:bg-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A] transition-colors rounded-sm"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <div className="flex flex-col">
              <span className="font-luxury text-sm font-bold tracking-[0.25em] text-[#C8A96A] leading-none">QWALITY</span>
              <span className="text-[7px] tracking-[0.4em] text-[#C8A96A]/50 uppercase mt-0.5">Console</span>
            </div>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-[#C8A96A]/60 font-bold bg-[#C8A96A]/10 px-2 py-1 rounded-sm border border-[#C8A96A]/15">
            Admin
          </span>
        </header>

        {/* Main Content Pane */}
        <main className="flex-grow pt-[60px] md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
