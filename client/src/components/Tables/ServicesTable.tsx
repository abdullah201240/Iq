'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Services {
    id: number;
    title: string,
    subTitle: string,
    image: string | File | null;
    logo: string | File | null;
    mainTitle: string,
    description: string,
}

const ServicesTable = () => {
    const router = useRouter();
    const [services, setServices] = useState<Services[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading as true
    const [showConfirm, setShowConfirm] = useState<boolean>(false); // State for showing confirmation modal
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to track the team to delete
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentteam, setCurrentteam] = useState<Services | null>(null);
    const [formValues, setFormValues] = useState<Services>({
        id: 0,
        title: '',
        subTitle: '',
        image: null,
        logo: null,
        mainTitle: '',
        description: '',
    });

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
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/services`,
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
                `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${id}`,
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

    // Handle edit
    const handleEdit = (team: Services) => {
        setCurrentteam(team);
        setFormValues(team);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', formValues.title);
        formData.append('subTitle', formValues.subTitle);
        formData.append('description', formValues.description);
        formData.append('mainTitle', formValues.mainTitle);

        // Check if the image is a valid file before appending it
        if (formValues.image && formValues.image instanceof File) {
            formData.append('image', formValues.image);
        }
        if (formValues.logo && formValues.logo instanceof File) {
            formData.append('logo', formValues.logo);
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${formValues.id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const updatedTeam = await response.json();
                const updatedTeams = services.map((team) =>
                    team.id === formValues.id ? updatedTeam : team
                );
                setServices(updatedTeams);
                setIsModalOpen(false);
            } else {
                console.error('Failed to update team');
            }
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default  sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                All Team
            </h4>

            <div className="flex flex-col text-white">
                <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Title
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Sub Title
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Main Title
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            description
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Image
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            logo
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
                            className={`grid grid-cols-7 sm:grid-cols-7 ${services.indexOf(service) === services.length - 1
                                    ? ''
                                    : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={service.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{service.title}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{service.subTitle}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{service.mainTitle}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
                                <p className="text-black">{service.description}</p>
                            </div>
                         

                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                                        {service.image ? (
                                            <Image
                                                className="w-full h-full object-cover"
                                                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${service.image}`}
                                                alt="service-image"
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                            <div className="w-20 h-20 rounded-lg overflow-hidden">
                                        {service.logo ? (
                                            <Image
                                                className="w-full h-full object-cover"
                                                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${service.logo}`}
                                                alt="service-image"
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                <button
                                    className="text-blue-500"
                                    onClick={() => handleEdit(service)}
                                >
                                    <FaEdit />
                                </button>
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
                    <p>No teams found.</p>
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

            {/* Update team Modal */}
            {isModalOpen && currentteam && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-semibold text-center mb-4">Update service</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={formValues.title}
                                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Designation"
                                value={formValues.subTitle}
                                onChange={(e) => setFormValues({ ...formValues, subTitle: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={formValues.description}
                                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    if (file && file.type.startsWith('image/')) {
                                        setFormValues({
                                            ...formValues,
                                            image: file
                                        });
                                    } else {
                                        alert('Please select a valid image file');
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    if (file && file.type.startsWith('image/')) {
                                        setFormValues({
                                            ...formValues,
                                            logo: file
                                        });
                                    } else {
                                        alert('Please select a valid logo file');
                                    }
                                }}
                                className="w-full p-2 border border-gray-300 rounded"
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700">
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesTable;
