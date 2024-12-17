'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ReactEditor from "react-text-editor-kit";
import Link from 'next/link';

interface Job {
    id: number;
    deadline: string;
    position: string;
    location: string;
    experience: string;
    salary: string;
    vacancies: string;
    keyResponsibilities: string;
    skillsExperience: string;
    description: string;
}

const JobTable = () => {
    const router = useRouter();
    const [teams, setTeams] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
    const [formValues, setFormValues] = useState<Job>({
        id: 0,
        deadline: '',
        position: '',
        location: '',
        experience: '',
        salary: '',
        vacancies: '',
        keyResponsibilities: '',
        skillsExperience: '',
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

                // Fetching the jobs data once session is valid
                const jobResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/job`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (jobResponse.ok) {
                    const data = await jobResponse.json();
                    if (Array.isArray(data.data)) {
                        setTeams(data.data);
                    } else {
                        console.error('Fetched data is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch job data');
                }
            } catch (error) {
                console.error('Error checking session:', error);
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    // Handle job deletion
    const handleDelete = async (id: number) => {
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/job/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                }
            );

            if (response.ok) {
                setTeams(teams.filter((team) => team.id !== id));
                setShowConfirm(false);
            } else {
                console.error('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
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
    const handleEdit = (job: Job) => {
        setCurrentJob(job);
        setFormValues(job);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            router.push('/admin/login');
            return;
        }

        // Directly use the form values as an object
        const jobData = {
            deadline: formValues.deadline,
            position: formValues.position,
            location: formValues.location,
            experience: formValues.experience,
            salary: formValues.salary,
            vacancies: formValues.vacancies,
            keyResponsibilities: formValues.keyResponsibilities,
            skillsExperience: formValues.skillsExperience,
            description: formValues.description,
        };

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/job/${formValues.id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jobData), // Send the data as JSON
                }
            );

            if (response.ok) {
                const updatedJob = await response.json();
                const updatedJobs = teams.map((job) =>
                    job.id === formValues.id ? updatedJob : job
                );
                setTeams(updatedJobs);
                setIsModalOpen(false);
            } else {
                console.error('Failed to update job');
            }
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                All Jobs
            </h4>

            <div className="flex flex-col text-white">
                <div className="grid grid-cols-8 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-8">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Position
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Location
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Experience
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Vacancies

                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Deadline
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Salary
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Actions
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            View
                        </h5>
                    </div>
                </div>

                {teams.length > 0 ? (
                    teams.map((job) => (
                        <div
                            className={`grid grid-cols-8 sm:grid-cols-8 ${teams.indexOf(job) === teams.length - 1
                                ? ''
                                : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={job.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{job.position}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{job.location}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{job.experience}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{job.vacancies}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
                                <p className="text-black">{job.deadline}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
                                <p className="text-black">{job.salary}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                <button
                                    className="text-blue-500"
                                    onClick={() => handleEdit(job)}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="text-red-500"
                                    onClick={() => showDeleteConfirm(job.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                <Link href={`/admin/jobs/${job.id}`}>
                                    <button
                                        className="px-6 py-2 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        View
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>No jobs found.</p>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Are you sure you want to delete this job?
                        </h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(deleteId as number)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
                            >
                                Yes
                            </button>
                            <button
                                onClick={hideDeleteConfirm}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Update Job Modal */}
            {isModalOpen && currentJob && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/2 max-w-4xl max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-semibold text-center mb-4">Update Job</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Position"
                                value={formValues.position}
                                onChange={(e) => setFormValues({ ...formValues, position: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={formValues.location}
                                onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Experience"
                                value={formValues.experience}
                                onChange={(e) => setFormValues({ ...formValues, experience: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Salary"
                                value={formValues.salary}
                                onChange={(e) => setFormValues({ ...formValues, salary: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Vacancies"
                                value={formValues.vacancies}
                                onChange={(e) => setFormValues({ ...formValues, vacancies: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded"
                            />

                            <ReactEditor
                                value={formValues.description}
                                onChange={(content: string) =>
                                    setFormValues({ ...formValues, description: content })
                                }
                                mainProps={{ className: "black" }}
                                placeholder="Enter Job Description"
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                            <ReactEditor
                                value={formValues.skillsExperience}
                                onChange={(content: string) =>
                                    setFormValues({ ...formValues, skillsExperience: content })
                                }
                                mainProps={{ className: "black" }}
                                placeholder="Skills and Experience"
                                className="w-full p-2 border border-gray-300 rounded"
                            />

                            <ReactEditor
                                value={formValues.keyResponsibilities}
                                onChange={(content: string) =>
                                    setFormValues({ ...formValues, keyResponsibilities: content })
                                }
                                mainProps={{ className: "black" }}
                                placeholder="Key Responsibilities"
                                className="w-full p-2 border border-gray-300 rounded"
                            />

                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default JobTable;
