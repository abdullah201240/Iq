"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/img/icon.webp";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // Track scroll position
    const [isClient, setIsClient] = useState(false); // Track if it's on the client side

    // Set the `isClient` state after the component mounts to avoid hydration issues
    useEffect(() => {
        setIsClient(true);

        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true); // When you scroll down
            } else {
                setIsScrolled(false); // At the top of the page
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll); // Cleanup on unmount
    }, []);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    // If it's not the client, return null to avoid hydration errors
    if (!isClient) {
        return null;
    }

    return (
      <nav
    className={`${
        isScrolled ? "shadow-md" : ""
    } fixed top-0 left-0 right-0 z-50`}
    style={{ backgroundColor: "#8d8d8d", opacity: 0.95 }}
>
    <div className="mx-auto max-w-[1330px] px-2 sm:px-4 lg:px-6">
        <div className="relative flex items-center justify-between h-20">
            {/* Mobile and Tablet menu button */}
            <div className="lg:hidden">
                {/* Changed from md:hidden to lg:hidden */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:bg-[#f17b21] hover:text-white focus:outline-none"
                    aria-controls="mobile-menu"
                    aria-expanded={isMenuOpen ? "true" : "false"}
                    onClick={toggleMenu}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg
                        className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="white"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                    <svg
                        className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="white"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            {/* Logo/Branding */}
            <div className="flex items-center">
                <div className="grid-element relative w-32 h-16">
                    <Link href="/" className="text-white text-2xl font-semibold">
                        <Image
                            src={Logo}
                            alt="IQ LOGO"
                            fill
                            sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 120px"
                            style={{ objectFit: "contain" }}
                        />
                    </Link>
                </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:block">
                {/* Changed from md:block to lg:block */}
                <div className="flex space-x-4">
                    <Link
                        href="/"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                        aria-current="page"
                    >
                        Home
                    </Link>
                    <Link
                        href="/aboutUs"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        About Us
                    </Link>
                    <Link
                        href="#"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Services
                    </Link>
                    <Link
                        href="/projects"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/story"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Story
                    </Link>
                    <Link
                        href="/gallery"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/career"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Career
                    </Link>
                    <Link
                        href="/blog"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/contactUs"
                        className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    </div>

    {/* Mobile and Tablet Menu */}
    <div
        className={` lg:hidden ${isMenuOpen ? "block" : "hidden"}` }
        id="mobile-menu"
    >
        {/* Changed from md:hidden to lg:hidden */}
        <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                aria-current="page"
            >
                Home
            </Link>
            <Link
                href="/aboutUs"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                About Us
            </Link>
            <Link
                href="#"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Services
            </Link>
            <Link
                href="/projects"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Projects
            </Link>
            <Link
                href="/story"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                 Story
            </Link>
            <Link
                href="/gallery"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Gallery
            </Link>
            <Link
                href="/career"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Career
            </Link>
            <Link
                href="/blog"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Blog
            </Link>
            <Link
                href="/contactUs"
                className="block px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
                Contact Us
            </Link>
        </div>
    </div>
</nav>

    );
};

export default Navbar;

