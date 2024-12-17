'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define a TypeScript interface for a team
interface Team {
    id: number;
    name: string;
    designation: string;
    image: File | null;
    description: string;
    email: string;
    phone: string;
}

export default function TeamTable() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading as true
    const [showConfirm, setShowConfirm] = useState<boolean>(false); // State for showing confirmation modal
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to track the team to delete
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentteam, setCurrentteam] = useState<Team | null>(null);
    const [formValues, setFormValues] = useState<Team>({
        id: 0,
        designation: '',
        name: '',
        image: null,
        description: '',
        email: '',
        phone: ''
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
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/team`,
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
                        setTeams(data.data); // Update state with the fetched team
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
                `${process.env.NEXT_PUBLIC_API_URL}/admin/team/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                }
            );

            if (response.ok) {
                setTeams(teams.filter((team) => team.id !== id)); // Remove the deleted team from the state
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
    const handleEdit = (team: Team) => {
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
        formData.append('name', formValues.name);
        formData.append('designation', formValues.designation);
        formData.append('description', formValues.description);
        formData.append('phone', formValues.phone);

        formData.append('email', formValues.email);


        // Check if the image is a valid file before appending it
        if (formValues.image && formValues.image instanceof File) {
            formData.append('image', formValues.image);
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/team/${formValues.id}`,
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
                const updatedTeams = teams.map((team) =>
                    team.id === formValues.id ? updatedTeam : team
                );
                setTeams(updatedTeams);
                setIsModalOpen(false);
            } else {
                console.error('Failed to update team');
            }
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };


    return (
        <div className="flex justify-center items-center bg-gray-100 px-4 pl-32">
    <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6 pl-8"> {/* Added pl-16 to create space for the navbar */}
        <h1 className="text-center text-4xl">All Teams</h1>
        <br />
        {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 border-collapse border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Name</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Email</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Phone</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Designation</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Image</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Description</th>
                            <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <tr key={team.id} className="bg-white hover:bg-gray-50">
                                    <td className="p-4 text-gray-900 border border-gray-200 truncate">{team.name}</td>
                                    <td className="p-4 text-gray-900 border border-gray-200 truncate">{team.email}</td>
                                    <td className="p-4 text-gray-900 border border-gray-200 truncate">{team.phone}</td>
                                    <td className="p-4 text-gray-900 border border-gray-200 truncate">{team.designation}</td>
                                    <td className="p-4 text-gray-900 border border-gray-200">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${team.image}`}
                                            alt="title"
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                    </td>
                                    <td className="p-4 text-gray-900 border border-gray-200">{team.description}</td>
                                    <td className="p-4 border border-gray-200">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(team)}
                                                className="text-blue-500 hover:text-blue-700">
                                                <FaEdit size={24} />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => showDeleteConfirm(team.id)}>
                                                <FaTrash size={24} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No teams available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
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
                        <h2 className="text-xl font-semibold text-center mb-4">Update team</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={formValues.name}
                                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Designation"
                                value={formValues.designation}
                                onChange={(e) => setFormValues({ ...formValues, designation: e.target.value })}
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
}

