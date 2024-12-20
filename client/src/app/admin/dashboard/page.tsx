'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Profile {
  
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  
}

export default function Page() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile | null>(null); // Use a single profile
  const [loading, setLoading] = useState<boolean>(true); // Loading state

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
        } else {
          console.log(response)
          const data = await response.json();
          setProfiles(data); // Assuming the API returns a data object containing the profile
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

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  if (!profiles) {
    return <div>No profile data available</div>; // Show message if no profile is available
  }

  return (
    <div>
      <div className="bg-white overflow-hidden shadow rounded-lg border">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            This is some information about the Admin.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profiles.name}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profiles.email}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profiles.phone}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profiles.dob}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profiles.gender}</dd>
            </div>
            
          </dl>
        </div>
      </div>
    </div>
  );
}
