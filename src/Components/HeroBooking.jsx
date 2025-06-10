import React from "react";
import DigitalImage from '../assets/uploads/Digital.png';
import ProfessionalImage from '../assets/uploads/Professional.png';
import ArtisansImage from '../assets/uploads/Artisans.png';

const HeroBooking = () => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center px-6 pt-60 pb-0 -mt-28 bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-6xl font-bold text-left text-[#110000C2] leading-snug">
            Digital <span className="text-[#779BE7]">marketplace <br />that connects users</span><br />
            with professional artisans
          </h1> <br/>

          <p className='text-left text-3xl text-[#779BE7]'>
            Provides a seamless, reliable marketplace<br/>connecting customers with verified<br/>
            professional gadget repairers.
        </p> <br />

          <div className="flex w-full max-w-md h-[57px] rounded-2xl items-center">
            
            <button className="text-white px-6 h-full w-[250px] bg-[#7A9DF7] rounded-2xl">
              Book a Repair
            </button>
          </div>
        </div>

        {/* Right Side - Images */}
        <div className="w-full md:w-1/2 relative mt-10 md:mt-0 h-[350px] flex items-center justify-center">
          <img
            src={DigitalImage}
            alt="Digital repair"
            className="w-64 h-72 rounded-lg absolute -top-24 left-20"
          />
          <img
            src={ProfessionalImage}
            alt="Professional repair"
            className="w-64 h-72 rounded-lg absolute top-55 left-20"
          />
          <img
            src={ArtisansImage}
            alt="Artisans repair"
            className="w-[260px] h-[560px] rounded-lg -top-20 absolute right-5"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBooking

