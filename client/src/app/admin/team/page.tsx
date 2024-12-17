'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';



const TeamTable = dynamic(() => import('@/components/Tables/TeamTable'), {
    ssr: false, // Disable SSR for this component
  });

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    designation: '',
    name: '',
    image: null,
    description: '',
    email:'',
    phone:''
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
      form.append('name', formData.name);  // Corrected key for video title
      form.append('description', formData.description);
      
      form.append('designation', formData.designation);
      form.append('email', formData.email);

      form.append('phone', formData.phone);


      if (formData.image) form.append('image', formData.image);  // Corrected key for video file

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/team`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedUserInfo}`,
        },
        body: form,
      });
      console.log(form)

      if (!response.ok) {
        toast.error('Error updating data'); // Displays a success message

      } else {
        toast.success('Data Added successfully!'); // Displays a success message

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
    <>
       
      <div className="bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black">Team</h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-10">
           
            


            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label htmlFor="Title" className="block text-gray-900 font-semibold mb-2">
                Name
                </label>
                <input
                  id="Name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="Designation" className="block text-gray-900 font-semibold mb-2">
                Designation
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>
            </div>
            <div className="flex gap-4 mb-6">

            <div className="w-1/2">
                <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
                Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="phone" className="block text-gray-900 font-semibold mb-2">
                Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="phone"
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
                required
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
                required
                className="w-full p-4 h-40 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none resize-none placeholder-gray-600 text-gray-900"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#F17B21] text-black font-bold rounded-md focus:outline-none hover:bg-[#f18c48]"
            >
              Add
            </button>
          </form>
        </div>
        
      </div>
      
      
      {/* <TeamTable/> */}
      <TeamTable/>
     
      
      </>
  );
}
