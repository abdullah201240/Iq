"use client";
import React from 'react';

// Define the props type for TypeScript
interface ServicesTitleProps {
    title: string;
    subTitle: string;
    backgroundImage: string; // Add a prop for the background image
}

const ServicesTitle: React.FC<ServicesTitleProps> = ({ title, subTitle, backgroundImage }) => {
    return (
        <div className="relative">
            {/* Background section */}
            <div
                className="text-left bg-cover bg-center min-h-[50vh]"
                style={{
                    backgroundImage: `url(${backgroundImage})`, // Use the dynamic image prop
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '60vh',
                }}
            >
                {/* Semi-transparent overlay */}
                <div className="relative flex flex-col items-center max-w-screen-xl px-4 mx-auto md:flex-row sm:px-6 p-8 pt-36">
                    <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
                        <div className="text-left">
                            <h2 className="text-4xl font-extrabold leading-10 tracking-tight text-white sm:text-5xl sm:leading-none md:text-4xl">
                                {title}
                            </h2>
                            <br />
                            <p className="text-white text-base lg:text-lg leading-relaxed">
                                {subTitle}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesTitle;
