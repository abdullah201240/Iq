'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Contact {
    id: number;
    name: string,
    email: string,
    phone: string ,
    subject: string ,
    description: string,
}

const ContactTable = () => {
    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Start with loading as true
   

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

                // Fetching the teams data once session is valid
                const contactResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/contacts`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${storedUserInfo}`,
                        },
                    }
                );

                if (contactResponse.ok) {
                    const data = await contactResponse.json(); // Parse response data
                    // Ensure that the data is an array before setting it


                    if (Array.isArray(data.data)) {
                        const sortedContacts = data.data.sort((a: Contact, b: Contact) => b.id - a.id);

                        setContacts(sortedContacts); // Update state with the fetched team
                    } else {
                        console.error('Fetched data is not an array:', data);
                    }
                } else {
                    console.error('Failed to fetch team');
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



    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default  sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-2xl font-semibold text-black dark:text-black">
                Contact List
            </h4>

            <div className="flex flex-col text-white">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Name
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base text-white">
                            Email
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                         Subject 
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                         Phone 
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Description
                        </h5>
                    </div>
        
                </div>

                {contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <div
                            className={`grid grid-cols-5 sm:grid-cols-5 ${contacts.indexOf(contact) === contacts.length - 1
                                    ? ''
                                    : 'border-b border-stroke dark:border-strokedark'
                                }`}
                            key={contact.id}
                        >
                            <div className="flex items-center gap-3 p-2.5 xl:p-5">
                                <p className="text-black">{contact.name}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{contact.email}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{contact.subject}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-black">{contact.phone}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
                                <p className="text-black">{contact.description}</p>
                            </div>
                         

                            

                            
                            
                        </div>
                    ))
                ) : loading ? (
                    <p>Loading...</p>
                ) : (
                    <p>No contact found.</p>
                )}
            </div>
      

           
        </div>
    );
};

export default ContactTable;
