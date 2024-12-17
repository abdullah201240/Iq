"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

// Define the type for a team member
interface TeamMember {
    name: string;
    designation: string;
    phone: string;
    email: string;
    description: string;
    image: string;
}

export default function TeamMember() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // To store fetched data

    // Fetch team members data from the API when the component mounts
    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/team`); // Replace with your API URL
                const data = await response.json();
                setTeamMembers(data);
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };

        fetchTeamMembers();
    }, []);

    const handleCardClick = (member: TeamMember) => {
        setSelectedMember(member);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedMember(null);
    };

    return (
        <div className='mx-auto max-w-[1330px] '>
<br/>
            <h1 className='text-center mt-12 text-4xl font-medium'>Team IQ</h1>
            <br/>
            

            <p className='pl-28 text-lg font-medium mt-10 '>Meet with our experts</p>
        <div className="flex justify-center py-10 sm:pl-10 mx-auto max-w-[1330]">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {teamMembers.map((member, index) => (
                    <div
                        key={index}
                        className="max-w-sm rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                        onClick={() => handleCardClick(member)}
                    >
                        <Image
                            className="w-full h-80 object-cover"
                            src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${member.image}`}
                            alt={member.name}
                            width={500}
                            height={600}
                        />
                        <div className="px-6 py-4">
                            <div className="font-bold text-xl mb-2">{member.name}</div>
                            <p className="text-gray-700 text-base">{member.designation}</p>
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && selectedMember && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg max-w-2xl w-full pt-16 pb-8 shadow-xl">
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div
                                className="w-32 h-32 rounded-full p-[4px]"
                                style={{
                                    background: "linear-gradient(135deg, #F17B21, #B3145B)",
                                }}
                            >
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    <Image

                                        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${selectedMember.image}`}


                                        alt={selectedMember.name}
                                        width={128}
                                        height={128}
                                        className="rounded-full w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
                            className="absolute -top-5 -right-2 bg-black text-white rounded-full w-10 h-10 flex items-center justify-center "
                        >
                            <p className="pb-1">&times;</p>
                        </button>

                        <div className="flex justify-center mt-2">
                            <div className="bg-[#F7F3F3] inline-block px-4 py-2 rounded-xl">
                                <h2 className="text-2xl font-semibold text-black">{selectedMember.name}</h2>
                                <p className="text-sm text-center text-black">{selectedMember.designation}</p>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <div className="bg-[#F7F3F3] inline-block px-4 py-4 rounded-xl border border-[#F17B21]">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <MdEmail className="text-black" />
                                        <span className="text-black text-sm">{selectedMember.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FaPhoneAlt className="text-black" />
                                        <span className="text-black text-sm">{selectedMember.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2 px-4 flex justify-center">
                            <p className="text-justify leading-relaxed text-sm sm:text-lg  max-w-xl  text-gray-600">
                                {selectedMember.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}
