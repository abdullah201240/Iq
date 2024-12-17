'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';


const AdminTable = dynamic(() => import('@/components/AdminTable'), {
  ssr: false, // Disable SSR for this component
});

export default function Home() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    role: '',
    password: '',



  });
  const [passwordValid, setPasswordValid] = useState(false);


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


  const validatePassword = (password: string) => {
    const lengthCondition = password.length >= 8;
    const upperCaseCondition = /[A-Z]/.test(password);
    const lowerCaseCondition = /[a-z]/.test(password);
    const specialCharCondition = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const digitCheck = /[0-9]/.test(password); // New condition for at least one digit


    return (
      lengthCondition &&
      upperCaseCondition &&
      lowerCaseCondition &&
      specialCharCondition &&
      digitCheck
    );
  }
  

  // Handling form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!passwordValid) {
      toast.error('Password does not meet the required conditions!');
      return;
    }

    const storedUserInfo = localStorage.getItem('sessionToken');

    if (!storedUserInfo) {
      router.push('/admin/login');
      return;
    }

    try {

      // Prepare JSON data
    const jsonData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob,
      gender: formData.gender,
      role: formData.role,
      password: formData.password,
    };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/createAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedUserInfo}`,
        },
        body: JSON.stringify(jsonData),
      });

      if (!response.ok) {
        toast.error('Error updating data'); // Displays a success message

        console.error('Error updating data');
      } else {
        toast.success('Data Added successfully!'); // Displays a success message

        console.log('Data Added successfully');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password if the field is 'password'
    if (name === 'password') {
      setPasswordValid(validatePassword(value));
    }
  };;



  return (
    <div>
      <div className="bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto bg-white border-2 border-[#F17B21] rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black">Admin</h2>
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
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>

            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label htmlFor="Phone" className="block text-gray-900 font-semibold mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="dob" className="block text-gray-900 font-semibold mb-2">
                  Dob
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="Dob"
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                />
              </div>

            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label htmlFor="Gender" className="block text-gray-900 font-semibold mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor="role" className="block text-gray-900 font-semibold mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-4 rounded-md border border-gray-400 focus:border-[#F17B21] focus:ring-2 focus:ring-[#F17B21] focus:outline-none placeholder-gray-600 text-gray-900"
                >
                  <option value="" disabled>Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

            </div>
            <div className="w-1/2">
              <label
                htmlFor="Password"
                className="block text-gray-900 font-semibold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full p-4 rounded-md border ${passwordValid
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:ring-red-500'
                  } focus:ring-2 focus:outline-none placeholder-gray-600 text-gray-900`}
              />
            </div>

            <br />
            <ul className="text-sm text-gray-600">
              <li
                className={
                  formData.password.length >= 8
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                Must be at least 8 characters
              </li>
              <li
                className={
                  /[A-Z]/.test(formData.password)
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                Must contain one uppercase letter
              </li>
              <li
                className={
                  /[a-z]/.test(formData.password)
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                Must contain one lowercase letter
              </li>
              <li
                className={
                  /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                Must contain one special character
              </li>
              <li
                className={
                 /[0-9]/.test(formData.password)
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                Must contain at least one digit
              </li>

              
            </ul>
            <br />
            


            <button
              type="submit"
              className="w-full py-4 bg-[#F17B21] text-black font-bold rounded-md focus:outline-none hover:bg-[#f18c48]"
            >
              Add
            </button>
          </form>
        </div>

      </div>
      <div className='pb-10'>


        <AdminTable />

      </div>


    </div>
  );
}
