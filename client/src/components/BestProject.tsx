'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: number;
  image: string;
}

export default function BestProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/viewBestProject`);
        const result = await response.json();
        if (response.ok) {
          setProjects(result.data);
        } else {
          setError(result.message || 'Failed to load projects.');
        }
      } catch (error) {
        console.log(error)
        setError('Error fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="text-lg font-semibold text-gray-500">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="text-lg font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
    <div className="mx-auto px-4 md:px-8">
      <h2 className="text-2xl font-semibold text-center mb-8">Our Best Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects[0] && (
          <div className="md:col-span-2 relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl">
            <Link href="/projects">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${projects[0].image}`}
              alt={`Project ${projects[0].id}`}
              layout="responsive"
              width={500}
              height={300}
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            </Link>
           
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          {projects.slice(1, 3).map((project) => (
            <div
              key={project.id}
              className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl"
            >
                          <Link href="/projects">

              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${project.image}`}
                alt={`Project ${project.id}`}
                layout="responsive"
                width={500}
                height={300}
                objectFit="cover"
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
              </Link>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
}
