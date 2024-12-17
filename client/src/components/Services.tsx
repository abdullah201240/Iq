"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ServicesImg from "@/app/assets/img/ServicesImg.webp"; // Import the image
import Link from "next/link";

// Define the type for a service
interface Service {
  id: number;
  title: string;
  subTitle: string;
  logo: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/servives`
        );
        const data = await response.json();
        setServices(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching services data:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Cached Background Image */}
      <Image
        src={ServicesImg}
        alt="Services Background"
        layout="fill" // Makes the image fill the container
        objectFit="cover" // Ensures the image covers the container
        priority // Loads the image immediately (good for above-the-fold content)
        quality={80} // Image quality (0-100)
        placeholder="blur" // Optional: Blur placeholder before loading
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1330px]">
        <br />
        <h1 className="text-5xl text-center text-white">Services</h1>
        <br />

        <p className="text-lg text-center text-white">
          &quot;Comprehensive Solutions for Every Interior Need&quot;
        </p>
        <div className="flex justify-center py-10 sm:pl-10 mx-auto max-w-[1330px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="max-w-[270] overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-white pt-8"
              >
                <Image
                  className="w-15 h-15 object-cover mx-auto"
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${service.logo}`}
                  alt={service.title}
                  width={500}
                  height={600}
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-center">
                    {service.title}
                  </div>
                  <p className="text-gray-700 text-base">{service.subTitle}</p>
                </div>

                <Link href={`/services/${service.id}`}>
                  <p className="pl-6 pb-4 text-[#F17B21]">Read More</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
