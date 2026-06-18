"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/ui/PageLoader";

export default function AboutPage() {
  return (
    <>
      <PageLoader />
      <Navbar />

      <main className="flex-grow pt-[88px] pb-24 bg-[#F8F6F1]">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs uppercase text-brand-gold tracking-[0.3em] font-semibold">Our Heritage</span>
            <h1 className="font-luxury text-3xl md:text-5xl font-extrabold tracking-widest text-brand-navy">
              QWALITY CAPS STORY
            </h1>
            <div className="h-[1px] w-20 bg-brand-gold mx-auto mt-4" />
          </div>

          {/* Intro Banner */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-brand-navy/10 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=1200"
              alt="Artisan cap workspace"
              className="w-full h-full object-cover animate-fade-in"
            />
          </div>

          {/* Narrative Content */}
          <div className="space-y-8 text-sm text-brand-charcoal/80 leading-relaxed font-light">
            <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-base">The Philosophy of Handcraft</h3>
            <p>
              In a world dominated by rapid automated manufacturing, Quality Caps stands as a sanctuary for traditional luxury. Founded with the conviction that headwear should be treated with the same meticulous craftsmanship as bespoke suits and fine watches, we source only the most premium organic elements: Mongolian cashmere, genuine calf suede, and solid bullion threads.
            </p>
            <p>
              Every single cap is individually hand-assembled by senior milliners. The process is deliberate and precise: the internal satin lining is stitched manually, visor structures are custom-pressed to prevent distortion, and all initial monograms are hand-aligned to ensure geometric perfection.
            </p>

            <h3 className="font-luxury text-brand-navy font-bold uppercase tracking-wider text-base mt-8">Premium Sourcing & Responsibility</h3>
            <p>
              Luxury is only complete when it operates with absolute integrity. We partner directly with sustainable cooperatives in the Himalayan foothills to acquire Grade-A raw cashmere, and work exclusively with family-owned Italian tanneries that practice natural vegetable tanning. 
            </p>
            <p>
              By purchasing a Quality Cap, you join a registry of individuals who value timeless design, quiet elegance, and sustainable quality. We hope our creations accompany your finest journeys.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
