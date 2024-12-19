'use client';

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesTitle from "@/components/ServicesTitle";
import Image from "next/image";

import about from "@/app/assets/img/Gallery.webp";
import Whatsapp from "@/components/Whatsapp";

interface ProjectImage {
  id: number;
  imageName: string;
}

export default function Page() {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to manage the selected image for the modal
  const [modalOpen, setModalOpen] = useState(false); // State to control the modal visibility

  const IMAGES_PER_PAGE = 18; // 18 images per page

  const fetchImages = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/project?page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      const result = await response.json();
      if (result.data.length === 0) setHasMore(false); // Stop if no more data
      setImages((prev) => [...prev, ...result.data]); // Append new images
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreImages = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1); // Load next page
    }
  };

  const openModal = (imageName: string) => {
    setSelectedImage(imageName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen overflow-hidden">
      <Navbar />
      <ServicesTitle
        title="Gallery"
        subTitle="Browse our gallery to experience the art of architecture! Check out our diverse projects that highlight our commitment to design excellence and creativity."
        backgroundImage={about.src}
      />

      <div className="max-w-screen-2xl mx-auto mt-10">
        <div className="overflow-hidden">
          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-5 px-6 ">
            {images.slice(0, page * IMAGES_PER_PAGE).map((story) => (
              <div
                key={story.id}
                className="rounded-lg  overflow-hidden shadow-xl bg-white transform transition-all duration-500 hover:scale-105"
              >
                <div className="relative w-full  h-40  sm:h-40 md:h-40 lg:h-96 ">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${story.imageName}`}
                    alt={story.imageName || "Project Image"}
                    layout="fill"
                    objectFit="cover"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/webp;base64,..."
                    onClick={() => openModal(story.imageName)} // Open modal on image click
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {loading ? (
          <div className="flex justify-center my-8">
            <span className="text-lg text-gray-500">Loading...</span>
          </div>
        ) : hasMore ? (
          <div className="flex justify-center my-8">
            <button
              onClick={loadMoreImages}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Load More
            </button>
          </div>
        ) : (
          <div className="flex justify-center my-8">
            <span className="text-lg text-gray-500">No more images</span>
          </div>
        )}
      </div>

      {/* Modal for displaying the full image */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-black  p-2 rounded-full"
            >
              X
            </button>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${selectedImage}`}
              alt="Full Project Image"
              width={800}
              height={600}
              objectFit="contain"
            />
          </div>
        </div>
      )}
      <Whatsapp />
      <Footer />
    </div>
  );
}
