"use client";

import React, { useEffect, useState } from 'react';
import TestimonialCard from '@/components/TestimonialCard';

interface Testimonial {
  title: string;
  description: string;
  image: string;
  designation: string;
}

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch testimonials from the API
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/testimonial`);
        const data: Testimonial[] = await response.json();

        if (response.ok) {
         
          const modifiedTestimonials = data.map((testimonial) => ({
            ...testimonial,
            name: testimonial.title, // You can adjust this as needed
            text: testimonial.description, // Adjust if needed
          }));
          setTestimonials(modifiedTestimonials);
        } else {
          throw new Error('Failed to fetch testimonials');
        }
      } catch (err: unknown) {
        // Type assertion to Error to ensure safe access of message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <section className="bg-[#FFCBA3]">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h1 className="text-center text-4xl mb-10 tracking-tight text-black sm:text-3xl font-medium">
          
          Testimonials
        </h1>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
