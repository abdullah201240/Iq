'use client';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Cart = dynamic(() => import('@/components/Cart'));
const HeroSection = dynamic(() => import('@/components/HeroSection'));
const AboutUs = dynamic(() => import('@/components/AboutUs'));
const WeOffer = dynamic(() => import('@/components/WeOffer'));

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const storedUserInfo = localStorage.getItem('sessionToken');
      if (!storedUserInfo) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedUserInfo}`,
            },
          }
        );

        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const result = await response.json();
        console.log(result); // Handle the response as needed
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/admin/login');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div>
      <HeroSection />
      <AboutUs />
      <WeOffer />
      <Cart />
      <Footer />
    </div>
  );
}
