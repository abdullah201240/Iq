import CareerTitle from '@/components/CareerTitle'
import Footer from '@/components/Footer'
import JobList from '@/components/JobList'
import Navbar from '@/components/Navbar'
import WhyWorkwithUs from '@/components/WhyWorkwithUs'
import React from 'react'

export default function page() {
  return (
    <div>
        <Navbar/>
      <CareerTitle/>
      <WhyWorkwithUs/>
      <JobList/>
      <Footer/>
    </div>
  )
}
