'use client';

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {  FaTrash } from 'react-icons/fa';
import Modal from "@/components/Modal"; // Import the Modal component

// Define the category type
type Category = {
    id: number;
    name: string;
};

export default function AdminCategory() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
    });
    const [categories, setCategories] = useState<Category[]>([]); // Use Category type
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null); // Store the category ID to delete

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            const storedUserInfo = localStorage.getItem("sessionToken");
            if (!storedUserInfo){
                router.push("/admin/login");
            } ;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                });

                if (!response.ok) {

                    toast.error("Failed to fetch categories.");
                    console.error("Error fetching categories");
                } else {
                    const data = await response.json();

                    // Ensure data is an array before setting it

                    setCategories(data.data); // Only set categories if data is an array

                }
            } catch (error) {
                toast.error("Error fetching categories.");
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, [router]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem("sessionToken");

        if (!storedUserInfo) {
            toast.error("You must log in first!");
            router.push("/admin/login");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                toast.error("Failed to add category.");
                console.error("Error adding category");
            } else {
                toast.success("Category added successfully!");
                setFormData({ name: "" }); // Reset form
                // Refresh categories list
                const newCategory = await response.json();
                setCategories((prev) => [...prev, newCategory]);
            }
        } catch (error) {
            toast.error("Error submitting form.");
            console.error("Error submitting form:", error);
        }
    };

    const handleDelete = (id: number) => {
        // Open the modal and set the category to delete
        setCategoryToDelete(id);
        setIsModalOpen(true);
    };
    const confirmDelete = async () => {
        const storedUserInfo = localStorage.getItem("sessionToken");

        if (!storedUserInfo) {
            toast.error("You must log in first!");
            router.push("/admin/login");
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/${categoryToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to delete category.");
            } else {
                toast.success("Category deleted successfully!");
                setCategories((prev) => prev.filter((category) => category.id !== categoryToDelete));
            }
        } catch {
            toast.error("Error submitting form.");
        }finally {
            setIsModalOpen(false); // Close the modal after deletion
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Close the modal without deleting
    };
    

    return (
        <div>
       
                <div className="bg-gray-100 py-12">
                    <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-black">Project Category</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="mt-10">
                            <div className="w-1/2 mx-auto">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-900 font-semibold mb-2"
                                >
                                    Category Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Category Name"
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>
                            <div className="text-center mt-6">
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-md bg-[#F17B21] text-white font-semibold hover:bg-[#d56e1d] transition-all"
                                >
                                    Add Category
                                </button>
                            </div>
                        </form>

                        {/* Category Table */}
                        <div className="mt-12">
                            <h3 className="text-xl font-semibold text-center text-black mb-4">Categories</h3>
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-2 text-center">
                                                No categories available
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="px-4 py-2 border">{category.id}</td>
                                                <td className="px-4 py-2 border">{category.name}</td>
                                                <td className="px-4 py-2 border text-center">
                                                    <button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTrash className="w-5 h-5" />

                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Are you sure you want to delete this category?"
            />

           </div>
    );
}
