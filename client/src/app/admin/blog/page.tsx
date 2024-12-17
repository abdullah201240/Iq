'use client';

import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import BlogTable from '@/components/Tables/BlogTable';

// Dynamically import JoditEditor to disable SSR
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function Home() {
    const router = useRouter();

    // Initialize formData state for the form
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        description: '',
    });

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
            } catch (error) {
                console.error('Error checking session:', error);
                router.push('/admin/login');
            }
        };

        checkSession();
    }, [router]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem('sessionToken');

        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }
        console.log("Form Data Submitted:", formData);


        try {
            const form = new FormData();
            if (formData.image) form.append('image', formData.image);
            form.append('title', formData.title);
            form.append('description', formData.description);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/createBlog`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                },
                body: form,
            });

            if (!response.ok) {
                toast.error('Error adding data');
            } else {
                toast.success('Data Added successfully!');
                setFormData({
                    title: '',
                    image: null,
                    description: '',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;

        if (target) {
            const { name, value } = target;
            const newValue = target instanceof HTMLInputElement && target.files
                ? target.files[0]
                : value;

            setFormData((prev) => ({
                ...prev,
                [name]: newValue,
            }));
        }
    };

    const handleEditorChange = (newContent: string) => {
        setFormData((prev) => ({
            ...prev,
            description: newContent,
        }));
    };

    return (
        <div>
      
            <div className="bg-gray-100 py-12">
                <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-black">Blog</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10">
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2 mb-6">
                                <label htmlFor="title" className="block text-gray-900 font-semibold mb-2">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    placeholder='Title'
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black"
                                />
                            </div>

                            <div className="w-1/2 mb-6">
                                <label htmlFor="image" className="block text-gray-900 font-semibold mb-2">
                                    Image
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    required
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black file:border file:border-gray-400 file:rounded-md file:bg-white"
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <label htmlFor="description" className="block text-gray-900 font-semibold mb-2">
                                Description
                            </label>
                            <JoditEditor
                                value={formData.description}
                                onChange={handleEditorChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#F17B21] text-black font-bold rounded-md focus:outline-none hover:bg-[#f18c48]"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>

            <BlogTable />
            </div>
       
    );
}
