"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-100 bg-brand-navy flex flex-col justify-center items-center select-none"
        >
          <div className="text-center relative">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-luxury text-brand-gold text-4xl md:text-5xl font-extrabold tracking-[0.3em] uppercase"
            >
              QWALITY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[10px] tracking-[0.5em] text-brand-white uppercase mt-2"
            >
              HANDCRAFTED EXCELLENCE
            </motion.p>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto mt-6 overflow-hidden relative">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute top-0 bottom-0 w-8 bg-brand-white"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
