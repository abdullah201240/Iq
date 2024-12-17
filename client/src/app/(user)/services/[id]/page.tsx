"use client";

import Navbar from "@/components/Navbar";
import ServicesTitle from "@/components/ServicesTitle";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Whatsapp from "@/components/Whatsapp";
import about from "@/app/assets/img/abg.webp"; // Correctly imported image

interface Service {
    title: string;
    subTitle: string,
    logo: string;
    image: string;
    description: string;
    mainTitle: string;
  }

export default function Page() {
  const params = useParams();
  const id = params?.id; // Safely access the 'id' parameter
  const [service, setService] = useState<Service | null>(null);
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/servives/${id}`)
        .then((response) => response.json())
        .then((data) => setService(data))
        .catch((error) => {
          console.error("Error fetching service data:", error);
        });
    }
  }, [id]);
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      {/* Services Title Component */}
      <ServicesTitle
              title={service?.title || "Loading..."}
              subTitle={service?.subTitle || "Loading..."}
              backgroundImage={about.src}

      />

      {/* Image Component */}
      <div className="flex justify-center items-center mt-8">
      
      <Image
        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${service?.image}`}
        alt="image"
        width={800} // Updated width
        height={800} // Updated height
        priority // Optional for faster loading
      />


      </div>

      <div className="bg-white py-12 px-6 lg:pl-26 ">
  <div className="max-w-7xl mx-auto text-left">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">
{service?.mainTitle}
    </h2>
    <p className="text-lg text-gray-600 leading-relaxed mb-8">
    {service?.description}

    </p>
   
    
   
  </div>
</div>
<Footer/>
<Whatsapp/>

    </div>
  );
}
