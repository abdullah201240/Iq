"use client";

import { useEffect } from "react";
import ServicesTitle from '@/components/ServicesTitle';
import dynamic from "next/dynamic"; // For dynamic imports
import about from "@/app/assets/img/abg.webp"; // Correctly imported image

// Dynamically importing components that may rely on browser-specific APIs
const ServiceArea = dynamic(() => import('@/components/ServiceArea'), { ssr: false });
const ContactForm = dynamic(() => import('@/components/ContactForm'), { ssr: false });
const ContactMap = dynamic(() => import('@/components/ContactMap'), { ssr: false });
const Whatsapp = dynamic(() => import('@/components/Whatsapp'), { ssr: false });

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Rendering on client-side only");
    }
  }, []);

  return (
    <div>
      <ServicesTitle 
        title="Contact Us"
        subTitle="Ready to bring your vision to life? Contact our architecture firm today! Visit our Contact Us page for inquiries and let’s create something amazing together."
        backgroundImage={about.src}

      />
      <ServiceArea />
      <ContactForm />
      <ContactMap />
      <Whatsapp />
      <br />
    </div>
  );
}
