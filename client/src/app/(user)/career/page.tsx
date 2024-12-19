"use client";
import React, { useRef } from 'react';
import CareerTitle from '@/components/CareerTitle';
import Footer from '@/components/Footer';
import JobList from '@/components/JobList';
import Navbar from '@/components/Navbar';
import Whatsapp from '@/components/Whatsapp';
import WhyWorkwithUs from '@/components/WhyWorkwithUs';

export default function Page() {
  // Explicitly type the ref as a reference to a div element
  const jobListRef = useRef<HTMLDivElement>(null);

  // Function to handle the scrolling behavior
  const handleJobOpeningsClick = () => {
    if (jobListRef.current) {
      jobListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Navbar />
      <CareerTitle onJobOpeningsClick={handleJobOpeningsClick} />
      <WhyWorkwithUs />
      
      {/* Pass the ref to JobList */}
      <div ref={jobListRef}>
        <JobList />
      </div>

      <Whatsapp />
      <Footer />
    </div>
  );
}
