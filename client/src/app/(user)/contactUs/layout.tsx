"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "IQ Architects | Contact Us";
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Discover With Bangladesh's Best Architecture Firm IQ ARCHITECTS LTD for innovative architecture and stunning landscape design. Explore our expertise in planning, decoration, interior, exterior and building design for your dream space."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Discover With Bangladesh's Best Architecture Firm IQ ARCHITECTS LTD for innovative architecture and stunning landscape design. Explore our expertise in planning, decoration, interior, exterior and building design for your dream space.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div>
        <Navbar/>
      {children}
      <Footer />
    </div>
  );
}
