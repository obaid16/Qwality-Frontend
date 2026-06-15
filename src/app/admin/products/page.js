/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck,
  FiPackage, FiStar, FiChevronLeft, FiChevronRight, FiUpload, FiChevronDown
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const EMPTY_FORM = {
  name: "", description: "", sku: "", price: "", salePrice: "",
  stock: "", images: "", tags: "", isFeatured: false, category: "",
};

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0A1628] border border-[#C8A96A]/20 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h3 className="font-luxury text-lg text-white tracking-wider">{title}</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirm Delete">
      <p className="text-white/60 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 border border-white/10 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-xs uppercase tracking-widest transition-colors">Delete</button>
      </div>
    </Modal>
  );
}

function InputField({ label, name, register, type = "text", required = false, error, placeholder = "" }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">{label}{required && " *"}</label>
      <input
        type={type}
        {...register(name, required ? { required: `${label} is required` } : {})}
        placeholder={placeholder}
        className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
      />
      {error && <p className="text-red-400 text-[10px] mt-1">{error.message}</p>}
    </div>
  );
}

export default function AdminProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [imagesValue, setImagesValue] = useState("");
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

  const fetchProducts = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set("search", search);
      const res = await apiFetch(`/products?${params}`);
      if (res.success) {
        setProducts(res.data.items || []);
        setTotalPages(Math.ceil((res.data.total || 0) / 10) || 1);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts, user, authLoading]);

  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    let active = true;
    if (user && user.role === "admin") {
      apiFetch("/categories").then(res => {
        if (active && res.success) setCategories(res.data || []);
      }).catch(() => { });
    }
    return () => { active = false; };
  }, [user, authLoading]);

  const openCreate = () => {
    reset(EMPTY_FORM);
    setImagesValue("");
    setFormError(""); setFormSuccess("");
    setModalMode("create");
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    const imagesStr = (product.images || []).join(", ");
    reset({
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: product.price,
      salePrice: product.salePrice || 0,
      stock: product.stock,
      images: imagesStr,
      tags: (product.tags || []).join(", "),
      isFeatured: product.isFeatured || false,
      category: product.category?._id || product.category || "",
    });
    setImagesValue(imagesStr);
    setFormError(""); setFormSuccess("");
    setModalMode("edit");
  };

  const closeModal = () => { setModalMode(null); setEditingProduct(null); };

  const onSubmit = async (data) => {
    setSubmitting(true); setFormError(""); setFormSuccess("");
    try {
      const payload = {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: Number(data.price),
        salePrice: Number(data.salePrice) || 0,
        stock: Number(data.stock),
        images: data.images.split(",").map(s => s.trim()).filter(Boolean),
        tags: data.tags ? data.tags.split(",").map(s => s.trim()).filter(Boolean) : [],
        isFeatured: data.isFeatured === true || data.isFeatured === "true",
        category: data.category,
      };

      let res;
      if (modalMode === "create") {
        res = await apiFetch("/products", { method: "POST", body: payload });
      } else {
        res = await apiFetch(`/products/${editingProduct._id}`, { method: "PUT", body: payload });
      }

      if (res.success) {
        setFormSuccess(modalMode === "create" ? "Product created!" : "Product updated!");
        await fetchProducts();
        setTimeout(() => closeModal(), 1000);
      }
    } catch (e) {
      setFormError(e.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await apiFetch(`/products/${confirmDelete._id}`, { method: "DELETE" });
      if (res.success) {
        setConfirmDelete(null);
        await fetchProducts();
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
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">Catalogue Management</p>
          <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">Products</h1>
          <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A96A] text-[#0A1628] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#E5C78F] transition-colors"
        >
          <FiPlus className="w-4 h-4" /> Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..."
          className="w-full bg-[#0A1628] border border-white/10 text-white text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C8A96A]/40 transition-colors placeholder-white/20"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0A1628] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Product", "SKU", "Category", "Price", "Stock", "Featured", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-white/20 text-sm">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-white/20 text-sm">No products found</td></tr>
              ) : products.map((p, i) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover border border-white/10" />
                      )}
                      <div>
                        <p className="text-xs text-white font-semibold truncate max-w-[160px]">{p.name}</p>
                        <p className="text-[10px] text-white/30 truncate max-w-[160px]">{p.description?.slice(0, 40)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[10px] text-white/50 font-mono">{p.sku}</td>
                  <td className="px-5 py-3.5 text-[10px] text-white/60">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white font-bold">${p.price}</span>
                    {p.salePrice > 0 && <span className="text-[10px] text-[#C8A96A] ml-1">(${p.salePrice})</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold ${p.stock < 5 ? "text-red-400" : "text-emerald-400"}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.isFeatured ? (
                      <FiStar className="w-4 h-4 text-[#C8A96A]" />
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-[#C8A96A] transition-colors">
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(p)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="p-1.5 border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 border border-white/10 text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal open={!!modalMode} onClose={closeModal} title={modalMode === "create" ? "Add New Product" : "Edit Product"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Product Name" name="name" register={register} required error={errors.name} />
            <InputField label="SKU" name="sku" register={register} required error={errors.sku} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Description *</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={3}
              className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
            />
            {errors.description && <p className="text-red-400 text-[10px] mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Price ($)" name="price" type="number" register={register} required error={errors.price} />
            <InputField label="Sale Price ($)" name="salePrice" type="number" register={register} />
            <InputField label="Stock" name="stock" type="number" register={register} required error={errors.stock} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-1.5">Category *</label>
            <div className="relative">
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full appearance-none bg-[#0D1B2E] border border-white/10 text-white text-xs pl-3 pr-8 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="" className="bg-[#0D1B2E] text-white/50">Select category...</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id} className="bg-[#0D1B2E] text-white">{c.name}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A96A]/75 pointer-events-none" />
            </div>
            {errors.category && <p className="text-red-400 text-[10px] mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-2">Product Images</label>

            {/* Image Previews */}
            {(() => {
              const imagesList = imagesValue.split(",").map(s => s.trim()).filter(Boolean);
              if (imagesList.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-3 mb-4">
                  {imagesList.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 bg-[#0D1B2E] border border-white/10 rounded-sm overflow-hidden group">
                      <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const newList = imagesList.filter((_, i) => i !== idx);
                          const updated = newList.join(", ");
                          setValue("images", updated, { shouldValidate: true, shouldDirty: true });
                          setImagesValue(updated);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Upload Selector */}
            <div className="flex gap-4 items-stretch mb-4">
              <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#C8A96A]/40 hover:border-[#C8A96A] bg-[#0D1B2E] hover:bg-[#0D1B2E]/60 p-4 rounded-sm cursor-pointer transition-all">
                <FiUpload className={`w-5 h-5 text-[#C8A96A] mb-2 ${uploading ? "animate-bounce" : ""}`} />
                <span className="text-[10px] uppercase tracking-wider text-[#C8A96A] font-bold">
                  {uploading ? "Uploading image..." : "Upload from Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setUploading(true);
                    setUploadError("");
                    try {
                      const formData = new FormData();
                      formData.append("image", file);

                      const res = await apiFetch("/upload", {
                        method: "POST",
                        body: formData,
                      });

                      if (res.success && res.data?.url) {
                        const current = imagesValue || "";
                        const updated = current ? `${current.trim().replace(/,$/, "")}, ${res.data.url}` : res.data.url;
                        setValue("images", updated, { shouldValidate: true, shouldDirty: true });
                        setImagesValue(updated);
                      }
                    } catch (err) {
                      setUploadError(err.message || "Failed to upload image");
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {uploadError && <p className="text-red-400 text-[10px] mb-3">{uploadError}</p>}

            {/* Details panel for manual direct URL editing */}
            <details className="group border border-white/5 bg-white/[0.01] rounded-sm">
              <summary className="list-none flex items-center justify-between px-3 py-2 text-[9px] uppercase tracking-widest text-white/50 font-bold cursor-pointer select-none hover:bg-white/[0.02]">
                <span>Edit Image URLs Directly</span>
                <span className="transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="p-3 border-t border-white/5">
                <textarea
                  {...register("images", { 
                    required: "At least one image URL is required",
                    onChange: (e) => setImagesValue(e.target.value)
                  })}
                  rows={2}
                  placeholder="https://..., https://..."
                  className="w-full bg-[#0D1B2E] border border-white/10 text-white text-xs px-3 py-2.5 rounded-sm focus:border-[#C8A96A]/50 focus:outline-none transition-colors placeholder-white/20"
                />
                {errors.images && <p className="text-red-400 text-[10px] mt-1">{errors.images.message}</p>}
              </div>
            </details>
          </div>
          <InputField label="Tags (comma-separated)" name="tags" register={register} placeholder="luxury, snapback, cashmere" />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isFeatured")}
              id="isFeatured"
              className="w-4 h-4 accent-[#C8A96A]"
            />
            <label htmlFor="isFeatured" className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-semibold cursor-pointer">
              Mark as Featured
            </label>
          </div>

          {formError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2">{formError}</p>}
          {formSuccess && <p className="text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">{formSuccess}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={closeModal} className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white text-[10px] uppercase tracking-widest transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-[#C8A96A] text-[#0A1628] font-bold text-[10px] uppercase tracking-widest hover:bg-[#E5C78F] transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : modalMode === "create" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
