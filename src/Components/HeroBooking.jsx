import { useState, useEffect } from "react";
import DigitalImage from "../assets/uploads/Digital.png";
import ProfessionalImage from "../assets/uploads/Professional.png";
import ArtisansImage from "../assets/uploads/Artisans.png";
import { useNavigate } from "react-router-dom";

const HeroBooking = () => {
  const imageList = [DigitalImage, ArtisansImage, ProfessionalImage];
  const [imageIndex, setImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
        setFade(false);
      }, 300); // match transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full min-h-screen relative flex justify-center items-center px-4 lg:mb-20 -mt-28 bg-white overflow-hidden">
      {/* Background Image & Overlay for Small Screens */}
      <div className="absolute top-0 left-0 w-full h-full z-0 block md:hidden">
        {/* Background Image */}
        <div
          className={`transition-all duration-700 ease-in-out w-full h-full ${
            fade ? "opacity-0 scale-102 blur-sm" : "opacity-30 scale-100 blur-[2.5px]"
          }`}
          style={{
            backgroundImage: `url(${imageList[imageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/30"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full mb-10 md:mb-0 flex flex-col md:flex-row justify-between items-center relative z-10">
        {/* Left Side - Text */}
        <div className="w-full md:w-1/2 space-y-3 pt-30 md:pt-0">
          <h1 className="text-5xl font-bold text-center md:text-left text-[#110000C2] drop-shadow-xl leading-snug md:text-2xl lg:text-5xl">
            Digital <span className="text-[#779BE7]">marketplace <br />that connects users</span>
            <br />
            with professional artisans
          </h1>
          <br />

          <p className="text-center text-2xl drop-shadow-xl text-[#779BE7] md:text-left md:text-lg lg:text-xl">
            Provides a seamless, reliable marketplace
            <br />
            connecting customers with verified
            <br />
            professional gadget repairers.
          </p>
          <br />

          <div className="flex w-full max-w-full h-[57px] rounded-2xl justify-center md:justify-start items-center">
            <button
              className="text-white px-6 h-full drop-shadow-xl w-[250px] bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] rounded-2xl cursor-pointer hover:to-[#7A9DF7] hover:from-[#7A9Dd7] transition duration-300 ease-in-out"
              onClick={() => navigate("/waitlist")}
            >
              Join the waitlist
            </button>
          </div>
        </div>

        {/* Right Side - Images (Desktop only) */}
        <div className="hidden md:flex w-full md:w-1/2 relative mt-10 md:mt-0 h-[350px] items-center justify-center">
          <img
            src={DigitalImage}
            alt="Digital repair"
            className="w-64 h-72 rounded-lg absolute -top-26 left-20 hover:scale-105 transition-transform duration-300 ease-in-out hover:drop-shadow-lg"
          />
          <img
            src={ProfessionalImage}
            alt="Professional repair"
            className="w-64 h-72 rounded-lg absolute top-50 left-20 hover:scale-105 transition-transform duration-300 ease-in-out hover:drop-shadow-lg"
          />
          <img
            src={ArtisansImage}
            alt="Artisans repair"
            className="w-[260px] h-[500px] rounded-lg -top-18 absolute right-5 hover:scale-105 transition-transform duration-300 ease-in-out hover:drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBooking;
