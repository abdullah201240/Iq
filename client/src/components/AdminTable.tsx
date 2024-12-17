'use client';
import React, { useEffect, useState } from 'react';
import {  FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define a TypeScript interface for a Admin
interface Admin {
    id: number;
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    role: string;
}

export default function AdminTable() {
    const router = useRouter();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading as true
    const [showConfirm, setShowConfirm] = useState<boolean>(false); // State for showing confirmation modal
    const [deleteId, setDeleteId] = useState<number | null>(null); // State to track the testimonial to delete
  

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

                // Fetching the admin data once session is valid
                const adminResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/admin`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (adminResponse.ok) {
                    const data = await adminResponse.json(); // Parse response data
                    // Ensure that the data is an array before setting it
                    if (Array.isArray(data.data)) {
                        setAdmins(data.data); // Update state with the fetched admin
                    } else {
                        console.error('Fetched data is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch admin');
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

    // Handle testimonial deletion
    const handleDelete = async (id: number) => {
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/admin/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                }
            );

            if (response.ok) {
                setAdmins(admins.filter((admin) => admin.id !== id)); // Remove the deleted testimonial from the state
                setShowConfirm(false); // Close the confirmation modal
            } else {
                console.error('Failed to delete admin');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
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
        <div className="flex justify-center items-center bg-gray-100 px-4">
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-center text-4xl">All Admins</h1>
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
                                    <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Dob</th>
                                    <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Gender</th>
                                    <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Role</th>
                                    <th className="p-4 text-left font-semibold text-gray-900 border border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length > 0 ? (

                                    admins.map((admin) => (

                                        <tr key={admin.id} className="bg-white hover:bg-gray-50">
                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.name}</td>
                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.email}</td>
                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.phone}</td>



                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.dob}</td>


                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.gender}</td>

                                            <td className="p-4 text-gray-900 border border-gray-200">{admin.role}</td>

                                           
                                            <td className="p-4 border border-gray-200">
                                                <div className="flex items-center justify-center gap-2">
                                                    
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => showDeleteConfirm(admin.id)}>
                                                        <FaTrash size={24} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">No admins available.</td>
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
                        <h2 className="text-xl font-semibold text-center mb-4">Are you sure you want to delete this testimonial?</h2>
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
}
