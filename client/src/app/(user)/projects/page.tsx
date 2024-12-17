import AllProjects from '@/components/AllProjects'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ServicesTitle from '@/components/ServicesTitle'
import Whatsapp from '@/components/Whatsapp'
import React from 'react'
import about from "@/app/assets/img/abg.webp"; // Correctly imported image

export default function page() {

  return (
    <div>
      <Navbar />
      <ServicesTitle
        title="Projects"
        subTitle="Explore our architecture firm's project section, transforming ideas into reality featuring cutting-edge designs and successful collaborations that redefine spaces and enhance communities."
        backgroundImage={about.src}

      />
      <div className="container mx-auto px-4 mt-10 lg:pl-40">
        <AllProjects />
      </div>



      <Footer />
      <Whatsapp />



    </div>
  )
}
