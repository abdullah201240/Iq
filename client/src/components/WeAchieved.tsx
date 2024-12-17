"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface WeAchieved {
    id: number;
    title: string;
    subTitle: string;
    date: string;
    image: string;
}

export default function WeAchieved() {
    const [services, setServices] = useState<WeAchieved[]>([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/viewWeAchieved`
                );
                const result = await response.json();
                setServices(result.data || []);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeamMembers();
    }, []);

    // Function to format the date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", options);
    };

    return (
        <div>
            <h1 className="text-black bg-white text-center text-2xl font-bold mt-10">
                We Achieved
            </h1>

            <div className="flex justify-center py-10 sm:pl-10 mx-auto max-w-[1330px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                    {services.map((member) => (
                        <div
                            key={member.id}
                            className="max-w-[270px] overflow-hidden shadow-2xl transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-white pt-8"
                        >
                            <div className="text-right">
                                <p className="inline bg-[#F17B21] text-white px-2 py-1 rounded-l-full">
                                    {formatDate(member.date)}
                                </p>
                            </div>
                            <Image
                                className="w-40 h-40 object-cover mx-auto"
                                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${member.image}`}
                                alt={member.title}
                                width={500}
                                height={600}
                            />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2 text-left">
                                    {member.title}
                                </div>
                                <p className="text-gray-700 text-base">
                                    {member.subTitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
