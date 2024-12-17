"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Back from '@/app/assets/img/aboutbg.webp';
import Link from 'next/link'
interface AboutInfo {
  homeTitle: string;
  homeDescription: string;
  homeImage: string;
  homeVideo: string;
}
export default function AboutUs() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);  // Use the interface here
  const [loading, setLoading] = useState(true);      // State to handle loading state
  const [error, setError] = useState<string | null>(null); // State to handle any errors
  const getYouTubeVideoId = (url: string | undefined): string => {
    if (!url) return "";
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || ''; // Returns the video ID
  };
  // Fetch data inside useEffect
  useEffect(() => {
    
    const fetchAboutInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/about/1`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data)
        setAboutInfo(data);  // Set the fetched data
      } catch (err) {
        console.error(err);  // Log the error for debugging
        const errorMessage = (err as Error).message;

        setError(errorMessage);



      } finally {
        setLoading(false);  // Set loading to false when fetching is complete
      }
    };

    fetchAboutInfo(); // Call the fetch function when component mounts
  }, []);  // Empty dependency array to run only once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show an error message if there's an issue with the fetch
  }

  return (
    <div
      className="bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${Back.src})` }} // Set the background image
    >
      <div className="sm:flex items-center max-w-screen-xl mx-auto bg-white bg-opacity-90 rounded-xl">
        {/* Left Content */}
        <div className="sm:w-1/2 p-5 sm:p-10 text-center sm:text-left">
          <span className="text-black mt-4 text-4xl">
            {aboutInfo?.homeTitle || "IQ Architects Ltd is the best interior design solutions"}
          </span>

          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {aboutInfo?.homeDescription || "Loading description..."}
          </p>

          <div className="mt-6">
           <Link href="/aboutUs"> <button className="bg-white dark:bg-white text-black dark:text-black border-2 border-black 
    hover:border-[#f17b21] dark:hover:border-[#f17b21] 
    hover:bg-[#f17b21] dark:hover:bg-[#f17b21] 
    hover:text-white dark:hover:text-white 
    transition-all duration-300 ease-in-out transform hover:scale-105 px-6 py-2 rounded-full">
              Read More
            </button>
            </Link>
          </div>
        </div>

        {/* Right Image with Play Icon */}
        <div className="sm:w-1/2 p-5 sm:p-10 flex justify-center relative">
          <div className="relative w-full h-80 sm:h-[400px] md:h-[500px]">
          {aboutInfo?.homeImage && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${aboutInfo.homeImage}`}
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
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(aboutInfo?.homeVideo)}`}

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
  );
}
