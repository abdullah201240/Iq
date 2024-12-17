'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    homeTitle: '',
    homeVideo: '',
    homeImage: null,
    homeDescription: '',
    title: '',
    video: '',  // Provide a default value here
    image: null,
    description: '',
  });

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

        // Fetching the about data once session is valid
        const aboutResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/about/1`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedUserInfo}`,
            },
          }
        );

        if (aboutResponse.ok) {
          const data = await aboutResponse.json();
          setFormData({
            homeTitle: data.data.homeTitle || '',
            homeVideo: data.data.homeVideo || '',
            homeDescription: data.data.homeDescription || '',
            title: data.data.title || '',
            description: data.data.description || '',
            homeImage: data.data.homeImage || null,
            video: data.data.video || null,
            image: data.data.image || '',  // Ensure VideoUrl is set
          });
        }

      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/admin/login');
      }
    };

    checkSession();
  }, [router]);

  // Handling form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const storedUserInfo = localStorage.getItem('sessionToken');

    if (!storedUserInfo) {
      router.push('/admin/login');
      return;
    }

    try {
      const form = new FormData();
      form.append('homeTitle', formData.homeTitle);
      form.append('homeVideo', formData.homeVideo);
      form.append('homeDescription', formData.homeDescription);
      form.append('title', formData.title);  // Corrected key for video title
      form.append('description', formData.description);
      form.append('video', formData.video);

      if (formData.homeImage) form.append('homeImage', formData.homeImage);
      if (formData.image) form.append('image', formData.image);  // Corrected key for video file

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/about/1`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${storedUserInfo}`,
        },
        body: form,
      });
      console.log(form)

      if (!response.ok) {
        console.error('Error updating data');
      } else {
        console.log('Data updated successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Ensure e.target is not null
    const target = e.target;

    if (target) {
      const { name, value } = target;

      // Type check to ensure 'files' exists only for file input elements
      const newValue = target instanceof HTMLInputElement && target.files
        ? target.files[0] // For file input, use the first file
        : value; // For other inputs (e.g., text), use the input's value

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };



  return (
    <div>
      <div className="bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black">About Us</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
            {/* Home Title */}
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label htmlFor="homeTitle" className="block text-gray-900 font-semibold mb-2">
                  Home Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="homeTitle"
                  value={formData.homeTitle}
                  onChange={handleChange}
                  placeholder="Home Title"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="homeVideo" className="block text-gray-900 font-semibold mb-2">
                  Home Video URL
                </label>
                <input
                  id="homeVideo"
                  type="url"
                  name="homeVideo"
                  value={formData.homeVideo}
                  onChange={handleChange}
                  placeholder="Home Video URL"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>
            </div>


            <div className="w-1/2 mb-6">
              <label htmlFor="homeImage" className="block text-gray-900 font-semibold mb-2">
                Home Image
              </label>
              <input
                id="homeImage"
                type="file"
                name="homeImage"
                accept="image/*"
                onChange={handleChange}
                aria-labelledby="homeImage" // Ensures that the screen reader reads the label
                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black file:border file:border-gray-400 file:rounded-md file:bg-white"
              />
            </div>


            {/* Home Description */}
            <div className="mb-6">
              <label htmlFor="homeDescription" className="block text-gray-900 font-semibold mb-2">
                Home Description
              </label>
              <textarea
                id="homeDescription"
                name="homeDescription"
                value={formData.homeDescription}
                onChange={handleChange}
                placeholder="Home Description"
                className="w-full p-4 h-40 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none resize-none placeholder-gray-600 text-gray-900"
              ></textarea>
            </div>


            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label htmlFor="Title" className="block text-gray-900 font-semibold mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Home Video Title"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="VideoUrl" className="block text-gray-900 font-semibold mb-2">
                  Video URL
                </label>
                <input
                  id="video"
                  type="url"
                  name="video"
                  value={formData.video}
                  onChange={handleChange}
                  placeholder=" Video URL"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>
            </div>

            <div className="w-1/2 mb-6">
              <label htmlFor="image" className="block text-gray-900 font-semibold mb-2">
                Image
              </label>

              <input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none bg-white text-black file:border file:border-gray-400 file:rounded-md file:bg-white"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-900 font-semibold mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-4 h-40 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none resize-none placeholder-gray-600 text-gray-900"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#F17B21] text-black font-bold rounded-md focus:outline-none hover:bg-[#f18c48]"
            >
              Update
            </button>
          </form>
        </div>
       
      </div>

    </div>
  );
}
