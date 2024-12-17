import BestProject from '@/components/BestProject';
import Blog from '@/components/Blog';
import ClientsSection from '@/components/ClientsSection';
import TeamMember from '@/components/TeamMember';
import WeAchieved from '@/components/WeAchieved';
import Whatsapp from '@/components/Whatsapp';
import dynamic from 'next/dynamic';
const Cart = dynamic(() => import('@/components/Cart'));
const HeroSection = dynamic(() => import('@/components/HeroSection'));
const AboutUs = dynamic(() => import('@/components/AboutUs'));
const WeOffer = dynamic(() => import('@/components/WeOffer'));
const Footer = dynamic(() => import('@/components/Footer'));
const Navbar = dynamic(() => import('@/components/Navbar'));

const Services = dynamic(() => import('@/components/Services'));

export default function Home() {
  return (
    <div>
     
      <Navbar/>
      <HeroSection/>
      <AboutUs/>
      <Services/>
      <WeOffer/>
      <BestProject/>
      <Cart />
      <WeAchieved/>
      <ClientsSection/>

      <TeamMember/>
      <Blog/>
      <Footer/>
      <Whatsapp/>
      

    </div>
  );
}
