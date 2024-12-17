'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';


// Dynamically importing JobTable with SSR disabled
const JobTable = dynamic(() => import('@/components/Tables/JobTable'), {
    ssr: false, // Disable SSR for this component
});
const ReactEditor = dynamic(() => import('react-text-editor-kit'), {
    ssr: false,
});

export default function Home() {


    const router = useRouter();
    const [formData, setFormData] = useState({
        deadline: '',
        position: '',
        location: '',
        description: '',
        salary: '',
        experience: '',
        vacancies: '',
        keyResponsibilities: '',
        skillsExperience: '',
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
            form.append('position', formData.position);
            form.append('description', formData.description);
            form.append('deadline', formData.deadline);
            form.append('salary', formData.salary);
            form.append('experience', formData.experience);
            form.append('location', formData.location);
            form.append('vacancies', formData.vacancies);
            form.append('keyResponsibilities', formData.keyResponsibilities);
            form.append('skillsExperience', formData.skillsExperience);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/job`, {
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
                        <h2 className="text-3xl font-bold text-black">Create Job</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-10">
                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2">
                                <label htmlFor="Position" className="block text-gray-900 font-semibold mb-2">
                                    Position
                                </label>
                                <input
                                    id="position"
                                    type="text"
                                    name="position"
                                    required
                                    value={formData.position}
                                    onChange={(e) => handleChange(e.target.value, 'position')}
                                    placeholder="Position"
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="Location" className="block text-gray-900 font-semibold mb-2">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={(e) => handleChange(e.target.value, 'location')}
                                    placeholder="Location"
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <div className="w-1/2">
                                <label htmlFor="Deadline" className="block text-gray-900 font-semibold mb-2">
                                    Deadline
                                </label>
                                <input
                                    id="deadline"
                                    type="date"
                                    name="deadline"
                                    required
                                    value={formData.deadline}
                                    onChange={(e) => handleChange(e.target.value, 'deadline')}
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="Experience" className="block text-gray-900 font-semibold mb-2">
                                Experience
                                </label>
                                <input
                                    id="experience"
                                    type="text"
                                    name="experience"
                                    required
                                    value={formData.experience}
                                    onChange={(e) => handleChange(e.target.value, 'experience')}
                                    placeholder="experience"
                                    className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mb-6">

                        <div className="w-1/2 mb-6">
                            <label htmlFor="Salary" className="block text-gray-900 font-semibold mb-2">
                                Salary
                            </label>
                            <input
                                id="salary"
                                type="text"
                                name="salary"
                                required
                                value={formData.salary}
                                onChange={(e) => handleChange(e.target.value, 'salary')}
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black"
                            />
                        </div>

                        {/* Vacancies */}
                        <div className="w-1/2 mb-6">
                            <label htmlFor="vacancies" className="block text-gray-900 font-semibold mb-2">
                                Vacancies
                            </label>
                            <input
                                id="vacancies"
                                type="text"
                                name="vacancies"
                                required
                                value={formData.vacancies}
                                onChange={(e) => handleChange(e.target.value, 'vacancies')}
                                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black"
                            />
                        </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-gray-900 font-semibold mb-2">
                                Job Description
                            </label>
                            <ReactEditor
                                value={formData.description}
                                onChange={(value: string) => handleChange(value, 'description')}
                                mainProps={{ className: "black" }}
                                placeholder="Enter Job Description"
                                className="w-full"
                            />
                        </div>


                        {/* Key Responsibilities */}
                        <div className="mb-6">
                            <label htmlFor="keyResponsibilities" className="block text-gray-900 font-semibold mb-2">
                                Key Responsibilities
                            </label>

                            <ReactEditor
                                value={formData.keyResponsibilities}
                                onChange={(value: string) => handleChange(value, 'keyResponsibilities')}
                                mainProps={{ className: "black" }}
                                placeholder=" Key Responsibilities"
                                className="w-full"
                            />





                        </div>

                        {/* Skills & Experience */}
                        <div className="mb-6">
                            <label htmlFor="skillsExperience" className="block text-gray-900 font-semibold mb-2">
                                Skills & Experience
                            </label>

                            <ReactEditor
                                value={formData.skillsExperience}
                                onChange={(value: string) => handleChange(value, 'skillsExperience')}
                                mainProps={{ className: "black" }}
                                placeholder=" Skills & Experience"
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

            {/* Conditionally render TeamTable */}
            <JobTable />
        </>
    );
}
