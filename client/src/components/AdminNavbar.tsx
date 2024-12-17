"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/app/assets/img/icon.webp';
import { useRouter } from "next/navigation"; // For programmatic navigation

export default function AdminNavbar() {
  const router = useRouter(); // Next.js router for navigation
  const handleLogout = () => {
    // Clear authentication data (example: localStorage)
    localStorage.removeItem("sessionToken");

    // Navigate to login page
    router.push("/admin/login");
};
  return (
    <div>
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        aria-expanded="false"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-42 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Link href="/" className="flex items-center ps-2.5 mb-5">
            <Image
              src={Logo}
              className="h-8 me-3 sm:h-10"
              width={40}
              height={40}
              alt="Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-900 dark:text-white">
              IQ Architects
            </span>
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>



            <li>
              <Link
                href="/admin/aboutUs"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M9 0a9 9 0 1 0 9 9A9 9 0 0 0 9 0Zm0 16.2A7.2 7.2 0 1 1 16.2 9 7.2 7.2 0 0 1 9 16.2ZM8.1 6.3a1.35 1.35 0 1 1 1.35 1.35A1.35 1.35 0 0 1 8.1 6.3Zm.9 8.1h1.8V8.1H9Z" />
                </svg>
                <span className="ms-3">About Us</span>
              </Link>

              
              <Link
                href="/admin/testimonials"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18C5.589 18 2 14.411 2 10S5.589 2 10 2s8 3.589 8 8-3.589 8-8 8zm-2-5h4v2H8v-2z"
                  />
                </svg>
                <span className="ms-3">Testimonials</span>
              </Link>
              <Link
                href="/admin/add"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0a1 1 0 011 1v7h7a1 1 0 110 2h-7v7a1 1 0 11-2 0v-7H3a1 1 0 110-2h7V1a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ms-3">Add Admin</span>
              </Link>
              <Link
                href="/admin/team"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M4 4a4 4 0 118 0 4 4 0 01-8 0zm12 0a4 4 0 118 0 4 4 0 01-8 0zm0 8a6 6 0 10-12 0 6 6 0 0012 0z"
                  />
                </svg>
                <span className="ms-3">Team Member</span>
              </Link>

            

              <button
                onClick={handleLogout}
                className="flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a7 7 0 1114 0 7 7 0 01-14 0zm7-4a.75.75 0 00-1.5 0v4.25H6a.75.75 0 000 1.5h3.25V14a.75.75 0 001.5 0v-6.25z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ms-3">Logout</span>
              </button>
            
             
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
