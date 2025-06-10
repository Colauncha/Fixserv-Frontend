import React from 'react';
import Navbar from '../Components/Navbar'
import LandingSection from '../Components/LandingSection'
import AboutSection from '../Components/AboutSection'
import Footer from '../Components/Footer'
import ArrowUp from '../assets/uploads/ArrowUp.png'

const Waiting = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Navbar />
      <LandingSection />
      <AboutSection />

      {/* Arrow image - above Footer */}
      <div className="w-full flex justify-end -mb-10">
        <img
          src={ArrowUp}
          alt="Back to Top"
          className="w-20 h-20 text-[#110000C2] cursor-pointer hover:scale-110 transition duration-300"
          onClick={scrollToTop}
        />
      </div>

      <Footer />
    </>
  );
}


export default Waiting;

