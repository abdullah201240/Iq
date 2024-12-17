"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
interface ApplyFromProps {
  jobId: string | undefined; // Define the prop type
}
const ApplyFrom: React.FC<ApplyFromProps> = ({ jobId }) => {

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    salary: "",
    choosePosition: "",
    portfolio: "",
    resume: null,
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || null,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Display loading toast
    toast.loading("Submitting your application...");

    // Create FormData for file uploads
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key as keyof typeof formData] as string | Blob);
    }
    // Append jobId to the payload
  if (jobId) {
    payload.append("jobId", jobId);
  }
   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/applyJob`, {
        method: "POST",
        body: payload,
      });

      // Check if the response is successful
      if (response.ok) {
        toast.dismiss(); // Dismiss the loading toast
        toast.success("Application submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          education: "",
          experience: "",
          salary: "",
          choosePosition: "",
          portfolio: "",
          resume: null,
        });
      } 
      else if(response.status === 409){
        toast.dismiss();
        toast.error("You have already applied for this job.");
      }
      
      else {
        toast.error("Failed to submit application.");
      }
    } catch (error) {
      toast.dismiss();
      if (error) {
        toast.error("Error submitting application. Please try again.");

      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10 lg:pl-40">
          <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2 m-4">Application Form</h1>
              <p className="text-lg m-4">Fill out the form below to apply for this position.</p>
            </div>

            <div className="p-6 m-4">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium">
                    Phone:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-gray-700 font-medium">
                    Address:
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your current address"
                  ></textarea>
                </div>

                {/* Education */}
                <div>
                  <label htmlFor="education" className="block text-gray-700 font-medium">
                    Educational Background:
                  </label>
                  <input
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide details of your educational background"
                  ></input>
                </div>
                {/* Job Experience */}
                <div>
                  <label htmlFor="experience" className="block text-gray-700 font-medium">
                    Job Experience (Years):
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your job experience in years"
                  />
                </div>
                {/* Expected Salary */}
                <div>
                  <label htmlFor="salary" className="block text-gray-700 font-medium">
                    Expected Salary:
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your expected salary"
                  />
                </div>
                {/* Why Choose This Position */}
                <div>
                  <label htmlFor="choosePosition" className="block text-gray-700 font-medium">
                    Why do you choose this position?
                  </label>
                  <textarea
                    id="choosePosition"
                    name="choosePosition"
                    value={formData.choosePosition}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain why you're interested in this role"
                  ></textarea>
                </div>
                {/* Portfolio Link */}
                <div>
                  <label htmlFor="portfolio" className="block text-gray-700 font-medium">
                    Design Portfolio Link:
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the URL to your design portfolio"
                  />
                </div>
                {/* Attach Resume */}
                <div>
                  <label htmlFor="resume" className="block text-gray-700 font-medium">
                    Attach Resume (PDF):
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-6 py-3 text-white font-medium bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default ApplyFrom;

