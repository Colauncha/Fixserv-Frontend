import React from 'react'
import ArtisanHome from '../../Components/Artisan/ArtisanHome'
import Footer from '../../Components/Footer'
import ArrowUp from '../../assets/uploads/ArrowUp.png'
import ArtisanNavbar from '../../Components/Artisan/ArtisanNavbar'


const ArtisanHomePage = () => {

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div>
      <ArtisanNavbar />
      <ArtisanHome />
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
    </div>
  )
}

export default ArtisanHomePage
