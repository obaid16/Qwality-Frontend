"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "@/utils/api";

const CartContext = createContext();

const mapApiCart = (apiCart) => {
  if (!apiCart || !apiCart.items) return [];
  return apiCart.items.map((item) => {
    const prod = item.product;
    if (!prod) return null;
    return {
      id: prod._id,
      name: prod.name,
      price: Math.round((prod.salePrice > 0 ? prod.salePrice : prod.price) * 83),
      quantity: item.quantity,
      selectedColor: { name: item.color || "Default" },
      selectedSize: item.size || "Adjustable",
      images: prod.images || [],
    };
  }).filter(Boolean);
};

const mapApiWishlist = (apiWishlist) => {
  if (!apiWishlist || !apiWishlist.products) return [];
  return apiWishlist.products.map((prod) => ({
    id: prod._id,
    name: prod.name,
    price: Math.round((prod.salePrice > 0 ? prod.salePrice : prod.price) * 83),
    images: prod.images || [],
    colors: prod.colors || [],
    sizes: prod.sizes || [],
  }));
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  // Load Cart & Wishlist on Startup or user change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        // Fetch from API
        const loadUserCartAndWishlist = async () => {
          try {
            const cartRes = await apiFetch("/carts");
            if (cartRes.success) {
              setCart(mapApiCart(cartRes.data));
            }
          } catch (e) {
            console.error("Error fetching user cart:", e);
          }

          try {
            const wishlistRes = await apiFetch("/wishlists");
            if (wishlistRes.success) {
              setWishlist(mapApiWishlist(wishlistRes.data));
            }
          } catch (e) {
            console.error("Error fetching user wishlist:", e);
          }
        };
        loadUserCartAndWishlist();
      } else {
        // Fetch from LocalStorage
        const savedCart = localStorage.getItem("qc_cart");
        const savedWishlist = localStorage.getItem("qc_wishlist");
        if (savedCart) setCart(JSON.parse(savedCart));
        else setCart([]);
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        else setWishlist([]);
      }
      setPromoCode("");
      setCoupon(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Sync state helpers
  const saveLocalCart = (newCart) => {
    setCart(newCart);
    if (!user) {
      localStorage.setItem("qc_cart", JSON.stringify(newCart));
    }
  };

  const saveLocalWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    if (!user) {
      localStorage.setItem("qc_wishlist", JSON.stringify(newWishlist));
    }
  };

  const addToCart = async (product, quantity = 1, selectedColor, selectedSize) => {
    const colorName = selectedColor?.name || (product.colors && product.colors[0]?.name) || "Default";
    const sizeName = selectedSize || (product.sizes && product.sizes[0]) || "Adjustable";

    if (user) {
      try {
        const res = await apiFetch("/carts/add", {
          method: "POST",
          body: {
            productId: product.id || product._id,
            quantity,
            color: colorName,
            size: sizeName,
          },
        });
        if (res.success) {
          setCart(mapApiCart(res.data));
        }
      } catch (error) {
        console.error("Failed to add to cart in backend:", error);
      }
    } else {
      const existingIndex = cart.findIndex(
        (item) =>
          item.id === product.id &&
          item.selectedColor?.name === colorName &&
          item.selectedSize === sizeName
      );

      if (existingIndex > -1) {
        const newCart = [...cart];
        newCart[existingIndex].quantity += quantity;
        saveLocalCart(newCart);
      } else {
        saveLocalCart([
          ...cart,
          {
            id: product.id || product._id,
            name: product.name,
            price: product.salePrice > 0 ? product.salePrice : product.price,
            quantity,
            selectedColor: selectedColor || (product.colors && product.colors[0]) || { name: "Default" },
            selectedSize: sizeName,
            images: product.images || [],
          },
        ]);
      }
    }
  };

  const updateQuantity = async (productId, selectedColorName, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColorName, selectedSize);
      return;
    }

    if (user) {
      try {
        const res = await apiFetch("/carts/update", {
          method: "PUT",
          body: {
            productId,
            color: selectedColorName,
            size: selectedSize,
            quantity,
          },
        });
        if (res.success) {
          setCart(mapApiCart(res.data));
        }
      } catch (error) {
        console.error("Failed to update cart quantity in backend:", error);
      }
    } else {
      const newCart = cart.map((item) => {
        if (
          item.id === productId &&
          item.selectedColor?.name === selectedColorName &&
          item.selectedSize === selectedSize
        ) {
          return { ...item, quantity };
        }
        return item;
      });
      saveLocalCart(newCart);
    }
  };

  const removeFromCart = async (productId, selectedColorName, selectedSize) => {
    if (user) {
      try {
        const res = await apiFetch("/carts/remove", {
          method: "POST",
          body: {
            productId,
            color: selectedColorName,
            size: selectedSize,
          },
        });
        if (res.success) {
          setCart(mapApiCart(res.data));
        }
      } catch (error) {
        console.error("Failed to remove from cart in backend:", error);
      }
    } else {
      const newCart = cart.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedColor?.name === selectedColorName &&
            item.selectedSize === selectedSize
          )
      );
      saveLocalCart(newCart);
    }
  };

  const toggleWishlist = async (product) => {
    if (user) {
      try {
        const res = await apiFetch("/wishlists/toggle", {
          method: "POST",
          body: {
            productId: product.id || product._id,
          },
        });
        if (res.success) {
          setWishlist(mapApiWishlist(res.data));
        }
      } catch (error) {
        console.error("Failed to toggle wishlist in backend:", error);
      }
    } else {
      const exists = wishlist.some((item) => item.id === product.id);
      if (exists) {
        saveLocalWishlist(wishlist.filter((item) => item.id !== product.id));
      } else {
        saveLocalWishlist([...wishlist, product]);
      }
    }
  };

  const applyPromo = async (code) => {
    setPromoCode(code);
    const subtotal = getSubtotal();

    if (user) {
      try {
        const res = await apiFetch("/coupons/validate", {
          method: "POST",
          body: { code, orderAmount: subtotal / 83 },
        });
        if (res.success && res.data) {
          setCoupon(res.data);
          return { success: true, message: `Promo applied: ${res.data.discountType === "percentage" ? res.data.discountValue + "%" : "₹" + Math.round(res.data.discountValue * 83)} off!` };
        }
      } catch (error) {
        setCoupon(null);
        return { success: false, message: error.message || "Invalid code" };
      }
    } else {
      // Local fallback for guest codes
      if (code.toUpperCase() === "GOLDEN") {
        setCoupon({
          code: "GOLDEN",
          discountType: "percentage",
          discountValue: 20,
        });
        return { success: true, message: "Promo applied: 20% off!" };
      }
    }
    return { success: false, message: "Invalid code" };
  };

  const clearCart = () => {
    if (user) {
      // Clear cart in backend
      apiFetch("/carts/clear", {
        method: "DELETE",
      }).catch(e => console.error("Failed to clear cart:", e));
    }
    saveLocalCart([]);
    setCoupon(null);
    setPromoCode("");
  };

  const getSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getSubtotal();
    if (coupon.discountType === "percentage") {
      let discountVal = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount > 0 && discountVal > (coupon.maxDiscountAmount * 83)) {
        discountVal = coupon.maxDiscountAmount * 83;
      }
      return discountVal;
    } else {
      return coupon.discountValue * 83;
    }
  };

  const getShipping = () => {
    return getSubtotal() > (150 * 83) || getSubtotal() === 0 ? 0 : (15 * 83);
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShipping();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        promoCode,
        coupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleWishlist,
        applyPromo,
        clearCart,
        subtotal: getSubtotal(),
        discountAmount: getDiscountAmount(),
        shipping: getShipping(),
        total: getTotal(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
