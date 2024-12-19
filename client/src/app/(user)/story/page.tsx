"use client";

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar'; // Ensure the component name is correct
import ServicesTitle from '@/components/ServicesTitle';
import React, { useEffect, useState } from 'react';
import about from "@/app/assets/img/abg.webp"; // Correctly imported image
import Whatsapp from '@/components/Whatsapp';

export default function Page() {
  const [storyData, setStoryData] = useState<{ link: string }[]>([]); // Change type to handle array of objects with link
  const [loading, setLoading] = useState(true);

  // Simplified YouTube ID extraction using regex
  const getYouTubeVideoId = (url: string | undefined): string => {
    if (!url) return "";
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v') || ''; // Returns the video ID
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/viewStory`);
        const data = await response.json();


        if (data && data.data) {
          setStoryData(data.data); // Directly set the data array
        } else {
          setStoryData([]);
        }
      } catch (error) {
        console.log('Error fetching story data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div>
      <Navbar />
      <ServicesTitle
        title="Success Story"
        subTitle="The essence of interior design will always be about people and how they live. It is about the realities of what makes for an attractive, civilized."
        backgroundImage={about.src}

      />
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 w-full max-w-7xl">
          {/* Map through the storyData array and render the iframe */}
          {storyData.map((story, index) => {
            try {
              console.log('Video URL:', story.link); // Log the URL to verify the data

              // Extract video ID from YouTube URL
              const videoId = getYouTubeVideoId(story.link);

              console.log('Extracted Video ID:', videoId); // Log the extracted video ID

              if (videoId) {
                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-lg aspect-video border border-gray-200 hover:scale-105 transition-transform duration-300"
                  >
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(story?.link)}`}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                );
              } 
            } catch (error) {
              console.log('Error with video URL:', error);
            }
            return null; // Return nothing if the videoUrl is invalid or videoId is empty
          })}
        </div>
      </div>
      <Whatsapp/>
      <Footer/>
    </div>
  );
}
