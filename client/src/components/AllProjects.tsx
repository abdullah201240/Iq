'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
interface Project {
  id: number;
  name: string;
  themeImage: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  project: { id: number; imageName: string; projectId: number }[]; // Added project images
}

interface Category {
  id: number;
  name: string;
}

interface ApiResponseProjects {
  message: string;
  data: Project[];
}

interface ApiResponseCategories {
  message: string;
  data: Category[];
}

export default function AllProjects() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/projectCategory`);
        const result: ApiResponseCategories = await response.json();
        setCategories([{ id: 0, name: 'All Projects' }, ...result.data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch projects based on the selected category
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/projectname?category=${activeCategoryId}`);
        const result: ApiResponseProjects = await response.json();
        setProjects(result.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [activeCategoryId]);

  return (
    <div className="py-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 lg:gap-5 mb-10 ">
  {categories.map((category) => (
    <button
      key={category.id}
      onClick={() => setActiveCategoryId(category.id)}
      className={`inline-flex items-center justify-center px-4 py-3 border rounded-full text-sm  font-medium transition whitespace-nowrap
        ${activeCategoryId === category.id
          ? 'bg-orange-500 text-white border-transparent'
          : 'bg-white text-black border-black hover:bg-gray-100'
        }`}
    >
      {category.name}
    </button>
  ))}
</div>


      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="relative border rounded-lg overflow-hidden group shadow-lg transition-transform transform hover:scale-105"
            >
              {/* Project Image */}
              <Link href={`/projects/${project.id}`}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${project.themeImage}`}
                  alt={project.name}
                  width={400}
                  height={250}
                  className="w-full h-64 object-cover"
                  layout="intrinsic"
                />
              </Link>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center p-2">
                <h3 className="text-lg font-semibold">{project.name}</h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-xl font-semibold text-gray-500">
            No projects available in this category.
          </div>
        )}
      </div>
    </div>
  );
}
