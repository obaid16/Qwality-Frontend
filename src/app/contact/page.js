"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    setSubmitted(true);
    reset();
  };

  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Artisan Consultation</span>
            <h1 className="font-luxury text-3xl md:text-5xl font-extrabold tracking-widest text-brand-navy">
              CONTACT US
            </h1>
            <p className="text-sm text-brand-charcoal/60 font-light">
              Connect with our boutique support agents or custom designers for personal commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6">
                <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-base">
                  Corporate Offices
                </h3>
                
                <div className="flex gap-4 text-xs font-semibold text-brand-charcoal/70">
                  <FiMapPin className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-navy">Headquarters</p>
                    <p className="mt-1 font-light">
                      45 Savile Row, Mayfair, London, W1S 3QG, United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-semibold text-brand-charcoal/70">
                  <FiPhone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-navy">Bespoke Concierge Line</p>
                    <p className="mt-1 font-light">+44 (0) 20 7946 0984</p>
                  </div>
                </div>

                <div className="flex gap-4 text-xs font-semibold text-brand-charcoal/70">
                  <FiMail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                  <div>
                    <p className="font-bold text-brand-navy">General Inquiries</p>
                    <p className="mt-1 font-light">concierge@qwality-caps.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Custom Message Form */}
            <div className="lg:col-span-7 bg-white border border-brand-navy/10 rounded-sm p-8 space-y-6">
              <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-base border-b border-brand-navy/10 pb-4">
                Consult an Artisan
              </h3>

              {submitted ? (
                <div className="p-6 text-center space-y-4">
                  <FiCheckCircle className="w-12 h-12 text-brand-gold mx-auto" />
                  <h4 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-sm">Message Transmitted</h4>
                  <p className="text-xs text-brand-charcoal/60 leading-relaxed font-light">
                    We have received your request. An artisan consultant will contact you within 24 business hours to address your commission inquiry.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="px-4 py-2 border border-brand-navy/20 text-xs font-bold uppercase tracking-wider text-brand-navy mt-4">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Your Name</label>
                      <input
                        type="text"
                        {...register("name", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.name && <span className="text-[10px] text-red-500 mt-1 block">Name is required</span>}
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Email Address</label>
                      <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                      />
                      {errors.email && <span className="text-[10px] text-red-500 mt-1 block">Email is required</span>}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Subject</label>
                    <input
                      type="text"
                      {...register("subject", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                    />
                    {errors.subject && <span className="text-[10px] text-red-500 mt-1 block">Subject is required</span>}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest font-semibold text-brand-navy block mb-2">Message Commission details</label>
                    <textarea
                      rows={5}
                      {...register("message", { required: true })}
                      className="w-full bg-brand-white border border-brand-navy/15 px-4 py-2.5 text-xs rounded"
                    />
                    {errors.message && <span className="text-[10px] text-red-500 mt-1 block">Message is required</span>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-navy text-brand-gold border border-brand-gold/30 hover:bg-brand-gold hover:text-brand-navy uppercase tracking-widest text-xs font-bold transition-all duration-300 shadow-md"
                  >
                    Send Commission Request
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
