import React from 'react';
import Image from 'next/image'; // Import the Image component (for Next.js)

import back from '@/app/assets/img/WhyWorkwithUs.webp';
import img1 from '@/app/assets/img/1.webp';
import img2 from '@/app/assets/img/2.webp';
import img3 from '@/app/assets/img/3.webp';
import img4 from '@/app/assets/img/4.webp';

export default function WhyWorkwithUs() {
    return (
        <div
            className="relative w-full h-full bg-cover bg-center text-white"
            style={{
                backgroundImage: `url(${back.src})`,
                backgroundSize: 'cover', // Cover the full display with the background image
                backgroundPosition: 'center', // Center the background image
            }}
        >
            <div className="max-w-4xl mx-auto px-5 pt-70 mt-16 min-h-[150vh] md:min-h-[120vh]">
                <div className="text-center">
                    <h2 className="font-semibold text-3xl">Why Work with Us?</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-10">
                    <div className="flex gap-4 items-start">
                        <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">
                            <Image
                                src={img1}
                                alt="Innovative Projects"
                                width={200}
                                height={200}
                            />
                        </span>
                        <div>
                            <h3 className="font-semibold text-xl">Innovative Projects</h3>
                            <p className="mt-1 text-white">
                                Work on exciting projects that push the boundaries of technology and bring real change to businesses.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">
                            <Image
                                src={img2}
                                alt="Professional Growth"
                                width={200}
                                height={200}
                            />
                        </span>
                        <div>
                            <h3 className="font-semibold text-xl">Professional Growth</h3>
                            <p className="mt-1 text-white">
                                We invest in your growth, offering training, workshops, and opportunities to expand your skills.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">
                            <Image
                                src={img3}
                                alt="Supportive Culture"
                                width={200}
                                height={200}
                            />
                        </span>
                        <div>
                            <h3 className="font-semibold text-xl">Supportive Culture</h3>
                            <p className="mt-1 text-white">
                                Join a team that values collaboration, respects diversity, and encourages creative thinking.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <span className="text-violet-600 bg-violet-500/10 p-3 rounded-full">
                            <Image
                                src={img4}
                                alt="Empowerment & Ownership"
                                width={200}
                                height={200}
                            />
                        </span>
                        <div>
                            <h3 className="font-semibold text-xl">Empowerment & Ownership</h3>
                            <p className="mt-1 text-white">
                                We give our team members the autonomy to lead projects, make decisions, and bring their best ideas to life.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
