'use client';

import Image from 'next/image';
import Logo from '@/app/assets/img/icon.webp';
import { FormEvent, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const router = useRouter();
  // Use `useCallback` to memoize the function to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const email = (form.username as HTMLInputElement).value;
      const password = (form.password as HTMLInputElement).value;

      // Validate form inputs
      if (!validateForm(email, password)) return;

      setLoading(true);

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
        

          localStorage.setItem('sessionToken', result.token); // Assuming the API returns a token
          router.push('/admin/dashboard');
          setAlert({
            type: 'success',
            message: 'Login successful!',
          });
        } else {
          // Handle specific error codes from the API
          if (result.errorCode === 1003) {
            setAlert({
              type: 'error',
              message: 'Incorrect password. Please try again.',
            });
          } else if (result.errorCode) {
            setAlert({
              type: 'error',
              message: `Error: ${result.message || 'Please try again later.'}`,
            });
          } else {
            setAlert({
              type: 'error',
              message: result.message || 'Login failed. Please try again.',
            });
          }
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Request failed. Please check your connection and try again.',
        });
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Validation function
  const validateForm = (email: string, password: string) => {
    if (!email || !password) {
      setAlert({
        type: 'error',
        message: 'Your session has expired. Please log in again.',
      });
      return false;
    }
    setAlert(null); // Clear any previous alerts
    return true;
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="relative py-3 sm:max-w-xs sm:mx-auto">
        <div className="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gblack rounded-xl shadow-lg">
          <div className="flex flex-col justify-center items-center h-full select-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-8">
              <a href="https://amethgalarcio.web.app/" target="_blank" rel="noopener noreferrer">
                <Image
                  src={Logo}
                  alt="Iq Logo"
                  width={32}
                  height={32}
                  className="w-8"
                />
              </a>
              <p className="m-0 text-[16px] font-semibold text-black">Login to your Account</p>
              <span className="m-0 text-xs max-w-[90%] text-center text-black">
                Get started with our app, just start section and enjoy the experience.
              </span>
            </div>

            {/* Alert Display */}
            {alert && (
              <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )}

            {/* Form Handling with POST method */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-black">Username</label>
                <input
                  name="username"
                  className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-black dark:bg-gblack"
                  placeholder="Username"
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="font-semibold text-xs text-black">Password</label>
                <input
                  type="password"
                  name="password"
                  className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-black dark:bg-gblack"
                  placeholder="••••••••"
                />
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="py-1 px-8 bg-[#F17B21] text-black w-full text-center text-base font-semibold shadow-md focus:outline-none"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
