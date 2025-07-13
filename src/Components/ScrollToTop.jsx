import React, { useState, useEffect } from 'react'
import ArrowUp from "../assets/uploads/ArrowUp.png";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-0 right-5 z-50 transition-transform duration-300 ${
        isVisible ? '-translate-y-10' : 'translate-y-full'
      }`}
    >
      <img
        src={ArrowUp}
        alt="Back to Top"
        className="w-12 h-12 cursor-pointer hover:scale-110 transition duration-300"
        onClick={scrollToTop}
      />
    </div>
  );
}

export default ScrollToTop