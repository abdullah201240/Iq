'use client';
import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaTrash } from 'react-icons/fa';
import Modal from "@/components/Modal"; // Import the Modal component
import Image from "next/image"; // Import Image component from Next.js

type Project = {
    category: {
        name: string;
    } | null; id: number;
    name: string;
    themeImage: string;
    project: { imageName: string }[];
};
type Category = {
    id: number;
    name: string;
};

export default function AdminProject() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
    });

    const [files, setFiles] = useState({
        themeImage: null as File | null,
        images: [] as File[],
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]); // Store categories

    // Fetch categories when the component mounts
    useEffect(() => {
        const fetchProjects = async () => {
            const storedUserInfo = localStorage.getItem("sessionToken");
            if (!storedUserInfo) {
                // router.push("/admin/login");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                });

                if (!response.ok) {
                    // router.push("/admin/login");
                    toast.error("Failed to fetch projects.");
                    console.error("Error fetching projects");
                } else {
                    const data = await response.json();
                    setProjects(data.data || []); // Ensure data is an array before setting it
                }
            } catch (error) {
                toast.error("Error fetching projects.");
                console.error("Error fetching projects:", error);
            }
        };

        const fetchCategories = async () => {
            const storedUserInfo = localStorage.getItem("sessionToken");
            if (!storedUserInfo) {
                // router.push("/admin/login");
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                });

                if (!response.ok) {
                    // router.push("/admin/login");
                    toast.error("Failed to fetch category.");
                    console.error("Error fetching category");
                } else {
                    const data = await response.json();
                    setCategories(data.data); // Ensure data is an array before setting it
                }
            } catch (error) {
                toast.error("Error fetching category.");
                console.error("Error fetching category:", error);
            }
        };

        fetchCategories();
        fetchProjects();
    }, [router]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            if (name === "themeImage") {
                setFiles((prev) => ({
                    ...prev,
                    themeImage: files[0], // Handle single theme image
                }));
            } else if (name === "additionalImages") {
                setFiles((prev) => ({
                    ...prev,
                    images: Array.from(files), // Handle multiple additional images
                }));
            }
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem("sessionToken");

        if (!storedUserInfo) {
            toast.error("You must log in first!");
            router.push("/admin/login");
            return;
        }

        if (!formData.name || !formData.category || !files.themeImage) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("categoryId", formData.category);

        if (files.themeImage) {
            form.append("themeImage", files.themeImage);
        }

        // Append additional images to FormData
        files.images.forEach((file) => {
            form.append("images", file);
        });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/createProject`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                    // No need to set Content-Type manually when using FormData
                },
                body: form,
            });

            const responseBody = await response.json();
            console.log("Server Response:", responseBody);

            if (!response.ok) {
                toast.error("Failed to add project.");
                console.error("Error adding project");
            } else {
                toast.success("Project added successfully!");
                setFormData({ name: "", category: "" }); // Reset form
                setFiles({ themeImage: null, images: [] }); // Reset file input

                setProjects((prev) => [...prev, responseBody.project]); // Assuming responseBody contains the newly created project
            }
        } catch (error) {
            toast.error("Error submitting form.");
            console.error("Error submitting form:", error);
        }
    };



    const handleDelete = (id: number) => {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/projects/${categoryToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to delete Project.");
            } else {
                toast.success("Project deleted successfully!");
                setProjects((prev) => prev.filter((project) => project.id !== categoryToDelete));
            }
        } catch {
            toast.error("Error deleting category.");
        } finally {
            setIsModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="bg-gray-100 py-12">
                <div className="max-w-4xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-black">All Projects</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="mt-10">
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2 mx-auto">
                                <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
                                    Project Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Project Name"
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>

                            <div className="w-1/2 mx-auto">
                                <label htmlFor="category" className="block text-gray-900 font-semibold mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2 mx-auto">
                                <label htmlFor="themeImage" className="block text-gray-900 font-semibold mb-2">
                                    Theme Image
                                </label>
                                <input
                                    id="themeImage"
                                    type="file"
                                    name="themeImage"
                                    onChange={handleFileChange}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none"
                                />
                            </div>

                            <div className="w-1/2 mx-auto">
                                <label htmlFor="additionalImages" className="block text-gray-900 font-semibold mb-2">
                                    Additional Images
                                </label>
                                <input
                                    id="additionalImages"
                                    type="file"
                                    name="additionalImages"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-md bg-[#F17B21] text-white font-semibold hover:bg-[#d56e1d] transition-all"
                            >
                                Add Project
                            </button>
                        </div>
                    </form>

                    {/* Projects Table */}
                    <div className="mt-12 text-center">
                        <h3 className="text-xl font-semibold text-center text-black mb-4">All Projects</h3>
                        <div className="flex justify-center">
                            <table className=" max-w-auto table-auto">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">ID</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Category</th>
                                        <th className="px-4 py-2 text-left">Theme Image</th>
                                        <th className="px-4 py-2 text-left">All Images</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-2 text-center">
                                                No project available
                                            </td>
                                        </tr>
                                    ) : (
                                        projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="px-4 py-2 border">{project.id}</td>
                                                <td className="px-4 py-2 border">{project.name}</td>
                                                <td className="px-4 py-2 border">
                                                    {project.category?.name || "No category available"}


                                                </td>
                                                <td className="px-4 py-2 border text-center">
                                                    <Image
                                                        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${project.themeImage}`}


                                                        alt="Theme"
                                                        width={64}
                                                        height={64}
                                                        className="object-cover"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border text-center">
                                                    <div className="grid grid-cols-4 gap-2 justify-center">
                                                        {project.project && project.project.length > 0 ? (
                                                            project.project.map((image, index) => {
                                                                const imageUrl = `${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${image.imageName}`;
                                                                return (
                                                                    <Image
                                                                        key={index}
                                                                        src={imageUrl}
                                                                        alt={`Project Image ${index + 1}`}
                                                                        width={40}
                                                                        height={40}
                                                                        sizes="(max-width: 768px) 10vw, (max-width: 1200px) 10vw, 10vw"
                                                                        priority={false}
                                                                        quality={10}
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                                                                        }}
                                                                    />
                                                                );
                                                            })
                                                        ) : (
                                                            <p>No images available</p>
                                                        )}
                                                    </div>
                                                </td>




                                                <td className="px-4 py-2 border text-center">
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
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
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Are you sure you want to delete this project?"
            />
        </div>
    );
}
