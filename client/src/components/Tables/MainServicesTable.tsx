'use client';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';

interface MainServices {
    id: number;
    subTitle: string;
    logo: string;
    videoLink: string;
    description: string;
    category: { name: string }
    subCategory: { name: string }

}

const MainServicesTable = () => {
    const router = useRouter();
    const [mainServices, setMainServices] = useState<MainServices[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const storedUserInfo = localStorage.getItem('sessionToken');
            if (!storedUserInfo) {
                toast.error('Session expired. Redirecting to login...');
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
                    toast.error('Unauthorized access. Redirecting to login...');
                    router.push('/admin/login');
                    return;
                }

                const teamResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/mainServices`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (teamResponse.ok) {
                    const data = await teamResponse.json();
                    if (Array.isArray(data.data)) {
                        setMainServices(data.data);
                        console.log(data.data)
                        toast.success('Categories loaded successfully!');
                    } else {
                        toast.error('Unexpected response format.');
                    }
                } else {
                    toast.error('Failed to fetch categories.');
                }
            } catch (error) {
                if (error) {
                    toast.error('An error occurred while checking session.');
                    router.push('/admin/login');
                }

            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    const handleDelete = async (id: number) => {
        const storedUserInfo = localStorage.getItem('sessionToken');
        if (!storedUserInfo) {
            toast.error('Session expired. Redirecting to login...');
            router.push('/admin/login');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/mainServices/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${storedUserInfo}`,
                    },
                }
            );

            if (response.ok) {
                setMainServices(mainServices.filter((mainService) => mainService.id !== id));
                toast.success('Sub Category deleted successfully!');
                setShowConfirm(false);
            } else {
                toast.error('Failed to delete sub category.');
            }
        } catch (error) {
            if (error) {
                toast.error('An error occurred while deleting the category.');
            }
        }
    };

    const showDeleteConfirm = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const hideDeleteConfirm = () => {
        setShowConfirm(false);
        setDeleteId(null);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-black">
                All Sub Categories
            </h4>

            <div className="flex flex-col text-white">
                <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Categories Name
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Sub Categories Name
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Sub Title
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Video Link
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Image
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Description
                        </h5>
                    </div>

                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Actions
                        </h5>
                    </div>
                </div>

                {mainServices.length > 0 ? (
                    mainServices.map((mainService) => (
                        <div
                            className={`grid grid-cols-7 sm:grid-cols-7 ${mainServices.indexOf(mainService) === mainServices.length - 1
                                ? ''
                                : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={mainService.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{mainService.category.name}</p>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{mainService.subCategory.name}</p>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{mainService.subTitle}</p>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">
                                    <Link href={mainService.videoLink} target="_blank" rel="noopener noreferrer">
                                        Link
                                    </Link>
                                </p>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${mainService.logo}`}
                                    alt="image"
                                    height={100}
                                    width={100}
                                />
                            </div>

                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p
                                    className="text-black"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            mainService.description
                                                .split(" ")
                                                .slice(0, 50)
                                                .join(" ") + "..."
                                        ),
                                    }}
                                ></p>
                            </div>

                            <div className="flex items-center justify-center gap-2 p-2.5 xl:p-5">
                                <button
                                    className="text-red-500"
                                    onClick={() => showDeleteConfirm(mainService.id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>No categories found.</p>
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Are you sure you want to delete this Service?
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
        </div>
    );
};

export default MainServicesTable;
