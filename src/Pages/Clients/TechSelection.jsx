import React from 'react'
import ClientSelection from '../../Components/Guest/ClientSelection'
import Footer from '../../Components/Footer'
import ArrowUp from '../../assets/uploads/ArrowUp.png'
import SelectionNavbar from '../../Components/Guest/SelectionNavbar'

const TechSelection = () => {

    // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
     <SelectionNavbar />
      <ClientSelection />

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
    </div>
  )
}

export default TechSelection
