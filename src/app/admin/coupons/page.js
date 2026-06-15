"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiPercent, FiX, FiCalendar, FiChevronDown } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminCouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [discountType, setDiscountType] = useState("percentage");
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { discountType: "percentage" }
  });

  const fetchCoupons = async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const res = await apiFetch("/coupons");
      if (res.success) setCoupons(res.data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, authLoading]);

  const onSubmit = async (data) => {
    setSubmitting(true); setFormError(""); setFormSuccess("");
    try {
      const payload = {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderAmount: Number(data.minOrderAmount) || 0,
        maxDiscountAmount: Number(data.maxDiscountAmount) || 0,
        usageLimit: Number(data.usageLimit) || 0,
        expiresAt: data.expiresAt || null,
      };
      const res = await apiFetch("/coupons", { method: "POST", body: payload });
      if (res.success) {
        setFormSuccess("Coupon created successfully!");
        reset({ discountType: "percentage" });
        setDiscountType("percentage");
        await fetchCoupons();
        setTimeout(() => { setShowForm(false); setFormSuccess(""); }, 1000);
      }
    } catch (e) {
      setFormError(e.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await apiFetch(`/coupons/${confirmDelete._id}`, { method: "DELETE" });
      if (res.success) {
        setConfirmDelete(null);
        await fetchCoupons();
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">Promotions Engine</p>
          <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">Coupons</h1>
          <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowForm(true); setFormError(""); setFormSuccess(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A96A] text-[#0A1628] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#E5C78F] transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Create Coupon
        </motion.button>
      </div>

      {/* Create Coupon Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-[#0A1628] border border-[#C8A96A]/20 rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-luxury text-white text-lg">Create New Coupon</h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Coupon Code *</label>
                    <input
                      {...register("code", { required: "Code is required" })}
                      placeholder="GOLDEN20"
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20 uppercase"
                    />
                    {errors.code && <p className="text-red-400 text-[10px] mt-1">{errors.code.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Discount Type *</label>
                    <div className="relative">
                      <select
                        {...register("discountType", { onChange: (e) => setDiscountType(e.target.value) })}
                        className="w-full appearance-none bg-[#0D1B2E] border border-white/10 text-white text-xs pl-3 pr-8 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors cursor-pointer"
                      >
                        <option value="percentage" className="bg-[#0D1B2E] text-white">Percentage (%)</option>
                        <option value="flat" className="bg-[#0D1B2E] text-white">Flat Amount ($)</option>
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A96A]/75 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">
                      Value {discountType === "percentage" ? "(%)" : "($)"} *
                    </label>
                    <input
                      type="number"
                      {...register("discountValue", { required: "Value is required", min: 1 })}
                      placeholder={discountType === "percentage" ? "20" : "15"}
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                    />
                    {errors.discountValue && <p className="text-red-400 text-[10px] mt-1">{errors.discountValue.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Expires At</label>
                    <input
                      type="date"
                      {...register("expiresAt")}
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Min Order ($)</label>
                    <input
                      type="number"
                      {...register("minOrderAmount")}
                      placeholder="50"
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Max Discount ($)</label>
                    <input
                      type="number"
                      {...register("maxDiscountAmount")}
                      placeholder="30"
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Usage Limit</label>
                    <input
                      type="number"
                      {...register("usageLimit")}
                      placeholder="100"
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                    />
                  </div>
                </div>

                {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2">{formError}</p>}
                {formSuccess && <p className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">{formSuccess}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#C8A96A] text-[#0A1628] font-bold text-[10px] uppercase tracking-widest hover:bg-[#E5C78F] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons Table */}
      <div className="bg-[#0A1628] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Code", "Type", "Value", "Min Order", "Max Discount", "Usage Limit", "Expires", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-white/20 text-sm">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-white/20 text-sm">No coupons yet. Create your first promotion.</td></tr>
              ) : coupons.map((coupon, i) => (
                <motion.tr
                  key={coupon._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FiPercent className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span className="text-sm font-bold text-[#C8A96A] font-mono tracking-widest">{coupon.code}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/60 capitalize">{coupon.discountType}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-white">
                    {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/50">
                    {coupon.minOrderAmount > 0 ? `$${coupon.minOrderAmount}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/50">
                    {coupon.maxDiscountAmount > 0 ? `$${coupon.maxDiscountAmount}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/50">
                    {coupon.usageLimit > 0 ? `${coupon.usedCount || 0} / ${coupon.usageLimit}` : "Unlimited"}
                  </td>
                  <td className="px-5 py-3.5">
                    {coupon.expiresAt ? (
                      <span className="flex items-center gap-1 text-[10px] text-white/40">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(coupon.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/20">No expiry</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setConfirmDelete(coupon)}
                      className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0A1628] border border-[#C8A96A]/20 rounded-sm p-6 max-w-sm w-full"
            >
              <h3 className="font-luxury text-white text-lg mb-2">Delete Coupon</h3>
              <p className="text-white/50 text-sm mb-6">
                Are you sure you want to delete coupon <strong className="text-[#C8A96A]">{confirmDelete?.code}</strong>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-[10px] uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
