'use client';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Story {
    id: number;
    
    link: string;}

const StoryTable = () => {
    const router = useRouter();
    const [services, setServices] = useState<Story[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading as true
    const [showConfirm, setShowConfirm] = useState<boolean>(false); // State for showing confirmation modal
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to track the team to delete


    // Fetch data from the API
    useEffect(() => {
        const checkSession = async () => {
            const storedUserInfo = localStorage.getItem('sessionToken');
            if (!storedUserInfo) {
                router.push('/admin/login');
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/me`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (!response.ok) {
                    router.push('/admin/login');
                    return;
                }

                // Fetching the teams data once session is valid
                const teamResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/viewStory`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (teamResponse.ok) {
                    const data = await teamResponse.json(); // Parse response data
                    // Ensure that the data is an array before setting it
                    if (Array.isArray(data.data)) {
                        setServices(data.data); // Update state with the fetched team
                    } else {
                        console.error('Fetched data is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch team');
                }
            } catch (error) {
                console.error('Error checking session:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false); // Set loading to false after fetching data or error
            }
        };

        checkSession();
    }, [router]);

    // Handle team deletion
    const handleDelete = async (id: number) => {
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/deleteStory/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                }
            );

            if (response.ok) {
                setServices(services.filter((services) => services.id !== id)); // Remove the deleted team from the state
                setShowConfirm(false); // Close the confirmation modal
            } else {
                console.error('Failed to delete team');
            }
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    // Show confirmation modal
    const showDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    // Hide confirmation modal
    const hideDeleteConfirm = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

   

    

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default  sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-black">
            All Link
            </h4>

            <div className="flex flex-col text-white">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            ID
                        </h5>
                    </div>
                   
                   
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm  uppercase xsm:text-base">
                            Video Link
                        </h5>
                    </div>
    
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Actions
                        </h5>
                    </div>
                </div>

                {services.length > 0 ? (
                    services.map((service) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-3 ${services.indexOf(service) === services.length - 1
                                    ? ''
                                    : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={service.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{service.id}</p>
                            </div>
                            
                         

                            <div className="flex items-left justify-left gap-2 p-2.5 xl:p-5">
                            <div className="w-100 h-20 rounded-lg overflow-hidden">
                                        {service.link ? (
                                            <p className='text-black text-lg'>{service.link}</p>
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                            </div>

          
                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                
                                <button
                                    className="text-red-500"
                                    onClick={() => showDeleteConfirm(service.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>No client found.</p>
                )}
            </div>
            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-semibold text-center mb-4">Are you sure you want to delete this team?</h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(deleteId as number)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                                Yes
                            </button>
                            <button
                                onClick={hideDeleteConfirm}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

           
        </div>
    );
};

export default StoryTable;
