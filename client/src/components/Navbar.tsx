"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/img/icon.webp";

// Define TypeScript interfaces
interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subCategories?: Subcategory[];
}

const Navbar = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Store categories and subcategories
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false); // Separate state for mobile dropdown

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false); // Separate state for mobile dropdown
  const [isScrolled, setIsScrolled] = useState(false); // Track scroll position
  const [isClient, setIsClient] = useState(false); // Track if it's on the client side

  // Create a ref for the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true); // When you scroll down
      } else {
        setIsScrolled(false); // At the top of the page
      }
    };

    // Click outside listener to close the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Only close dropdown if it's open and the click is outside the dropdown or button
      if (
        isDesktopDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !target.closest('.relative') // Ensure click is not inside the button that toggles the dropdown
      ) {
        setIsDesktopDropdownOpen(false); // Close the dropdown
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside); // Listen for outside clicks

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside); // Clean up listener
    };
  }, [isDesktopDropdownOpen]); // Depend on dropdown state to trigger re-bind




  // Fetch categories and subcategories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/mainServicesCategory`); // Replace with your API endpoint
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const toggleMobileDropdown = () =>
    setIsMobileDropdownOpen((prev) => !prev); // Toggle mobile dropdown

  const toggleDesktopDropdown = () => {
    setIsDesktopDropdownOpen((prev) => !prev); // Toggling state
  };


  // If it's not the client, return null to avoid hydration errors
  if (!isClient) {
    return null;
  }

  return (
    <nav
      className={`${isScrolled ? "shadow-md" : ""} fixed top-0 left-0 right-0 z-50`}
      style={{ backgroundColor: "#8d8d8d", opacity: 0.95 }}
    >
      <div className="mx-auto max-w-[1330px] px-2 sm:px-4 lg:px-6">
        <div className="relative flex items-center justify-between h-20">
          {/* Mobile and Tablet menu button */}
          <div className="lg:hidden">
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

              {/* Dropdown for Services */}
              <div className="relative">
                <button
                  className="px-3 py-2 text-medium font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
                  onClick={toggleDesktopDropdown}
                >
                  Services
                  <svg
                    className={`w-5 h-5 ml-1 inline-block ${isDesktopDropdownOpen ? "rotate-180" : ""} transition-transform`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isDesktopDropdownOpen && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <ul className="py-2 text-sm text-gray-700">
                      {/* Dynamically render categories and subcategories */}
                      {categories.map((category) => (
                        <li key={category.id} className="relative group">
                          <p className="block px-4 py-2 hover:bg-gray-100">
                            {category.name}
                          </p>
                          {category.subCategories && category.subCategories.length > 0 && (
                            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block w-48 bg-white shadow-lg rounded-md">
                              {category.subCategories.map((subCategory) => (
                                <li key={subCategory.id}>
                                  <Link
                                    href={{
                                      pathname: `/service/${category.name}/${subCategory.name}`,
                                      


                                    }}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    scroll={false}
                                  >
                                    {subCategory.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
      <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`} id="mobile-menu">
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
          <div className="block">
            <button
              onClick={toggleMobileDropdown}
              className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-[#f17b21] hover:text-white rounded-md"
            >
              Services
            </button>
            {isMobileDropdownOpen && (
              <div className="space-y-1 px-2">
                {categories.map((category) => (
                  <div key={category.id} className="block">
                    <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md">
                      {category.name}
                    </button>
                    {category.subCategories && category.subCategories.length > 0 && (
                      <div className="pl-4">
                        {category.subCategories.map((subCategory) => (
                          <Link
                            key={subCategory.id}
                            href={`/services/${category.name.toLowerCase()}/${subCategory.name.toLowerCase()}`}
                            className="block px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
