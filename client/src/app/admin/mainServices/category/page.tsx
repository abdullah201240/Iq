'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';


// Dynamically importing JobTable with SSR disabled
const MainServicesCategoryTable = dynamic(() => import('@/components/Tables/MainServicesCategoryTable'), {
    ssr: false, // Disable SSR for this component
});


export default function Home() {


    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
    });

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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or loading state
    }

    // Handle form field change
    const handleChange = (value: string, name: string) => {
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
            const form = new FormData();
            form.append('name', formData.name);


            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/mainServicesCategory`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${storedUserInfo}`,
                    'Content-Type': 'application/json', // Ensure you're sending JSON

                },
                body: JSON.stringify(formData), // Send the form data as JSON
            });

            if (!response.ok) {
                toast.error('Error updating data');
            } else {
                toast.success('Data Added successfully!');
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
                        <h2 className="text-3xl font-bold text-black">Category</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10">
                        <div className="flex gap-4 mb-10">

                            <label htmlFor="Name" className="block text-gray-900 font-semibold mb-2">
                                Name
                            </label>
                            <br/>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange(e.target.value, 'name')}
                                placeholder="Name"
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
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

            <MainServicesCategoryTable />
        </>
    );
}
