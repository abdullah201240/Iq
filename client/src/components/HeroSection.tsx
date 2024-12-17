"use client";
import React from "react";

const HeroSection = React.memo(function HeroSection() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/BATV.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Shadow Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10"></div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 py-20 lg:pt-32">
                <h2 className="mx-auto max-w-5xl font-display text-4xl font-bold tracking-normal text-white sm:text-7xl">
                    Design Your Dream
                    Home with
                </h2>
                <h2
                    className="mx-auto max-w-5xl font-display text-4xl font-bold tracking-normal text-white sm:text-7xl mt-4"
                    style={{ color: "#e97822" }}
                >
                    IQ Architects Ltd
                </h2>
                <h2 className="mx-auto mt-12 max-w-4xl text-lg line-clamp-3 md:line-clamp-none text-white leading-7">
                    At IQ Architects Ltd, we bring your vision to life with expertise and attention to detail. From concept to completion, our team is dedicated to creating spaces that reflect your unique style and needs. Let us help you design a home that’s as functional as it is beautiful, where every corner speaks of comfort and sophistication.
                </h2>
            </div>
        </div>
    );
});

export default HeroSection;
