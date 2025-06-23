import React from "react";
import ServicesImage from "../assets/uploads/Services.png";

const AboutSection = () => {
  return (
    <section className="w-full h-full bg-[#ECF1FC] py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-20">

        {/* Left: Small Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={ServicesImage}
            alt="About FixServ"
            className="w-80 h-80 md:w-96 md:h-96 rounded-lg"
          />
        </div>     

        {/* Right: Text */}
        <div className="w-full md:w-1/2 space-y-6">
        <br />
          <h2 className="text-3xl md:text-5xl font-bold text-[#110000C2]">
          About Fixserv
          </h2> <br />
          <p className="text-gray-600 text-2xl leading-relaxed">
            Fixserv is a digital marketplace that <br/>connects users with professional<br /> artisans 
            specializing in gadget<br/> repairs and services. <br /> <br  />

            We offer a seamless way for customers to <br/> to find, book, and engage certified
            experts for <br/> fixing electronics, mobile devices,home <br/> appliances
            and other gadgets. <br /> <br />
          </p>
        </div>
      
      </div>
    </section>
  );
};

export default AboutSection;


