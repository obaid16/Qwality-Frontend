"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiTag, FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const res = await apiFetch("/categories");
      if (res.success) setCategories(res.data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, authLoading]);

  const onSubmit = async (data) => {
    setSubmitting(true); setFormError(""); setFormSuccess("");
    try {
      const payload = {
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || "",
      };
      const res = await apiFetch("/categories", { method: "POST", body: payload });
      if (res.success) {
        setFormSuccess("Category created successfully!");
        reset();
        await fetchCategories();
        setTimeout(() => { setShowForm(false); setFormSuccess(""); }, 1000);
      }
    } catch (e) {
      setFormError(e.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await apiFetch(`/categories/${confirmDelete._id}`, { method: "DELETE" });
      if (res.success) {
        setConfirmDelete(null);
        await fetchCategories();
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">Collection Structure</p>
          <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">Categories</h1>
          <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowForm(true); setFormError(""); setFormSuccess(""); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A96A] text-[#0A1628] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#E5C78F] transition-colors"
        >
          <FiPlus className="w-4 h-4" /> New Category
        </motion.button>
      </div>

      {/* Create Category Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-[#0A1628] border border-[#C8A96A]/20 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-luxury text-white text-lg">Create New Category</h3>
                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Category Name *</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                      placeholder="e.g. Classic, Suede, Cashmere"
                    />
                    {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Description</label>
                    <input
                      {...register("description")}
                      className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                      placeholder="Optional short description"
                    />
                  </div>
                </div>

                {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2">{formError}</p>}
                {formSuccess && <p className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">{formSuccess}</p>}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white text-[10px] uppercase tracking-widest transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-[#C8A96A] text-[#0A1628] font-bold text-[10px] uppercase tracking-widest hover:bg-[#E5C78F] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-white/20">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.length === 0 && (
            <div className="col-span-4 text-center text-white/20 py-12">No categories yet. Create your first one.</div>
          )}
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0A1628] border border-white/5 rounded-sm p-5 flex items-start justify-between group hover:border-[#C8A96A]/20 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-[#C8A96A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiTag className="w-4 h-4 text-[#C8A96A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{cat.name}</h3>
                  <p className="text-[10px] text-white/30 mt-0.5">{cat.slug}</p>
                  {cat.description && <p className="text-[10px] text-white/40 mt-1">{cat.description}</p>}
                </div>
              </div>
              <button
                onClick={() => setConfirmDelete(cat)}
                className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

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
              <h3 className="font-luxury text-white text-lg mb-2">Delete Category</h3>
              <p className="text-white/50 text-sm mb-6">
                Are you sure you want to delete &quot;{confirmDelete?.name}&quot;? Products in this category may be affected.
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
