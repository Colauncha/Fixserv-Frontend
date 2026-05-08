import { useEffect } from "react";

const useScrollToTopOnAlert = (triggers = []) => {
  useEffect(() => {
    if (triggers.some(Boolean)) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, triggers);
};

export default useScrollToTopOnAlert;
