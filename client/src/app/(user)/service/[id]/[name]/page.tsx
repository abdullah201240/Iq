"use client";

import Navbar from "@/components/Navbar";
import ServicesTitle from "@/components/ServicesTitle";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Whatsapp from "@/components/Whatsapp";
import about from "@/app/assets/img/abg.webp"; // Correctly imported image
import DOMPurify from 'dompurify';

interface Service {
  subTitle: string,
  logo: string;
  description: string;
  videoLink: string;
}

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || ""; // Handle array case
  const name = Array.isArray(params?.name) ? decodeURIComponent(params.name[0]) : decodeURIComponent(params?.name || ""); // Decode and handle array case
  const [service, setService] = useState<Service | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const getYouTubeVideoId = (url: string | undefined): string => {
    if (!url) return "";
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || ''; // Returns the video ID
  };
  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mainServices/${id}/${name}`)
        .then((response) => response.json())
        .then((data) => setService(data.data))
        .catch((error) => {
          console.error("Error fetching service data:", error);
        });
    }
  }, [id, name]);
  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      {/* Services Title Component */}
      <ServicesTitle
        title={String(name) || "Loading..."}
        subTitle={service?.subTitle || "Loading..."}
        backgroundImage={about.src}

      />


      <div
        className="bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8 "
      >
        <div className="sm:flex items-center max-w-screen-xl mx-auto bg-white bg-opacity-90 rounded-xl ">
          {/* Left Content */}
          <div className="sm:w-1/2 p-5 sm:p-10 text-center sm:text-left bg-[#FFF6E980]">
            <p
              className="mt-4 text-lg text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: service?.description
                  ? DOMPurify.sanitize(service.description)
                  : '', // Fallback to an empty string if description is null or undefined
              }}
            ></p>


          </div>

          {/* Right Image with Play Icon */}
          <div className="sm:w-1/2 p-5 sm:p-10 flex justify-center relative">
            <div className="relative w-full h-80 sm:h-[400px] md:h-[500px]">
              {service?.logo && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${service.logo}`}
                  alt="IQ Architects"
                  className="rounded-xl"
                  style={{ objectFit: 'cover' }} // Apply objectFit for proper scaling
                  fill // Ensures the image fills the container
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" // This sets the image size based on viewport width
                />
              )}

              {/* Play Icon */}
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => setIsVideoOpen(true)}
              >
                <div className="bg-black bg-opacity-50 text-white w-16 h-16 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.25v13.5L18 12 5.25 5.25z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(service?.videoLink)}`}

                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <Whatsapp />

    </div>
  );
}
