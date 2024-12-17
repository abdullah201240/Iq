

"use client";
import React from "react";
import Image from "next/image";
import AboutImg from "@/app/assets/img/WeOffer.webp";

export default function WeOffer() {

    return (
        <div className="bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="sm:flex items-center max-w-screen-xl mx-auto bg-white bg-opacity-90 rounded-xl">
                {/* Left Image with Play Icon */}
                <div className="sm:w-1/2 p-5 sm:p-10 flex justify-center relative order-1 sm:order-none">
                    <div className="relative w-full h-80 sm:h-[400px] md:h-[500px]">
                        <Image
                            src={AboutImg}
                            alt="IQ Architects"
                            className="rounded-xl"
                            style={{ objectFit: "cover" }}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        />

                        
                    </div>
                </div>

                {/* Right Content */}
                <div className="sm:w-1/2 p-5 sm:p-10 text-center sm:text-left bg-[#FFF6E9]">
                <span className="text-black mt-4 text-4xl">
                What we offer          </span>
                    <br/>  <br/>
                    <ul className="space-y-4">
                        {[
                            "We offer the best interior design and exterior design solution.",
                            "Offering high-quality residential & commercial services for clients.",
                            "Provide the best interior design with unique concept & functionality.",
                            "We develop specialized space planning and 3D layout design.",
                        ].map((text, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className="w-4 h-4 flex-shrink-0 border-4 border-orange-500 rounded-full mt-1"></div>
                                <p className=" text-lg text-gray-600 leading-relaxed">{text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
