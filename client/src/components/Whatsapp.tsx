'use client';
import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon from react-icons
export default function Whatsapp() {
  return (
    <div>
        <a 
        href="https://wa.me/+8801618004000" // Replace with your actual WhatsApp number
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-icon"
      >
        <FaWhatsapp size={40} color="#ffff" />
      </a>
      <style jsx>{`
        .whatsapp-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color:#25d366;
          border-radius: 50%;
          padding: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .whatsapp-icon:hover {
          background-color: #128C7E;
        }
      `}</style>
      
    </div>
  )
}
