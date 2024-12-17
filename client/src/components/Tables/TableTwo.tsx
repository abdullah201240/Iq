import React from 'react';

const TableTwo = () => {
  return (

    
    <div className="relative overflow-x-auto">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        All Applicants
      </h4>
      <table className="w-full text-sm text-left rtl:text-right text-white dark:text-white">
        <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
          <tr>
            <th scope="col" className="px-6 py-3 ">
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
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Apple MacBook Pro 17
            </th>
            <td className="px-6 py-4 text-white">
              Silver
            </td>
            <td className="px-6 py-4 text-white">
              Laptop
            </td>
            <td className="px-6 py-4 text-white">
              $2999
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Apple MacBook Pro 17
            </th>
            <td className="px-6 py-4 text-white">
              Silver
            </td>
            <td className="px-6 py-4 text-white">
              Laptop
            </td>
            <td className="px-6 py-4 text-white">
              $2999
            </td>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Apple MacBook Pro 17
            </th>
            <td className="px-6 py-4 text-white" >
              Silver
            </td>
            
          </tr>
          
         
        </tbody>
      </table>
    </div>

  );
};

export default TableTwo;
