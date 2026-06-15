"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiUsers, FiChevronLeft, FiChevronRight,
  FiLock, FiUnlock, FiShield, FiSearch, FiTrash2
} from "react-icons/fi";
import { apiFetch } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      const res = await apiFetch(`/users?${params}`);
      if (res.success) {
        let items = res.data.items || res.data || [];
        if (search) {
          const q = search.toLowerCase();
          items = items.filter(u =>
            u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
          );
        }
        setUsers(items);
        setTotalPages(Math.ceil((res.data.total || items.length || 1) / 15));
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
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchUsers, user, authLoading]);

  const handleToggleBlock = async (userId, currentlyBlocked) => {
    setTogglingId(userId);
    try {
      const res = await apiFetch(`/users/${userId}/block`, { method: "PUT" });
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: !currentlyBlocked } : u));
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);
    try {
      const res = await apiFetch(`/users/${userId}`, { method: "DELETE" });
      if (res.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        setDeletingUser(null);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A] font-semibold mb-1">Customer Registry</p>
          <h1 className="font-luxury text-3xl font-bold text-white tracking-wider">Users</h1>
          <div className="h-[1px] w-16 bg-[#C8A96A]/40 mt-3" />
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="w-full bg-[#0A1628] border border-white/10 text-white text-xs pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C8A96A]/40 transition-colors placeholder-white/20"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0A1628] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["User", "Email", "Role", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] uppercase tracking-[0.2em] text-white/30 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/20 text-sm">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-white/20 text-sm">No users found</td></tr>
              ) : users.map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#C8A96A]/20 border border-[#C8A96A]/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C8A96A] text-[11px] font-bold">{user.name?.[0]?.toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-white font-semibold">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-white/50">{user.email}</td>
                  <td className="px-5 py-3.5">
                    {user.role === "admin" ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#C8A96A] font-bold uppercase tracking-wider">
                        <FiShield className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 uppercase tracking-wider">Customer</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-sm border ${
                      user.isBlocked
                        ? "bg-red-500/15 text-red-400 border-red-500/20"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[10px] text-white/30">
                    {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    {user.role !== "admin" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          disabled={togglingId === user._id}
                          className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border transition-all disabled:opacity-50 ${
                            user.isBlocked
                              ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                              : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          {togglingId === user._id ? (
                            <span>Updating...</span>
                          ) : user.isBlocked ? (
                            <><FiUnlock className="w-3 h-3" /> Unblock</>
                          ) : (
                            <><FiLock className="w-3 h-3" /> Block</>
                          )}
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <FiTrash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#060B13]/80 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#0D1B2E] border border-white/10 p-6 rounded-sm max-w-sm w-full shadow-2xl text-center space-y-6 animate-scaleIn">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <FiTrash2 className="w-5 h-5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-luxury text-lg font-bold text-white tracking-wider uppercase text-brand-gold">Delete Account</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                Are you certain you wish to delete the registry user <strong className="text-white font-semibold">{deletingUser.name}</strong> (<span className="font-mono">{deletingUser.email}</span>)? This action is permanent and cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeletingUser(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-transparent border border-white/10 hover:border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deletingUser._id)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
