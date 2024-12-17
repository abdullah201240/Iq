// AboutUsTitle and Footer are static, so we can import them normally
import AboutUsDescription from '@/components/AboutUsDescription';
import AboutUsTitle from '@/components/AboutUsTitle';
import TeamMember from '@/components/TeamMember';
import Testimonial from '@/components/Testimonial';
import Whatsapp from '@/components/Whatsapp';

// Dynamically load other components that are not critical for initial rendering


export default function Home() {
  return (
    <div>
      {/* Static components */}
      <AboutUsTitle />
      

      {/* Dynamically loaded components */}
      <AboutUsDescription />
      <Testimonial />
      <TeamMember/>
      <Whatsapp/>

    </div>
  );
}
