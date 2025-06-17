import React from 'react'
import Navbar from '../Components/Navbar'
import HeroBooking from '../Components/HeroBooking'
import TopArtisans from '../Components/TopArtisans'
import Location from '../Components/Location'
import AboutSection from '../Components/AboutSection'
import Filter from '../Components/Filter'
import Testimonials from '../Components/Testimonials'
import ArrowUp from '../assets/uploads/ArrowUp.png'
import Footer from '../Components/Footer'

const Landing = () => {

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
      <HeroBooking />
      <TopArtisans />
      <Location />
      <AboutSection />
      <Filter />
      <Testimonials />

      {/* Arrow image - above Footer */}
            <div className="w-full flex justify-end -mb-10 px-8">
              <img
                src={ArrowUp}
                alt="Back to Top"
                className="w-20 h-20 text-[#110000C2] cursor-pointer hover:scale-110 transition duration-300"
                onClick={scrollToTop}
              />
            </div>

       <Footer />     
    </>
  )
}

export default Landing
