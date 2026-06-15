export const mapBackendProduct = (p) => {
  if (!p) return null;
  
  let colors = [];
  let sizes = [];
  
  if (p.variants && Array.isArray(p.variants)) {
    p.variants.forEach(v => {
      if (v.name.toLowerCase() === "color") {
        const valueLower = v.value.toLowerCase();
        let hex = "#0F2744"; // default Navy Blue
        if (valueLower.includes("gold")) hex = "#C8A96A";
        else if (valueLower.includes("charcoal")) hex = "#1A1A1A";
        else if (valueLower.includes("black")) hex = "#1A1A1A";
        else if (valueLower.includes("white") || valueLower.includes("alabaster")) hex = "#F8F6F1";
        else if (valueLower.includes("grey") || valueLower.includes("gray")) hex = "#7E8082";
        else if (valueLower.includes("brown") || valueLower.includes("tobacco")) hex = "#8B5A2B";
        
        colors.push({
          name: v.value,
          hex: hex,
          secondaryHex: ""
        });
      } else if (v.name.toLowerCase() === "size") {
        sizes.push(v.value);
      }
    });
  }

  // Fallbacks if variants empty
  if (colors.length === 0) {
    colors = [{ name: "Navy & Gold", hex: "#0F2744", secondaryHex: "#C8A96A" }];
  }
  if (sizes.length === 0) {
    sizes = ["Adjustable"];
  }

  return {
    ...p,
    id: p._id,
    price: p.salePrice > 0 ? p.salePrice : p.price,
    originalPrice: p.price,
    salePrice: p.salePrice,
    category: p.category && typeof p.category === "object" ? p.category.name : "Classic",
    colors,
    sizes,
    tags: p.tags && p.tags.length > 0 ? p.tags : ["Best Seller"],
    details: p.details || [
      "Structured 6-panel premium design",
      "Handcrafted emblem detailing",
      "Adjustable custom buckle strap",
      "Satin inner lining for elite comfort"
    ]
  };
};
