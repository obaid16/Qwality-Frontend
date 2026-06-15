"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

export default function PrivacyPage() {
  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-3xl mx-auto px-6 space-y-8 text-sm text-brand-charcoal/80 leading-relaxed font-light">
          <h1 className="font-luxury text-3xl font-extrabold tracking-widest text-brand-navy text-center uppercase mb-8">
            Privacy Policy
          </h1>

          <p>
            At Qwality Caps & Co., we operate with absolute discretion. We understand that your privacy is paramount. This Privacy Policy documents how we process user data across our platform.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Data Collection</h3>
          <p>
            We collect only necessary information to process transaction orders (shipping details, email addresses, contact numbers, and billing preferences). No details are sold or redistributed to third-party advertisers.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Cookie Discretion</h3>
          <p>
            Our website uses cookies solely to remember session statuses (such as maintaining your active shopping cart selections and member login status). You can disable cookies inside your browser settings at any time.
          </p>

          <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm mt-6">Secure Encryption</h3>
          <p>
            All checkout transactions are encrypted using Industry standard SSL certifications. We do not store full credit card credentials on our servers.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
