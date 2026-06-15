"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign, FiShoppingBag, FiUsers, FiPackage,
  FiTrendingUp, FiArrowRight, FiClock
} from "react-icons/fi";
import Link from "next/link";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS = {
  pending:    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  confirmed:  "bg-blue-500/15 text-blue-400 border-blue-500/20",
  processing: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  shipped:    "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
  refunded:   "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

function StatCard({ label, value, icon: Icon, color, prefix = "", suffix = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0A1628] border border-white/5 rounded-sm p-6 relative overflow-hidden group hover:border-[#C8A96A]/20 transition-all duration-500"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 ${color}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold mb-2">{label}</p>
          <p className="text-3xl font-bold text-white font-luxury">
            {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${color} bg-opacity-15`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

function SparkBar({ values = [], height = 40 }) {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1 h-10">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 bg-[#C8A96A]/30 hover:bg-[#C8A96A]/60 transition-all duration-300 rounded-t-sm"
          style={{ height: `${Math.max((v / max) * height, 3)}px` }}
          title={`₹${(v * 83).toLocaleString("en-IN")}`}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    const fetchData = async () => {
      try {
        const [metricsRes, ordersRes] = await Promise.all([
          apiFetch("/orders/admin/dashboard-metrics"),
          apiFetch("/orders?limit=8"),
        ]);
        if (metricsRes.success) setMetrics(metricsRes.data);
        if (ordersRes.success) setRecentOrders(ordersRes.data.items || []);
      } catch (e) {
        console.warn("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading]);

  const monthlyValues = metrics?.monthlyRevenue?.map((m) => m.revenue) || [];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">
          Control Center
        </p>
        <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">
          Admin Dashboard
        </h1>
        <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#C8A96A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/40 text-[10px] tracking-widest uppercase">Loading metrics...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Revenue"
              value={(metrics?.totalRevenue ?? 0) * 83}
              icon={FiDollarSign}
              color="bg-[#C8A96A] text-[#C8A96A]"
              prefix="₹"
              delay={0}
            />
            <StatCard
              label="Total Orders"
              value={metrics?.totalOrders ?? 0}
              icon={FiShoppingBag}
              color="bg-blue-400 text-blue-400"
              delay={0.1}
            />
            <StatCard
              label="Customers"
              value={metrics?.totalCustomers ?? 0}
              icon={FiUsers}
              color="bg-violet-400 text-violet-400"
              delay={0.2}
            />
            <StatCard
              label="Products"
              value={metrics?.totalProducts ?? 0}
              icon={FiPackage}
              color="bg-emerald-400 text-emerald-400"
              delay={0.3}
            />
          </div>

          {/* Revenue Chart + Top Sellers */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Monthly Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="xl:col-span-2 bg-[#0A1628] border border-white/5 rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">Monthly Revenue</p>
                  <h3 className="text-white font-luxury text-xl mt-1">Revenue Overview</h3>
                </div>
                <FiTrendingUp className="text-[#C8A96A] w-5 h-5" />
              </div>

              {monthlyValues.length > 0 ? (
                <div className="space-y-3">
                  {/* Month labels + bars */}
                  <div className="flex items-end gap-1 h-32">
                    {(metrics?.monthlyRevenue || []).map((m, i) => {
                      const max = Math.max(...monthlyValues, 1);
                      const pct = (m.revenue / max) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div className="relative w-full flex items-end" style={{ height: "100px" }}>
                            <div
                              className="w-full bg-[#C8A96A]/20 hover:bg-[#C8A96A]/50 rounded-t-sm transition-all duration-500 cursor-pointer relative"
                              style={{ height: `${Math.max(pct, 4)}%` }}
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0A1628] border border-[#C8A96A]/20 px-1.5 py-0.5 rounded text-[9px] text-[#C8A96A] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                ₹{(m.revenue * 83).toLocaleString("en-IN")}
                              </div>
                            </div>
                          </div>
                          <span className="text-[8px] text-white/30 uppercase">{m.month?.slice(0,3)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-white/20 text-sm">
                  No revenue data yet
                </div>
              )}
            </motion.div>

            {/* Top Selling Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[#0A1628] border border-white/5 rounded-sm p-6"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold mb-1">Performance</p>
              <h3 className="text-white font-luxury text-xl mb-5">Top Sellers</h3>
              <div className="space-y-4">
                {(metrics?.topSelling || []).slice(0, 5).map((p, i) => (
                  <div key={p._id || i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] text-[#C8A96A]/50 font-bold w-4 flex-shrink-0">#{i + 1}</span>
                      <p className="text-xs text-white/80 truncate">{p.name}</p>
                    </div>
                    <span className="text-[10px] text-white/40 flex-shrink-0">{p.totalSold} sold</span>
                  </div>
                ))}
                {(!metrics?.topSelling || metrics.topSelling.length === 0) && (
                  <p className="text-white/20 text-xs">No sales data yet</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-[#0A1628] border border-white/5 rounded-sm"
          >
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">Recent Activity</p>
                <h3 className="text-white font-luxury text-lg">Latest Orders</h3>
              </div>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1.5 text-[10px] text-[#C8A96A] hover:text-white uppercase tracking-wider font-bold transition-colors"
              >
                View All <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-white/20 text-sm">
                        No orders yet
                      </td>
                    </tr>
                  )}
                  {recentOrders.map((order, i) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] text-[#C8A96A] font-mono">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs text-white/70">
                          {order.user?.name || "Guest"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs text-white/50">{order.items?.length ?? 0} item(s)</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs font-bold text-white">₹{Math.round(order.total * 83).toLocaleString("en-IN")}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${STATUS_COLORS[order.status] || "text-white/40 bg-white/5 border-white/10"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
