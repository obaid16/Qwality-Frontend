"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

export default function TermsPage() {
  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[120px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto px-6 space-y-8 text-sm text-brand-charcoal/80 leading-relaxed font-light">
          <h1 className="font-luxury text-3xl font-extrabold tracking-widest text-brand-navy text-center uppercase mb-8">
            Terms & Conditions
          </h1>

          <p>
            Welcome to the official digital portal of Qwality Caps & Co. By browsing or placing orders on this platform, you agree to comply with the terms below.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Bespoke Orders</h3>
          <p>
            Because custom monogram caps are handcrafted specifically to client request parameters, we cannot offer refunds or order modifications once embroidery work has commenced.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Intellectual Rights</h3>
          <p>
            The crest, logo designs, product titles, custom materials layout, and media items displayed on this portal represent the intellectual property of Qwality Caps & Co. and may not be copied or reproduced.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Limitation of Liability</h3>
          <p>
            We curate our products with supreme focus on excellence. However, Qwality Caps is not liable for incidental damage resulting from normal product wear, washing machine accidents, or general user misuse.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
