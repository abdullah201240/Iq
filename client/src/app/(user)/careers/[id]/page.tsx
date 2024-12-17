"use client";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Whatsapp from "@/components/Whatsapp";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ApplyFrom from '@/components/ApplyFrom';

interface Job {
  id: number;
  position: string;
  location: string;
  experience: string;
  description: string;
  salary: string;
  deadline: string;
  vacancies: string;
  keyResponsibilities: string;
  skillsExperience: string;
}

export default function Page() {
  const params = useParams();
  const id = params?.id; // Safely access the 'id' parameter

  // State to store job details and loading state
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State to toggle between job details and apply form
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/job/${id}`);
        const data = await response.json();

        if (response.ok) {
          setJobDetails(data.data);
        } else {
          setError(data.message || "Failed to fetch job details");
        }
      } catch {
        setError("An error occurred while fetching job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);
  // Function to check if the deadline has passed
  const isDeadlinePassed = (): boolean => {
    if (jobDetails?.deadline) {
      const currentDate = new Date();
      const deadlineDate = new Date(jobDetails.deadline);
      return currentDate > deadlineDate;
    }
    return false;
  };

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* Conditional Rendering */}
        {!showApplyForm ? (
          <div className="container mx-auto px-4 py-10 lg:pl-40 mt-15">
            <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2 m-4">Job Information</h1>
                <p className="text-lg m-4">Discover your next career opportunity!</p>
              </div>

              {/* Job Details */}
              <div className="p-6 space-y-4 m-4">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">Position:</span>
                  <p className="text-gray-600">{jobDetails?.position}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">Location:</span>
                  <p className="text-gray-600">{jobDetails?.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">Deadline:</span>
                  <p className="text-gray-600">{jobDetails?.deadline}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">Salary:</span>
                  <p className="text-gray-600">{jobDetails?.salary}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">Vacancies:</span>
                  <p className="text-gray-600">{jobDetails?.vacancies}</p>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-6 space-y-4 m-4">
                <h2 className="text-2xl font-bold text-gray-800">Job Description</h2>
                <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: jobDetails?.description || "" }} />

                <h2 className="text-2xl font-bold text-gray-800">Key Responsibilities</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2" dangerouslySetInnerHTML={{ __html: jobDetails?.keyResponsibilities || "" }} />


                <h2 className="text-2xl font-bold text-gray-800">Skills & Experience</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2" dangerouslySetInnerHTML={{ __html: jobDetails?.skillsExperience || "" }} />

              </div>

              {/* Apply Now Button */}
              {!isDeadlinePassed() && (
                <div className="p-6 border-t bg-gray-50 flex justify-center">
                  <button
                    className="px-6 py-3 text-white font-medium bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
                    onClick={() => setShowApplyForm(true)} // Show apply form on click
                  >
                    Apply Now
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='mt-15'>
            <ApplyFrom jobId={typeof id === "string" ? id : undefined} />
          </div>
        )}
      </main>
      {/* Footer */}
      <Footer />

      {/* WhatsApp Widget */}
      <Whatsapp />
    </div>
  );
}
