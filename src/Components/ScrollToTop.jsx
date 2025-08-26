import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import "./Others/css/SlideAnimations.css"; // we'll add animations here

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed right-6 z-40
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-gradient-to-br from-[#7A9DF7] to-[#7A9Dd7]
        border-2 border-gray-300
        text-gray-200 shadow-2xl
        hover:scale-110 hover:shadow-lg
        transition-all
        ${isVisible ? "slide-up" : "slide-down"}
        bottom-6
      `}
      title="Scroll to top"
    >
      <ArrowUp className="w-7 h-7" />
    </button>
  );
};

export default ScrollToTop;
