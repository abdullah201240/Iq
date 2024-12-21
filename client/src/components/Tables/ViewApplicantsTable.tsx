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
  const [finalizedModalOpen, setFinalizedModal] = useState(false);


  const [interviewDate, setInterviewDate] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPosition, setSenderPosition] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [offerExpirationDate, setOfferExpirationDate] = useState('');

  const [uploadOfferLetter, setUploadOfferLetter] = useState('');
  const [finalizedEmail, setFinalizedEmail] = useState('');
  const [finalizedName, setFinalizedName] = useState('');







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
  const openFinalizedModal = (email: string, name: string) => {
    setFinalizedEmail(email)
    setFinalizedName(name)
    setFinalizedModal(true);
  };

  const closeFinalizedModal = () => {
    setFinalizedModal(false);
  };


  // Send email for shortlisted candidates
  const sendShortlistedEmail = async () => {
    const storedUserInfo = localStorage.getItem('sessionToken');
    if (!storedUserInfo) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/Shortlistedemail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedUserInfo}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewDate,
          jobId,
          senderName,
          senderPosition,
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
    const storedUserInfo = localStorage.getItem('sessionToken');
    if (!storedUserInfo) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/RejectedEmail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedUserInfo}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          senderName,
          senderPosition,
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

  const sendFinalizedEmail = async () => {
    const storedUserInfo = localStorage.getItem('sessionToken');
    if (!storedUserInfo) return;
    if (!uploadOfferLetter) {
      toast.error('Please upload an offer letter');
      return;
    }
    const formData = new FormData();
    formData.append('jobId', jobId || '');
    formData.append('senderName', senderName);
    formData.append('senderPosition', senderPosition);
    formData.append('senderInfo', senderInfo);
    formData.append('startDate', startDate);
    formData.append('offerExpirationDate', offerExpirationDate);
    formData.append('resume', uploadOfferLetter);
    formData.append('email', finalizedEmail);
     formData.append('candidateName', finalizedName);


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/FinalizedEmail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storedUserInfo}`,
          'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify({
          jobId,
          senderName,
          senderPosition,
          senderInfo,
          startDate,
          offerExpirationDate,
          resume: uploadOfferLetter
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

      <div>
        <h1 className='text-center mt-10 text-3xl mb-10'>Finalized Candidates</h1>

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
                Resume
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {teams
              .filter((team) => team.status === 'Finalized') // Filter for Finalized status
              .map((team) => (
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
                    <Link href={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/uploadPdf/${team.resume}`} className="text-blue-500">
                      View Resume
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-white">
                    <button className='bg-blue-600 text-lg'
                      onClick={() => openFinalizedModal(team.email, team.name)}
                    >
                      Send Email
                    </button>

                  </td>
                </tr>
              ))}
          </tbody>
        </table>


      </div>



      {/* Modal for Shortlisted Email */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 sm:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Send Shortlisted Email
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender's name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Sender Position
                </label>
                <input
                  type="text"
                  value={senderPosition}
                  onChange={(e) => setSenderPosition(e.target.value)}
                  placeholder="Enter sender's position"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Contact Info
                </label>
                <input
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder="Enter contact information"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={sendShortlistedEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Send Email
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal for Rejected Email */}
      {rejectedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 sm:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Send Rejected Email</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender's name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Sender Position</label>
                <input
                  type="text"
                  value={senderPosition}
                  onChange={(e) => setSenderPosition(e.target.value)}
                  placeholder="Enter sender's position"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Contact Info</label>
                <input
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder="Enter contact information"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={sendRejectedEmail}
                className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Send Email
              </button>
              <button
                onClick={closeRejectedModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {finalizedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 sm:w-2/3 lg:w-1/2">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Send Finalized Email</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Sender Name</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender's name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Sender Position</label>
                <input
                  type="text"
                  value={senderPosition}
                  onChange={(e) => setSenderPosition(e.target.value)}
                  placeholder="Enter sender's position"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Contact Info</label>
                <input
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder="Enter contact information"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Offer Expiration Date</label>
                <input
                  type="date"
                  value={offerExpirationDate}
                  onChange={(e) => setOfferExpirationDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Upload Offer Letter</label>
                <input
                  type="file"
                  onChange={(e) => setUploadOfferLetter(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button
                onClick={sendFinalizedEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Send Email
              </button>
              <button
                onClick={closeFinalizedModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}







    </div>
  );
};

export default ViewApplicantsTable;
