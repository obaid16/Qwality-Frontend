import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider as CustomAuthProvider } from "@/context/AuthContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Quality Caps | Premium Handcrafted Headwear",
  description: "Experience the pinnacle of luxury headwear. Custom embroidery, premium materials, and timeless style. Handcrafted by Quality Caps.",
  metadataBase: new URL("https://qwality-caps.vercel.app"),
  openGraph: {
    title: "Quality Caps | Premium Handcrafted Headwear",
    description: "Experience the pinnacle of luxury headwear.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full font-sans bg-[#F8F6F1] text-[#1A1A1A] antialiased selection:bg-[#C8A96A] selection:text-[#0F2744]">
        <CustomAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CustomAuthProvider>
      </body>
    </html>
  );
}
