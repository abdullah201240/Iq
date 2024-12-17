'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../../components/Navbar';
import ServicesTitle from '@/components/ServicesTitle';
import Footer from '@/components/Footer';
import about from "@/app/assets/img/abg.webp"; // Correctly imported image

// Interface for individual project image data
interface ProjectImage {
    project: { id: number; themeImage: string; name: string }[]; // Array of objects with specified keys
    images: { projectId: number; imageName: string }[]; // Array of objects with specified keys
}

// Interface for API response
interface ApiResponse {
    message: string;
    data: ProjectImage | ProjectImage[]; // Data could be a single ProjectImage object or an array
}

const ProjectPage: React.FC = () => {
    const [images, setImages] = useState<{ projectId: number; imageName: string }[]>([]); // Flattened image array
    const [projectName, setProjectName] = useState<string>(''); // State to store the project name
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // State to store the selected image for modal
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/user/viewProjectById?id=${id}&page=${page}&limit=18`
                    );
                    const result: ApiResponse = await response.json();
                    if (response.ok && result.data) {
                        let flattenedImages: { projectId: number; imageName: string }[] = [];
                        const dataArray = Array.isArray(result.data) ? result.data : [result.data];

                        dataArray.forEach((project) => {
                            // Access the name of the first project
                            if (project.project && project.project.length > 0 && project.project[0].name) {
                                setProjectName(project.project[0].name); // Correct access
                            }
                            flattenedImages = [...flattenedImages, ...project.images];
                        });

                        setImages((prevImages) => [...prevImages, ...flattenedImages]);

                        // If we receive fewer than expected images, we set hasMore to false
                        if (flattenedImages.length < 18) { // Adjust based on your API's pagination limit
                            setHasMore(false);
                        }
                    } else {
                        setError('No Project Found');
                    }
                } catch (error) {
                    if (error) setError('Error fetching project data');
                } finally {
                    setLoading(false);
                }
            };

            fetchProject();
        }
    }, [id, page]);

    const loadMoreImages = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1); // Increase the page number to load more images
        }
    };

    const openModal = (image: string) => {
        setSelectedImage(image); // Set the selected image for the modal
    };

    const closeModal = () => {
        setSelectedImage(null); // Close the modal by setting selectedImage to null
    };

    if (loading) return <div>Loading...</div>;
    if (error)
        return (
            <div>
                <Navbar />
                <div className="text-center mt-50 mb-40 text-2xl">{error}</div>
                <Footer />
            </div>
        );
    if (images.length === 0) return <div>No project images found</div>;

    return (
        <div>
            <Navbar />
            <ServicesTitle
                title="Projects"
                subTitle="Explore our architecture firm's project section, transforming ideas into reality featuring cutting-edge designs and successful collaborations that redefine spaces and enhance communities."
                backgroundImage={about.src}
            />
            <h2 className="text-center mt-10 mb-10 text-black">{projectName}</h2>
            <div className="max-w-screen-xl mx-auto p-6 sm:p-10 md:p-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((story) => (
                        <div
                            key={story.imageName} // Using imageName as a key
                            className="rounded-lg overflow-hidden shadow-xl bg-white transform transition-all duration-500 hover:scale-105 cursor-pointer"
                            onClick={() => openModal(story.imageName)} // Open modal on image click
                        >
                            <div className="relative w-full h-64">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${story.imageName}`}
                                    alt={story.imageName || "Project Image"}
                                    layout="fill"
                                    objectFit="cover"
                                    loading="lazy"
                                    placeholder="blur"
                                    blurDataURL="data:image/webp;base64,..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                    <div className="text-center mt-10">
                        <button
                            onClick={loadMoreImages}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>

            {/* Modal to display full-size image */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={closeModal} // Close modal on background click
                >
                    <div className="relative bg-white p-4 rounded-lg">
                        <button
                            className="absolute top-2 right-2 text-black  p-2 rounded-full font-extrabold text-4xl"
                            onClick={closeModal}
                        >
                            X
                        </button>
                        <div className="max-w-4xl max-h-screen overflow-auto">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${selectedImage}`}
                                alt={selectedImage || "Full-size Project Image"}
                                width={1200}
                                height={800}
                                objectFit="contain"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProjectPage;
