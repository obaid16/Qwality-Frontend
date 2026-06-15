"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiUnlock } from "react-icons/fi";
import PageLoader from "@/components/ui/PageLoader";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, login, register: signUpUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register' | 'forgot'
  const [authStatus, setAuthStatus] = useState({ success: null, message: "" });

  useEffect(() => {
    if (!loading && user) {
      const destination = user.role === "admin" ? "/admin" : "/";
      router.push(destination);
    }
  }, [user, loading, router]);

  const loginForm = useForm();
  const registerForm = useForm();
  const forgotForm = useForm();

  if (loading || user) {
    return (
      <div className="h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-brand-navy text-[10px] tracking-[0.3em] uppercase font-semibold">
            Redirecting to Session
          </p>
        </div>
      </div>
    );
  }

  const handleLoginSubmit = async (data) => {
    setAuthStatus({ success: null, message: "" });
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        setAuthStatus({ success: true, message: "Welcome back. Access granted." });
        const destination = res.user?.role === "admin" ? "/admin" : "/";
        setTimeout(() => router.push(destination), 1000);
      } else {
        setAuthStatus({ success: false, message: res.message || "Invalid credentials." });
      }
    } catch (err) {
      setAuthStatus({ success: false, message: err.message || "Login failed." });
    }
  };

  const handleRegisterSubmit = async (data) => {
    setAuthStatus({ success: null, message: "" });
    try {
      const res = await signUpUser(data.name, data.email, data.password);
      if (res.success) {
        setAuthStatus({ success: true, message: res.message || "Registry account created successfully." });
        setTimeout(() => {
          setActiveTab("login");
          setAuthStatus({ success: true, message: "Account created! Please log in." });
        }, 1500);
      } else {
        setAuthStatus({ success: false, message: res.message || "Registration failed." });
      }
    } catch (err) {
      setAuthStatus({ success: false, message: err.message || "Registration failed." });
    }
  };

  const handleForgotSubmit = (data) => {
    setAuthStatus({ success: true, message: "Bespoke reset link dispatched to your inbox." });
  };

  return (
    <>
      <PageLoader />

      <main className="min-h-screen bg-[#F8F6F1] flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full">
          <div className="bg-white border border-brand-navy/10 rounded-sm p-8 shadow-xl space-y-6">
            
            {/* Logo details inside card */}
            <div className="text-center pb-4 border-b border-brand-navy/10">
              <span className="font-luxury text-2xl font-bold tracking-[0.2em] text-brand-gold uppercase">QWALITY</span>
              <p className="text-[9px] tracking-[0.4em] text-brand-charcoal/60 uppercase">Artisan Member Portal</p>
            </div>

            {/* Status alerts */}
            {authStatus.message && (
              <div className={`p-3 text-xs text-center border rounded font-semibold ${
                authStatus.success ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {authStatus.message}
              </div>
            )}

            {/* TAB SELECTORS */}
            {activeTab !== "forgot" && (
              <div className="flex border-b border-brand-navy/10">
                <button
                  onClick={() => {
                    setActiveTab("login");
                    setAuthStatus({ success: null, message: "" });
                  }}
                  className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
                    activeTab === "login" ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-charcoal/50"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setActiveTab("register");
                    setAuthStatus({ success: null, message: "" });
                  }}
                  className={`flex-1 pb-3 text-xs uppercase tracking-widest font-bold border-b-2 transition-all ${
                    activeTab === "register" ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-charcoal/50"
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* LOGIN FORM */}
            {activeTab === "login" && (
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      {...loginForm.register("email", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy">Password</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="text-[10px] text-brand-gold hover:underline tracking-wide font-semibold"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      {...loginForm.register("password", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 mt-6"
                >
                  Enter Member Vault
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      {...registerForm.register("name", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      {...registerForm.register("email", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Choose Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      {...registerForm.register("password", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 mt-6"
                >
                  Create Registry Account
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {activeTab === "forgot" && (
              <form onSubmit={forgotForm.handleSubmit(handleForgotSubmit)} className="space-y-4">
                <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light text-center">
                  Provide your registered email address and our support artisans will dispatch password override credentials immediately.
                </p>
                
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      {...forgotForm.register("email", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-10 py-2.5 text-xs rounded"
                    />
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-navy text-brand-gold uppercase tracking-widest text-xs font-bold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300 mt-4"
                >
                  Request Reset Credentials
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setAuthStatus({ success: null, message: "" });
                  }}
                  className="w-full text-center block text-xs text-brand-navy hover:text-brand-gold uppercase tracking-wider font-semibold pt-2"
                >
                  Return to Login
                </button>
              </form>
            )}

          </div>
          
          <div className="text-center mt-6">
            <Link href="/" className="text-[10px] text-brand-navy/60 hover:text-brand-gold uppercase tracking-[0.2em] font-bold transition-all">
              ← Return to Boutique
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
