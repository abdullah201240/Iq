"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTachometerAlt, FaInfoCircle, FaQuoteLeft, FaUsers, FaConciergeBell, FaEnvelope, FaProjectDiagram, FaRegThumbsUp, FaHandsHelping, FaBlog, FaBriefcase } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <FaTachometerAlt />,
        label: "Dashboard",
        route: "/admin/dashboard",
      },
      {
        icon: <FaInfoCircle />,
        label: "About Us",
        route: "/admin/aboutUs",
      },
      {
        icon: <FaQuoteLeft />,
        label: "Testimonial",
        route: "/admin/testimonials",
      },
      {
        icon: <FaUsers />,
        label: "Team",
        route: "/admin/team",
      },
      {
        icon: <FaConciergeBell />,
        label: "Services",
        route: "/admin/services",
      },
      {
        icon: <FaEnvelope />,
        label: "Contact",
        route: "/admin/contact",
      },
      {
        icon: <FaProjectDiagram />,
        label: "Project",
        route: "/admin/projects",
      },
      {
        icon: <FaRegThumbsUp />,
        label: "We Achieved",
        route: "/admin/weAchieved",
      },
      {
        icon: <FaHandsHelping />,
        label: "Client",
        route: "/admin/client",
      },
      {
        icon: <FaBriefcase />,
        label: "Best Project",
        route: "/admin/bestProject",
      },
      {
        icon: <IoMdCreate />,
        label: "Story",
        route: "/admin/story",
      },
      {
        icon: <FaBlog />,
        label: "Blog",
        route: "/admin/blog",
      },
      {
        icon: <FaBriefcase />,
        label: "Job",
        route: "/admin/job",
      },
      {
        icon: <FaConciergeBell />,
        label: "Main Services",
        route: "#",
        children: [
          { label: "Category", route: "/admin/mainServices/category" },
          { label: "Subcategory", route: "/admin/mainServices/subcategory" },
          { label: "Services", route: "/admin/mainServices/services" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/admin/dashboard">
            <Image
              width={50}
              height={32}
              src={"/images/logo/Logo.webp"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* SVG code for hamburger menu, if needed */}
            </svg>
          </button>
        </div>
        {/* SIDEBAR HEADER */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
