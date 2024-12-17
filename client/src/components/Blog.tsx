"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Blog {
    id: number;
    title: string;
    description: string;
    image: string;
}

export default function Blog() {
    const [blog, setBlog] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/viewBlog`
                );
                const result = await response.json();
                setBlog(result.data || []);
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        fetchBlogs();
    }, []);
    const getTextFromHTML = (html: string): string => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || "";
    };

    // Display the last 2 blogs
    const latestBlogs = blog.slice(-2);

    return (
        <div className="bg-[#F9F7F7] py-10">
            <h1 className="text-black text-center text-3xl font-bold mb-6">
                Latest Blogs
            </h1>

            <div className="flex justify-center mx-auto max-w-[1330px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
                    {latestBlogs.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105"
                        >
                            <Link href={`/blogs/${member.id}`}>
                            
                            <Image
                                className="w-full h-56 object-cover rounded-lg mb-4"
                                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${member.image}`}
                                alt={member.title}
                                width={500}
                                height={300}
                            />
                            <div className="space-y-4">
                                <div className="font-bold text-2xl text-gray-800">{member.title}</div>
                                <p className="text-gray-600 text-base line-clamp-3">
                                {getTextFromHTML(member.description).slice(0, 100)}...
                                    </p>
                            </div>
                            <button
                                        className="text-indigo-600 text-sm font-semibold hover:text-indigo-800 transition duration-300 ease-in-out"
                                    >
                                        Read More →
                                    </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mt-6">
                <Link href="/blog"> <button className="bg-white dark:bg-white text-black dark:text-black border-2 border-black 
    hover:border-[#f17b21] dark:hover:border-[#f17b21] 
    hover:bg-[#f17b21] dark:hover:bg-[#f17b21] 
    hover:text-white dark:hover:text-white 
    transition-all duration-300 ease-in-out transform hover:scale-105 px-6 py-2 rounded-full">
                    Read More
                </button>
                </Link>
            </div>
        </div>
    );
}
