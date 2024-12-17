"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

// Define TypeScript interface for API response data
interface ProjectImage {
  id: number;
  imageName: string;
}

export default function Cart() {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/project`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project images");
        }

        const result = await response.json();
        setImages(result.data); // Assuming API returns { message, data }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Generate cards based on the fetched image data
  const cards = images.map((image) => (
    <Card
      key={image.id}
      card={{
        src: `${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${image.imageName}`,
      }}
      index={image.id}
    />
  ));

  if (loading) {
    return (
      <div className="w-full h-full py-20 bg-black text-white text-center">
        Loading Gallery...
      </div>
    );
  }

  return (
    <div className="w-full h-full py-20 bg-black">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-white font-sans text-center">
        Our Latest Gallery
      </h2>
      <p className="text-white text-center font-medium mt-8">
        Building dreams one structure at a time
      </p>
      <Carousel items={cards} />
    </div>
  );
}
