import React, { useState } from "react";
import imageOne from "../assets/about/image 1.png";
import mark from "../assets/about/tick.png";

import star from "../assets/about/medal.png";
import seacrh from "../assets/about/find.png";
import target from "../assets/about/target.png";

import verifiedImage from "../assets/about/verified image.png";
import quickImage from "../assets/about/quick responce.png";
import transparentImage from "../assets/about/transparent image.png";
import futureImage from "../assets/about/future image.png";

import { useNavigate } from "react-router-dom";


const faqs = [
  {
    question: "Is Fixserv free to use?",
    answer:
      "Yes, Fixserv is free to use. You only pay for the service provided by the technician after agreeing on the job details.",
  },
  {
    question: "How do I know the technician is reliable?",
    answer:
      "All technicians on Fixserv are verified and reviewed. You can check ratings, reviews, and past job performance before booking.",
  },
  {
    question: "What if my gadget can’t be fixed?",
    answer:
      "If your gadget can’t be fixed, you won’t be charged. Our technicians will inform you before proceeding with any repair.",
  },
  {
    question: "Can I book Fixserv for businesses?",
    answer:
      "Yes, Fixserv supports business bookings. You can request multiple repairs or ongoing maintenance for your organization.",
  },
];


const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const navigate = useNavigate();

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* LEFT CONTENT */}
            <div>
              <span className="inline-block mb-3 px-3 py-1 text-sm font-medium text-[#3E83C4] bg-[#E7F2FD] rounded">
                About Us
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Who We Are
              </h2>

              <p className="text-[#484747] leading-relaxed mb-6 max-w-xl">
                Fixserv was created to bridge the gap between people and reliable
                technicians. We make it simple to find skilled professionals for
                gadget repairs fast, safe, and convenient.
              </p>

              <p className="text-[#484747] leading-relaxed mb-8 max-w-xl">
                Our mission is to empower users with access to verified experts
                while also creating opportunities for technicians to grow their
                skills and businesses.
              </p>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  "Verified professionals",
                  "Nationwide Access",
                  "Clear & Transparent",
                  "Ratings & Reviews",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={mark} alt="check" className="w-5 h-5" />
                    <span className="text-black font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button onClick={() => navigate("/sign-up")} className="bg-[#3E83C4] hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition cursor-pointer">
                Join Fixserv
              </button>
            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center md:justify-end">
              <img
                src={imageOne}
                alt="Fixserv professionals"
                className="w-full max-w-md rounded-xl object-cover"
              />
            </div>

          </div>
        </div>
      </section>

        <section className="py-20 bg-white">
        {/* HEADER */}
        <div className="text-center mb-14">
         
      
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Our Mission, Vision & Values
          </h2>
      
         
        </div>
      
        {/* TESTIMONIAL CARDS */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
            {/* CARD 1 */}
            <div className="bg-[#3E83C4] rounded-xl p-6 text-white border border-white/10">
            <img src={target} alt="" />
              {/* Stars */}
               <div className="flex gap-1 mt-8 mb-4">
                <p className="text-lg font-bold leading-relaxed">Mission</p>
               
              </div>
             
      
              {/* Text */}
              <p className="text-sm leading-relaxed mb-4">
               To make gadget repairs hassle-free by connecting users with trusted professionals.
              </p>
      
              {/* Footer */}
             
            </div>
      
            {/* CARD 2 */}
            <div className="bg-[#3E83C4] rounded-xl p-6 text-white border border-white/10">
            <img src={seacrh} alt="" />
              <div className="flex gap-1 mt-8 mb-4">
                <p className="text-lg font-bold leading-relaxed">Vision</p>
               
              </div>
      
              <p className="text-sm leading-relaxed mb-4">
               To become Africa’s most reliable platform for skilled services expanding beyond gadget repair to all blue-collar work.
              </p>
      
             
            </div>
      
            {/* CARD 3 */}
            <div className="bg-[#3E83C4] rounded-xl p-6 text-white border border-white/10">
            <img src={star} alt="" />
              <div className="flex gap-1 mt-8 mb-4">
                <p className="text-lg font-bold leading-relaxed">Value</p>
               
              </div>
      
              <p className="text-sm leading-relaxed mb-4">
               Trust, Quality Service, Accessibility and Growth
              </p>
      
             
            </div>
      
          </div>
        </div>
      </section>

     <section className="w-full py-20 bg-white">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
    
    {/* Header */}
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-semibold text-black">
        Why Choose Us
      </h2>
      <p className="mt-4 text-[#656565] max-w-2xl mx-auto">
        Reliable solutions designed to make gadget repair simple, safe, and stress-free.
      </p>
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Card 1 */}
      <div className="border border-[#3E83C4] rounded-lg p-5 text-center">
        <img
          src={verifiedImage}
          alt="Verified technicians"
          className="w-full h-44 object-cover rounded-md mb-4"
        />
        <p className="text-black font-medium">
          Verified technicians for peace of mind.
        </p>
      </div>

      {/* Card 2 */}
      <div className="border border-[#3E83C4] rounded-lg p-5 text-center">
        <img
          src={quickImage}
          alt="Quick response"
          className="w-full h-44 object-cover rounded-md mb-4"
        />
        <p className="text-black font-medium">
          Quick response & easy booking.
        </p>
      </div>

      {/* Card 3 */}
      <div className="border border-[#3E83C4] rounded-lg p-5 text-center">
        <img
          src={transparentImage}
          alt="Transparent services"
          className="w-full h-44 object-cover rounded-md mb-4"
        />
        <p className="text-black font-medium">
          Transparent services (no hidden charges)
        </p>
      </div>

      {/* Card 4 */}
      <div className="border border-[#3E83C4] rounded-lg p-5 text-center">
        <img
          src={futureImage}
          alt="Future ready"
          className="w-full h-44 object-cover rounded-md mb-4"
        />
        <p className="text-black font-medium">
          Future-ready platform for broader services.
        </p>
      </div>

    </div>
  </div>
</section>

  {/* Banner */}
    <section className="relative w-full flex items-center justify-center mt-4 mb-8 py-14">
    <div className="absolute inset-0 bg-[#346DA3]" />
    <div className="relative z-10 text-center w-full px-6">
      <h5 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight">
        Get More Customers, Build Your Reputation.
      </h5>
      <p className="mt-6 text-sm md:text-lg text-blue-100 max-w-4xl mx-auto">
         No more relying only on word of mouth. Grow your income, showcase your skills, and build your reputation online with every job you complete.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
        <button onClick={() => navigate("/sign-up")} className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-7 py-3 rounded-md font-medium transition cursor-pointer">
          Begin Your Journey
        </button>
       
      </div>
    </div>
  </section>

<section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-2 md:px-6">
        <div className="grid md:grid-cols-2 gap-20 items-start">

          {/* LEFT */}
          <div>
            <span className="inline-block text-xs font-medium text-[#3E83C4] bg-[#E7F2FD] px-3 py-1 rounded-xs mb-4">
              FAQs
            </span>

            <h2 className="text-3xl md:text-4xl font-semibold text-black leading-tight">
              We’re here to answer all <br /> your questions.
            </h2>

            <p className="mt-4 text-[#484747] max-w-md">
              If you are new to Fixserv, this section will help you learn more
              about the platform and all it offers
            </p>
          </div>

          {/* RIGHT — ACCORDION */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#EEF6FF] rounded-md overflow-hidden"
              >
                {/* QUESTION */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-black font-medium">
                    {faq.question}
                  </span>
                  <span className="text-xl text-black cursor-pointer">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>

                {/* ANSWER */}
                <div
                  className={`px-5 text-black text-sm transition-all duration-300 ease-in-out
                    ${
                      activeIndex === index
                        ? "max-h-40 pb-4 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }
                  `}
                >
                  {faq.answer}
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="pt-6">
              <p className="text-black mb-3">
                Got anymore questions?
              </p>

              <button onClick={() => navigate("/contactUs")} className="border-2 border-[#3E83C4] text-[#3E83C4] px-6 py-2 rounded-md font-medium hover:bg-[#EEF6FF] transition cursor-pointer">
                Get In Touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>

    </div>
  );
};




export default About;
