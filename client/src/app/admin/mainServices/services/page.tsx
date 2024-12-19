'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

// Dynamically importing JobTable with SSR disabled
const MainServicesTable = dynamic(() => import('@/components/Tables/MainServicesTable'), {
    ssr: false, // Disable SSR for this component
});
const ReactEditor = dynamic(() => import('react-text-editor-kit'), {
    ssr: false,
});

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        subTitle: '',
        categoryId: '',
        subCategoryId: '', // Added subCategoryId for subcategory dropdown
        logo: null, // This will hold the logo file
        backgroundImage: null,
        videoLink: '',
        description: '',
    });

    const [categories, setCategories] = useState([]); // State to store categories
    const [subCategories, setSubCategories] = useState([]); // State to store subcategories
    const [mounted, setMounted] = useState(false);

    // Check session on component mount
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

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const storedUserInfo = localStorage.getItem('sessionToken');
                if (!storedUserInfo) {
                    router.push('/admin/login');
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/mainServicesCategory`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data); // Set categories data
                } else {
                    console.error('Error fetching categories:', response.statusText);
                    toast.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('An error occurred while fetching categories.');
            }
        };

        fetchCategories();
    }, [router]);

    // Fetch subcategories based on selected category
    useEffect(() => {
        const fetchSubCategories = async () => {
            if (!formData.categoryId) return; // Do nothing if no category is selected

            try {
                const storedUserInfo = localStorage.getItem('sessionToken');
                if (!storedUserInfo) {
                    router.push('/admin/login');
                    return;
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/mainServicesSubCategory/${formData.categoryId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setSubCategories(data.data); // Set subcategories data
                } else {
                    console.error('Error fetching subcategories:', response.statusText);
                    toast.error('Failed to fetch subcategories');
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                toast.error('An error occurred while fetching subcategories.');
            }
        };

        fetchSubCategories();
    }, [formData.categoryId, router]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or loading state
    }

    // Handle form field change
    const handleChange = (value: string | File, name: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem('sessionToken');

        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }
        console.log('Form Data Submitted:', formData);

        try {
            const formPayload = new FormData();
            formPayload.append('subTitle', formData.subTitle);
            formPayload.append('categoryId', formData.categoryId);
            formPayload.append('subCategoryId', formData.subCategoryId); // Include subCategoryId
            formPayload.append('videoLink', formData.videoLink);
            formPayload.append('description', formData.description);

            if (formData.logo) {
                formPayload.append('logo', formData.logo); // Append logo file
            }
            if (formData.backgroundImage) {
                formPayload.append('backgroundImage', formData.backgroundImage); // Append logo file
            }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/mainServices`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                },
                body: formPayload, // Send the FormData directly
            });

            if (!response.ok) {
                toast.error('Error updating data');
            } else {
                toast.success('Data Added successfully!');
                // Reset form fields to their initial values
                setFormData({
                    subTitle: '',
                    categoryId: '',
                    subCategoryId: '',
                    logo: null,
                    backgroundImage: null,
                    videoLink: '',
                    description: '',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('An error occurred while submitting the form.');
        }
    };

    return (
        <>
            <div className="bg-gray-100 py-12">
                <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-black">Main Services</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10" encType="multipart/form-data">
                        {/* Name Input */}
                        <div className="flex flex-col gap-4 mb-10">
                            <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
                                Sub Title
                            </label>
                            <input
                                id="subTitle"
                                type="text"
                                name="subTitle"
                                required
                                value={formData.subTitle}
                                onChange={(e) => handleChange(e.target.value, 'subTitle')}
                                placeholder="Sub Title"
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                            />
                            <label htmlFor="logo" className="block text-gray-900 font-semibold mb-2">
                                Logo
                            </label>
                            <input
                                id="logo"
                                type="file"
                                name="logo"
                                onChange={(e) => handleChange(e.target.files![0], 'logo')} // Handle file input
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                            />
                            <label htmlFor="backgroundImage" className="block text-gray-900 font-semibold mb-2">
                            Background Image
                            </label>
                            <input
                                id="backgroundImage"
                                type="file"
                                name="backgroundImage"
                                onChange={(e) => handleChange(e.target.files![0], 'backgroundImage')} // Handle file input
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                            />
                        </div>

                        {/* Video Link */}
                        <label htmlFor="videoLink" className="block text-gray-900 font-semibold mb-2">
                            Video Link
                        </label>
                        <input
                            id="videoLink"
                            type="text"
                            name="videoLink"
                            required
                            value={formData.videoLink}
                            onChange={(e) => handleChange(e.target.value, 'videoLink')}
                            placeholder="videoLink"
                            className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                        />

                        {/* Category Dropdown */}
                        <div className="flex flex-col gap-4 mb-10">
                            <label htmlFor="category" className="block text-gray-900 font-semibold mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                name="categoryId"
                                required
                                value={formData.categoryId}
                                onChange={(e) => handleChange(e.target.value, 'categoryId')}
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none text-gray-900"
                            >
                                <option value="" disabled>
                                    Select a Category
                                </option>
                                {categories.map((category: { id: string; name: string }) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory Dropdown */}
                        {formData.categoryId && (
                            <div className="flex flex-col gap-4 mb-10">
                                <label htmlFor="subCategory" className="block text-gray-900 font-semibold mb-2">
                                    Subcategory
                                </label>
                                <select
                                    id="subCategory"
                                    name="subCategoryId"
                                    required
                                    value={formData.subCategoryId}
                                    onChange={(e) => handleChange(e.target.value, 'subCategoryId')}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none text-gray-900"
                                >
                                    <option value="" disabled>
                                        Select a Subcategory
                                    </option>
                                    {subCategories.map((subCategory: { id: string; name: string }) => (
                                        <option key={subCategory.id} value={subCategory.id}>
                                            {subCategory.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Description Editor */}
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-gray-900 font-semibold mb-2">
                                Description
                            </label>

                            <ReactEditor
                                value={formData.description}
                                onChange={(value: string) => handleChange(value, 'description')}
                                mainProps={{ className: "black" }}
                                placeholder="Description"
                                className="w-full"
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

            <MainServicesTable />
        </>
    );
}
