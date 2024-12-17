'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ServicesTitle from '@/components/ServicesTitle';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import about from "@/app/assets/img/abg.webp"; // Correctly imported image


export default function Page() {
    const [storyData, setStoryData] = useState<{ title: string; description: string; image: string; id: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/viewBlog`);
                const data = await response.json();

                if (data && data.data) {
                    setStoryData(data.data);
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
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="spinner-border animate-spin text-indigo-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const getTextFromHTML = (html: string): string => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || "";
    };

    return (
        <div className="bg-gray-50">
            <Navbar />
            <ServicesTitle
                title="Blog"
                subTitle="Insightful articles on architecture trends, design innovations, and industry news. Join our blog for expert perspectives and inspiration for your projects."
                backgroundImage={about.src}
            />

            <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {storyData.map((story, index) => (
                        <div key={index} className="group rounded overflow-hidden shadow-lg flex flex-col transition-transform transform hover:scale-105">
                            <Link href={`/blogs/${story.id}`} className="relative block">
                                <Image
                                    className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity duration-300"
                                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${story.image}`}
                                    alt={story.title || 'Story Image'}
                                    width={500}
                                    height={300}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-30"></div>
                            </Link>

                            <div className="px-6 py-4 flex flex-col justify-between flex-grow">
                                <Link href={`/blogs/${story.id}`} className="font-medium text-xl text-gray-800 hover:text-indigo-600 transition duration-300 ease-in-out mb-2">
                                    {story.title}
                                </Link>
                                
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">{getTextFromHTML(story.description).slice(0, 100)}...</p>

                                <Link
                                  href={`/blogs/${story.id}`}
                                  className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition duration-300 ease-in-out"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
