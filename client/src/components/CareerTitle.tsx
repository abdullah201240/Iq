"use client";

import React from 'react';
import Image from 'next/image';
import CareerImg from '@/app/assets/img/Career.webp'
export default function CareerTitle() {
    return (
        <div>
            <br/>
            <br/>
            <section className="bg-white">
                <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
                    <div className="mr-auto place-self-center lg:col-span-7">
                        <h1 className="max-w-2xl mb-4 text-4xl font-bold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-black">
                            Find Jobs
                        </h1>

                        <p className="max-w-2xl mb-6 font-light text-black lg:mb-8 md:text-lg lg:text-xl dark:black">
                            Join our dynamic architecture firm and elevate your career. We seek passionate individuals ready to contribute to groundbreaking projects and innovative designs.
                        </p>

                        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                            <button className="px-6 py-3 bg-[#F05924] text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-[#E04D1F] hover:shadow-xl transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F05924] focus:ring-offset-2">
                                Job Openings
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                        <Image
                            src={CareerImg}
                            alt="hero image"
                            width={500}
                            height={500}
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
            <br/>
            <br/>
            <br/>
            
        </div>
    );
}
