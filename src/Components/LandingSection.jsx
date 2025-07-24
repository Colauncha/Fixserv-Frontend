import React from "react";
import DigitalImage from '../assets/uploads/Digital.png';
import ProfessionalImage from '../assets/uploads/Professional.png';
import ArtisansImage from '../assets/uploads/Artisans.png';

const LandingSection = () => {
  return (
    <section className="w-full min-h-screen flex  justify-center items-center px-6 pt-6 pb-0 -mt-10 bg-white">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-left text-[#110000C2] leading-snug">
            Digital <span className="text-[#779BE7]">marketplace that<br />connects you with</span><br />
            professional artisans
          </h1> <br/>

          <p className='text-left text-lg text-[#779BE7]'>
          Give your devices a reliable repair <br/> with just a few click.
        </p> <br />

          <div className="flex bg-[#ECF1FC] w-full max-w-md h-[47px] rounded-2xl items-center">
            <input
              title="Email"
              id="email"
              type="email"
              placeholder="Your Email"
              className="flex-1 m-1 border-2 border-[#ECF1FC] bg-[#ECF1FC] rounded-md h-10 p-2"
              required
            />
            <button className="text-white px-6 h-full w-[180px] bg-[#7A9DF7] rounded-2xl">
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Side - Images */}
        <div className="w-full md:w-1/2 relative mt-10 md:mt-0 h-[350px] flex items-center justify-center">
          <img
            src={DigitalImage}
            alt="Digital repair"
            className="w-40 h-45 rounded-lg absolute top-0 left-20"
          />
          <img
            src={ProfessionalImage}
            alt="Professional repair"
            className="w-40 h-45 rounded-lg absolute top-48 left-20"
          />
          <img
            src={ArtisansImage}
            alt="Artisans repair"
            className="w-40 h-72 rounded-lg absolute top-10 left-64"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingSection;

