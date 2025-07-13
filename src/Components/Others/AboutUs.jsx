import React from 'react'
import AboutImage1 from '../../assets/uploads/About_Image1.png'
import AboutImage2 from '../../assets/uploads/About_Image2.png'
import AboutImage3 from '../../assets/uploads/About_Image3.png'
import { useNavigate } from "react-router-dom";


const AboutUs = () => {
  const navigate = useNavigate();

const handleGetStarted = () => {
  navigate('/welcome');
};

  return (
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center py-12 px-4 md:px-0 space-y-8 md:space-y-0 md:space-x-8"> 
      {/* Left: Text */}
       <div className="md:w-1/2 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold text-[#7A9DF7]">
             About <span className='text-[#110000C2]'>U</span>s
             </h2> <br />
             <p className="text-gray-600 text-xl leading-relaxed">
               Fixserv is a digital marketplace that connects users<br/> with professional artisans 
               specializing in gadget<br/> repairs and services.
             </p>
             <p className="text-gray-600 text-xl leading-relaxed">  
               We offer a seamless way for customers to find,<br/> book, and engage certified
               experts for fixing<br/> electronics, mobile devices,home appliances
               and<br/> other gadgets. <br /> <br />
             </p>

            <button 
            onClick={handleGetStarted}
            className="bg-[#7A9DF7] text-white px-6 py-2 rounded-xl hover:bg-blue-500 transition">
               Get Started
            </button>
           </div>

         {/* Right: Images */}
         <div className="md:w-1/2 flex justify-center space-x-4 mt-12">
           <img src={AboutImage1} alt="Worker 1" className="w-1/3 h-[550px] rounded-sm object-cover mt-0" />
           <img src={AboutImage2} alt="Worker 2" className="w-1/3 h-[550px] rounded-sm object-cover mt-12" /> 
           <img src={AboutImage3} alt="Worker 3" className="w-1/3 h-[550px] rounded-sm object-cover mt-0" /> 
         </div>

    </section>
   )
 }

 export default AboutUs
