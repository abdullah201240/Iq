// pages/projects/[id].tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../components/Navbar';

interface Project {
  id: number;
  name: string;
  themeImage: string;
  project: { id: number; imageName: string; projectId: number }[];
}

const ProjectImage: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const router = useRouter();
  const { id } = router.query; // Access project ID from the URL

  // Fetch project details by ID
  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/project/${id}`);
          const result = await response.json();
          setProject(result.data);
        } catch (error) {
          console.error('Error fetching project:', error);
        }
      };

      fetchProject();
    }
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-center mb-6">{project.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {project.project.map((image, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden group shadow-lg transition-transform transform hover:scale-105"
            >
              {/* Project Image */}
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/upload/${image.imageName}`}
                alt={`Project Image ${index + 1}`}
                width={400}
                height={250}
                className="w-full h-64 object-cover"
                layout="intrinsic"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectImage;
