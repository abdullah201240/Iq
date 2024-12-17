import Image from "next/image";
interface TestimonialCardProps {
  title: string;
  description: string;
  image: string;
  designation: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ title, description, image, designation }) => {
  return (
    <div className="flex flex-col items-start p-6 border border-black rounded-lg shadow-md min-h-[200px]">
          <div className="flex items-center space-x-4">

      <Image
        alt="image"
        src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${image}`}
        width={70}  // Defined width
        height={70} // Defined height
      
        className="rounded-full object-cover border-2 border-black"
      />
            <div>
            <p className="text-lg font-semibold text-black">{title}</p> 
            <p className="text-sm text-black">{designation}</p>
      </div>
    </div>
    <p className="mt-4 text-center text-black">{description}</p>
    </div>

  );
};

export default TestimonialCard;




