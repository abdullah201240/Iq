"use client";

import React from "react";
import about from "@/app/assets/img/abg.webp";

export default function AboutUsTitle() {
    return (
        <div className="relative">
            {/* Background section */}
            <div
                className="text-left  bg-cover bg-center min-h-[50vh]"
                style={{
                    backgroundImage: `url(${about.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: '60vh',
                }}
            >
                {/* Semi-transparent overlay */}



                <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8 pt-36">
                    <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
                        <div className="text-left">
                            <h2
                                className="text-4xl font-extrabold leading-10 tracking-tight text-white sm:text-5xl sm:leading-none md:text-4xl">
                                About Us
                               
                            </h2>
                            <p className="max-w-3xl mx-auto mt-3 text-base text-white sm:text-lg md:mt-5 md:text-lg md:max-w-7xl">
                            At the heart of our firm lies a commitment to exceptional green architecture and planning. We specialize in creating stunning interiors, landscapes, and decorations that elevate every space.
                            </p>

                        </div>
                    </div>
                </div>











                {/* Content */}

            </div>
        </div>
    );
}
