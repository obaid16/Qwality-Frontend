"use client";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

export default function FAQPage() {
  const faqList = [
    {
      q: "How long does shipping take?",
      a: "Standard delivery takes 3-5 business days. For custom monogram caps, please allow an additional 2-3 business days for hand-alignment and gold thread embroidery in our London studio.",
    },
    {
      q: "Can I return a custom monogrammed cap?",
      a: "Bespoke monogrammed caps are created strictly to order and cannot be returned. Non-custom items can be returned in pristine, unworn condition with tags attached within 14 days of delivery.",
    },
    {
      q: "Where do you source your cashmere and suede?",
      a: "Our cashmere is acquired from certified eco-farms in the Himalayan hills. Our calfskin suede is sourced directly from historic, family-run tanneries in Tuscany, Italy.",
    },
    {
      q: "How should I clean my Quality Cap?",
      a: "Suede caps should be brushed gently with a soft suede brush. Cashmere and wool caps should be dry cleaned only to prevent shrinkage and thread damage.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[120px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Customer Registry Support</span>
            <h1 className="font-luxury text-3xl md:text-5xl font-extrabold tracking-widest text-brand-navy">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-4" />
          </div>

          <div className="space-y-4">
            {faqList.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className="bg-white border border-brand-navy/10 rounded-sm overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-brand-white/20 transition-colors"
                  >
                    <span className="font-luxury text-brand-navy text-sm font-bold tracking-wider">{faq.q}</span>
                    {isOpen ? <FiChevronUp className="text-brand-gold w-5 h-5" /> : <FiChevronDown className="text-brand-gold w-5 h-5" />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-brand-charcoal/70 leading-relaxed font-light border-t border-brand-navy/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
