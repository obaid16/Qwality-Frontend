"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/utils/api";

const AuthContext = createContext();

const mapUser = (apiUser, apiOrders = []) => {
  if (!apiUser) return null;
  return {
    ...apiUser,
    id: apiUser._id,
    addresses: (apiUser.addresses || []).map(addr => ({
      ...addr,
      id: addr._id,
    })),
    orders: (apiOrders || []).map(order => ({
      ...order,
      id: order._id || order.id,
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      total: order.total,
      items: (order.items || []).map(item => ({
        ...item,
        name: item.name,
        qty: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      }))
    }))
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth session on startup
  const checkAuth = async () => {
    try {
      const profileRes = await apiFetch("/users/profile");
      if (profileRes.success && profileRes.data) {
        let orders = [];
        try {
          const ordersRes = await apiFetch("/orders/my-orders");
          if (ordersRes.success) {
            orders = ordersRes.data.items || [];
          }
        } catch (e) {
          console.error("Failed to fetch user orders:", e);
        }
        setUser(mapUser(profileRes.data, orders));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("No active user session found on start.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res.success && res.data) {
        let orders = [];
        try {
          const ordersRes = await apiFetch("/orders/my-orders");
          if (ordersRes.success) {
            orders = ordersRes.data.items || [];
          }
        } catch (e) {
          console.error("Failed to fetch orders on login:", e);
        }
        const loggedInUser = mapUser(res.data.user, orders);
        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (error) {
      return { success: false, message: error.message || "Invalid email or password" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });

      if (res.success) {
        // Automatically login on registration if verifyEmail is simulated
        // Or return successful status for user feedback
        return { success: true, message: "Registered successfully! Verification email sent." };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (error) {
      return { success: false, message: error.message || "Email address is already in use" };
    }
  };

  const logout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (updatedProfile) => {
    try {
      const res = await apiFetch("/users/profile", {
        method: "PUT",
        body: updatedProfile,
      });
      if (res.success) {
        setUser(prev => ({
          ...prev,
          name: res.data.name,
          phone: res.data.phone,
        }));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const addAddress = async (address) => {
    try {
      const res = await apiFetch("/users/addresses", {
        method: "POST",
        body: address,
      });
      if (res.success) {
        setUser(prev => ({
          ...prev,
          addresses: res.data.map(addr => ({ ...addr, id: addr._id })),
        }));
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      throw error;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await apiFetch(`/users/addresses/${addressId}`, {
        method: "DELETE",
      });
      if (res.success) {
        setUser(prev => ({
          ...prev,
          addresses: res.data.map(addr => ({ ...addr, id: addr._id })),
        }));
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
      throw error;
    }
  };

  const addOrder = async (order) => {
    // Orders are placed via CheckoutPage calling OrderService/placeOrder api.
    // Refresh user profile / orders listing from backend
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        addOrder,
        refreshSession: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
