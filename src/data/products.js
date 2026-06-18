export const mockProducts = [
  {
    id: 1,
    name: "The Windsor Gold Classic",
    price: 125,
    rating: 4.9,
    reviewCount: 128,
    category: "Classic",
    tags: ["Featured", "Best Seller"],
    description: "An elegant tribute to heritage style. Crafted from imported premium organic wool blend and featuring our signature hand-stitched crest in pure gold thread.",
    details: [
      "80% Merino Wool, 20% Premium Cashmere",
      "Adjustable gold-plated brass buckle strap",
      "Satin inner lining for ultimate comfort",
      "Structured 6-panel profile"
    ],
    sizes: ["Adjustable", "S/M", "L/XL"],
    colors: [
      { name: "Navy & Gold", hex: "#0F2744", secondaryHex: "#C8A96A" },
      { name: "Charcoal & Gold", hex: "#1A1A1A", secondaryHex: "#C8A96A" },
      { name: "Royal Gold", hex: "#C8A96A", secondaryHex: "#F8F6F1" }
    ],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Lord Alistair", rating: 5, date: "May 12, 2026", comment: "Absolutely marvelous craftsmanship. The satin lining feels incredibly soft." },
      { id: 2, user: "Victoria S.", rating: 5, date: "June 2, 2026", comment: "Stunning detail. The gold buckle adds a perfect high-end finish." }
    ]
  },
  {
    id: 2,
    name: "Monarch Suede Cap",
    price: 145,
    rating: 4.8,
    reviewCount: 94,
    category: "Suede",
    tags: ["Best Seller"],
    description: "Luxuriously soft premium calfskin suede cap. Handcrafted in Italy with custom embossed emblems, offering an understated casual sophistication.",
    details: [
      "100% Genuine Italian Calf Suede",
      "Breathable perforated side panel details",
      "Embossed rear leather adjuster strap",
      "Unstructured crown for a modern relaxed fit"
    ],
    sizes: ["Adjustable"],
    colors: [
      { name: "Tobacco Brown", hex: "#8B5A2B", secondaryHex: "" },
      { name: "Midnight Navy", hex: "#0F2744", secondaryHex: "" },
      { name: "Slate Charcoal", hex: "#3A3A3A", secondaryHex: "" }
    ],
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Julian K.", rating: 5, date: "April 29, 2026", comment: "The quality of the suede is unmatched. Will buy the Navy next." }
    ]
  },
  {
    id: 3,
    name: "Imperial Cashmere Knit",
    price: 185,
    rating: 5.0,
    reviewCount: 47,
    category: "Cashmere",
    tags: ["New Arrival", "Featured"],
    description: "The ultimate in comfort and warmth. Knitted from 100% pure Himalayan cashmere, styled with a sophisticated fold-up cuff and subtle gold accent badge.",
    details: [
      "100% Mongolian Grade-A Cashmere",
      "Ultra-soft ribbed knit weave",
      "Hypoallergenic and naturally temperature-regulating",
      "Includes premium hard-shell presentation box"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Alabaster White", hex: "#F8F6F1", secondaryHex: "" },
      { name: "Classic Navy", hex: "#0F2744", secondaryHex: "" },
      { name: "Obsidian Black", hex: "#1A1A1A", secondaryHex: "" }
    ],
    images: [
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Sophia M.", rating: 5, date: "May 18, 2026", comment: "So soft and cozy! Fits perfectly and looks incredibly elegant." }
    ]
  },
  {
    id: 4,
    name: "The President's Club Linen",
    price: 115,
    rating: 4.7,
    reviewCount: 62,
    category: "Linen",
    tags: ["New Arrival"],
    description: "Lightweight and breathable Irish linen for warm afternoons. Designed with a curved visor, gold-accent eyelets, and an adjustable strap.",
    details: [
      "100% Organic Irish Linen",
      "Moisture-wicking internal sweatband",
      "Signature engraved gold ventilation eyelets",
      "Curved brim structure"
    ],
    sizes: ["Adjustable", "S/M", "L/XL"],
    colors: [
      { name: "Ivory", hex: "#EAE6DF", secondaryHex: "" },
      { name: "Navy Accent", hex: "#0F2744", secondaryHex: "" }
    ],
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Marcus T.", rating: 4, date: "June 1, 2026", comment: "Perfect for golfing or yacht trips. Very breathable." }
    ]
  },
  {
    id: 5,
    name: "Elite Signature Herringbone",
    price: 135,
    rating: 4.9,
    reviewCount: 81,
    category: "Classic",
    tags: ["Featured"],
    description: "Traditional herringbone pattern blended with modern sportswear lines. Handcrafted with British tweed panels and leather brim piping.",
    details: [
      "Virgin Wool Tweed herringbone pattern",
      "Full grain calfskin visor trim",
      "Breathable cotton twill lining",
      "Brass buckle closure"
    ],
    sizes: ["S/M", "L/XL"],
    colors: [
      { name: "Grey Herringbone", hex: "#7E8082", secondaryHex: "" },
      { name: "Navy Herringbone", hex: "#1D2A3A", secondaryHex: "" }
    ],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Arthur P.", rating: 5, date: "March 15, 2026", comment: "The combination of herringbone tweed and leather is gorgeous." }
    ]
  },
  {
    id: 6,
    name: "Custom Monogram Signature",
    price: 160,
    rating: 5.0,
    reviewCount: 204,
    category: "Custom",
    tags: ["Best Seller", "Featured"],
    description: "Tailor-made for the connoisseur. Customize with your initials embroidered in gold bullion thread on premium velvet-touch structure.",
    details: [
      "Heavyweight luxury cotton-velvet fabric",
      "Bespoke gold bullion monogram service",
      "Handcrafted to order by senior seamstresses",
      "Comes with customized gold-foiled tag"
    ],
    sizes: ["Adjustable"],
    colors: [
      { name: "Royal Gold & Navy", hex: "#0F2744", secondaryHex: "#C8A96A" },
      { name: "Emperor Gold & Black", hex: "#1A1A1A", secondaryHex: "#C8A96A" }
    ],
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&q=80&w=800"
    ],
    reviews: [
      { id: 1, user: "Charles D.", rating: 5, date: "February 24, 2026", comment: "The custom embroidery is absolutely perfect. It stands out in any crowd." }
    ]
  }
];
