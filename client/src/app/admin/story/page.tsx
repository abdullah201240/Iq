'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';

const StoryTable = dynamic(() => import('@/components/Tables/StoryTable'), {
    ssr: false, // Disable SSR for this component
});

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        link: '',
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

    // Handling form submission
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem('sessionToken');

        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/createStory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Sending as JSON
                    Authorization: `Bearer ${storedUserInfo}`,
                },
                body: JSON.stringify(formData), // Send formData as JSON
            });

            if (!response.ok) {
                toast.error('Error updating data');
            } else {
                toast.success('Data Added successfully!');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        if (target) {
            const { name, value } = target;
            setFormData((prev) => ({
                ...prev,
                [name]: value, // Directly updating the link value
            }));
        }
    };

    return (
        <>
                <div className="bg-gray-100 py-12">
                    <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-black">Story</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-10">
                            <div className="flex gap-4 mb-6">
                                <div className="w-1/2 mb-6">
                                    <label htmlFor="link" className="block text-gray-900 font-semibold mb-2">
                                        Video Link
                                    </label>

                                    <input
                                        id="link"
                                        type="text"
                                        name="link"
                                        placeholder="Video Link"
                                        required
                                        onChange={handleChange}
                                        value={formData.link} // Ensure controlled input
                                        className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black"
                                    />
                                </div>
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

                <StoryTable />
           
        </>
    );
}
