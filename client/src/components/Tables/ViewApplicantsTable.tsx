'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from "react-hot-toast";

interface Job {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  salary: string;
  choosePosition: string;
  portfolio: string;
  resume: string;
  jobId: string;
  status: string;
}

interface ApplyFromProps {
  jobId: string | undefined; // Define the prop type
}

const ViewApplicantsTable: React.FC<ApplyFromProps> = ({ jobId }) => {
  const router = useRouter();
  const [teams, setTeams] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10); // Set the limit for pagination

  const [modalOpen, setModalOpen] = useState(false);
  const [rejectedModalOpen, setRejectedModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPosition, setSenderPosition] = useState('');
  const [senderInfo, setSenderInfo] = useState('');

  
  // Fetch data from the API
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

        // Fetching the job applicants data with pagination
        const jobResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/jobApply/${jobId}/applications?page=${currentPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${storedUserInfo}`,
            },
          }
        );

        if (jobResponse.ok) {
          const data = await jobResponse.json();
          if (Array.isArray(data.data)) {
            setTeams(data.data);
            setTotalRecords(data.totalRecords); // Set the total count
            setTotalPages(data.totalPages); // Set the total number of pages
          } else {
            console.error('Fetched data is not an array:', data);
          }
        } else {
          console.error('Failed to fetch job data');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router, jobId, currentPage, limit]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  const handleStatusUpdate = async (applicantId: number, status: string) => {
    const storedUserInfo = localStorage.getItem('sessionToken');
    if (!storedUserInfo) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/jobApply/${applicantId}/${status}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${storedUserInfo}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: status }),
        }
      );

      if (response.ok) {

        toast.success("Application updated successfully!");


        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === applicantId ? { ...team, status: status } : team
          )

        );
      } else {
        toast.error("Application not updated successfully!");

        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle modal toggle
  const openModal = () => {

    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setInterviewDate('');
    setSenderName('');
    setSenderPosition('');
  };

  const openRejectedModal = () => {
    setRejectedModalOpen(true);
  };

  const closeRejectedModal = () => {
    setRejectedModalOpen(false);
  };


  // Send email for shortlisted candidates
  const sendShortlistedEmail = async () => {

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewDate,
          senderName,
          senderPosition,
          status: 'ShortListed',
        }),
      });

      if (response.ok) {
        toast.success('Shortlisted email sent successfully!');
        closeModal();
      } else {
        toast.error('Failed to send shortlisted email.');
      }
    } catch (error) {
      if (error) {
        toast.error('Error sending email.');

      }
    }
  };

  // Send email for rejected candidates
  const sendRejectedEmail = async () => {

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName,
          senderPosition,
          status: 'Rejected',
        }),
      });

      if (response.ok) {
        toast.success('Rejected email sent successfully!');
        closeRejectedModal();
      } else {
        toast.error('Failed to send rejected email.');
      }
    } catch (error) {
      if (error) {
        toast.error('Error sending email.');

      }
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (teams.length === 0) {
    return <p>No applicants found.</p>;
  }

  return (
    <div className="relative overflow-x-auto">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-black">
        All Applicants
      </h4>

      <table className="w-full text-sm text-left rtl:text-right text-white dark:text-white">
        <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              Education
            </th>
            <th scope="col" className="px-6 py-3">
              Experience
            </th>
            <th scope="col" className="px-6 py-3">
              Salary
            </th>
            <th scope="col" className="px-6 py-3">
              Portfolio
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Resume
            </th>
          </tr>
        </thead>

        <tbody>
          {teams.map((team) => (
            <tr key={team.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="px-6 py-4 text-gray-900 dark:text-white">{team.name}</td>
              <td className="px-6 py-4 text-white">{team.email}</td>
              <td className="px-6 py-4 text-white">{team.phone}</td>
              <td className="px-6 py-4 text-white">{team.address}</td>
              <td className="px-6 py-4 text-white">{team.education}</td>
              <td className="px-6 py-4 text-white">{team.experience}</td>
              <td className="px-6 py-4 text-white">{team.salary}</td>

              <td className="px-6 py-4 text-white">

                <Link href={`${team.portfolio}`} target="_blank" rel="noopener noreferrer">Link</Link>
              </td>
              <td className="px-6 py-4 text-white">
                <select
                  value={team.status}
                  onChange={e => handleStatusUpdate(team.id, e.target.value)}
                  className="bg-gray-50 text-black dark:bg-gray-700 dark:text-white"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="ShortListed">ShortListed</option>
                  <option value="Finalized">Finalized</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 text-white">
                <Link href={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/uploadPdf/${team.resume}`} className="text-blue-500">
                  View Resume
                </Link>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalRecords > 0 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-black">
            Showing {Math.min(limit * currentPage, totalRecords)} of {totalRecords} records
          </p>
          <div>
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4">{currentPage}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}



      <br />
      <br />
      <div className="flex justify-between w-full">
        <button className="group relative min-h-[50px] w-50 overflow-hidden border border-green-500 bg-white text-green-500 shadow-2xl transition-all before:absolute before:left-0 before:top-0 before:h-0 before:w-1/4 before:bg-green-500 before:duration-500 after:absolute after:bottom-0 after:right-0 after:h-0 after:w-1/4 after:bg-green-500 after:duration-500 hover:text-white hover:before:h-full hover:after:h-full"
          onClick={() => openModal()}
        >
          <span className="top-0 flex h-full w-full items-center justify-center before:absolute before:bottom-0 before:left-1/4 before:z-0 before:h-0 before:w-1/4 before:bg-green-500 before:duration-500 after:absolute after:right-1/4 after:top-0 after:z-0 after:h-0 after:w-1/4 after:bg-green-500 after:duration-500 hover:text-white group-hover:before:h-full group-hover:after:h-full"></span>
          <span className="absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full items-center justify-center group-hover:text-white">Send shortlisted email </span>
        </button>

        <button className="relative h-[50px] w-40 overflow-hidden border border-yellow-400 bg-white text-yellow-400 shadow-2xl transition-all before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:duration-500 after:absolute after:right-0 after:top-0 after:h-full after:w-0 after:duration-500 hover:text-white hover:shadow-yellow-400 hover:before:w-2/4 hover:before:bg-yellow-400 hover:after:w-2/4 hover:after:bg-yellow-400"

          onClick={() => openRejectedModal()}

        >
          <span className="relative z-10">Send rejected email</span>
        </button>
      </div>




      {/* Modal for Shortlisted Email */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Send Shortlisted Email</h3>
            <div>
              <label className="block mb-2">Interview Date</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
              <label className="block mb-2">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
              <label className="block mb-2">Sender Position</label>
              <input
                type="text"
                value={senderPosition}
                onChange={(e) => setSenderPosition(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
               <label className="block mb-2">Contact Info:</label>
              <input
                type="text"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={sendShortlistedEmail} className="bg-blue-500 text-white py-2 px-4 rounded">Send Email</button>
              <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Rejected Email */}
      {rejectedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-4">Send Rejected Email</h3>
            <div>
              <label className="block mb-2">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
              <label className="block mb-2">Sender Position</label>
              <input
                type="text"
                value={senderPosition}
                onChange={(e) => setSenderPosition(e.target.value)}
                className="mb-4 p-2 border rounded"
              />
              <label className="block mb-2">Contact Info:</label>
              <input
                type="text"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                className="mb-4 p-2 border rounded"
              />


            </div>
            <div className="flex justify-between mt-4">
              <button onClick={sendRejectedEmail} className="bg-red-500 text-white py-2 px-4 rounded">Send Email</button>
              <button onClick={closeRejectedModal} className="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}






    </div>
  );
};

export default ViewApplicantsTable;
