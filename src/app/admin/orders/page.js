"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag, FiFilter, FiChevronLeft, FiChevronRight,
  FiClock, FiChevronDown, FiCheck, FiX
} from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

const STATUS_STYLES = {
  pending:    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  confirmed:  "bg-blue-500/15 text-blue-400 border-blue-500/20",
  processing: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  shipped:    "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  delivered:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  cancelled:  "bg-red-500/15 text-red-400 border-red-500/20",
  refunded:   "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${STATUS_STYLES[status] || "text-white/40 bg-white/5 border-white/10"}`}>
      {status}
    </span>
  );
}

function StatusSelect({ orderId, currentStatus, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    setUpdating(true);
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: "PUT",
        body: { status: newStatus },
      });
      if (res.success) onUpdate(orderId, newStatus);
    } catch (e) {
      console.warn("Status update failed:", e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-w-[110px]">
      <select
        value=""
        onChange={handleChange}
        disabled={updating}
        className="w-full appearance-none bg-[#0A1628] border border-white/10 text-white/60 hover:text-white hover:border-[#C8A96A]/40 text-[10px] pl-3.5 pr-8 py-1.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors cursor-pointer uppercase tracking-widest font-semibold disabled:opacity-50"
      >
        <option value="" disabled hidden>
          {updating ? "Updating..." : "Change"}
        </option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-[#0D1B2E] text-white">
            {s.toUpperCase()}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C8A96A]/80 pointer-events-none" />
    </div>
  );
}

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (statusFilter) params.set("status", statusFilter);
      const res = await apiFetch(`/orders?${params}`);
      if (res.success) {
        setOrders(res.data.items || []);
        setTotalPages(Math.ceil((res.data.total || 0) / 12) || 1);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders, user, authLoading]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">Fulfilment Centre</p>
          <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">Orders</h1>
          <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <FiFilter className="text-white/30 w-4 h-4" />
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Filter by Status:</span>
        </div>
        {["", ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
              statusFilter === s
                ? "border-[#C8A96A]/40 bg-[#C8A96A]/15 text-[#C8A96A]"
                : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0A1628] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Order ID", "Customer", "Items", "Total", "Payment", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-white/20 text-sm">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-white/20 text-sm">No orders found</td></tr>
              ) : orders.map((order, i) => (
                <React.Fragment key={order._id}>
                  <motion.tr
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-white/[0.03] transition-colors cursor-pointer ${
                      expandedOrder === order._id ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                    }`}
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] text-[#C8A96A] font-mono">#{order._id?.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-xs text-white/80">{order.user?.name || "Guest"}</p>
                        <p className="text-[10px] text-white/30">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white/50">{order.items?.length ?? 0}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-white">₹{Math.round(order.total * 83).toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        order.paymentStatus === "paid" ? "bg-emerald-500/15 text-emerald-400" :
                        order.paymentStatus === "failed" ? "bg-red-500/15 text-red-400" :
                        "bg-amber-500/15 text-amber-400"
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] text-white/30 flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                      <StatusSelect
                        orderId={order._id}
                        currentStatus={order.status}
                        onUpdate={handleStatusUpdate}
                      />
                    </td>
                  </motion.tr>
                  {/* Expanded detail row */}
                  {expandedOrder === order._id && (
                    <tr className="bg-[#0D1B2E]">
                      <td colSpan={8} className="px-8 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Order Items */}
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96A] font-semibold mb-3">Items Ordered</p>
                            <div className="space-y-2">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs text-white/60">
                                  <span>{item.name} × {item.quantity}</span>
                                  <span className="text-white/40">{item.color} / {item.size}</span>
                                  <span className="text-white font-bold">₹{Math.round(item.price * 83 * item.quantity).toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96A] font-semibold mb-3">Shipping Address</p>
                            <div className="text-xs text-white/60 space-y-1">
                              <p>{order.shippingAddress?.name}</p>
                              <p>{order.shippingAddress?.street}</p>
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                              <p>{order.shippingAddress?.country}</p>
                            </div>
                          </div>
                          {/* Order Summary */}
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#C8A96A] font-semibold mb-3">Order Summary</p>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between text-white/60">
                                <span>Subtotal</span><span>₹{Math.round(order.subtotal * 83).toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between text-white/60">
                                <span>Shipping</span><span>₹{Math.round(order.shippingFee * 83).toLocaleString("en-IN")}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-[#C8A96A]">
                                  <span>Discount</span><span>-₹{Math.round(order.discount * 83).toLocaleString("en-IN")}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
                                <span>Total</span><span>₹{Math.round(order.total * 83).toLocaleString("en-IN")}</span>
                              </div>
                              <p className="text-[10px] text-white/30 mt-2">Payment: {order.paymentMethod?.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
