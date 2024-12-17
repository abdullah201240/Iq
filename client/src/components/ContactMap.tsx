import React from 'react';

export default function ContactMap() {
  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m19!1m8!1m3!1d467212.55138690723!2d90.4123014!3d23.8151119!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3755c7c7e1b19217%3A0x78088609858add97!2sIQ%20Architects%20Ltd%20House-%20141%20(4A%20Lane-%2001%20Dhaka%201206!3m2!1d23.815111899999998!2d90.41230139999999!5e0!3m2!1sen!2sbd!4v1733037661155!5m2!1sen!2sbd"
        className="absolute top-0 left-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        title="Google Map Location"
      ></iframe>
    </div>
  );
}
