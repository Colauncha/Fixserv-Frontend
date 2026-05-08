import React, { useEffect, useState } from "react";
import { APP_ERROR_EVENT } from "../../utils/apiErrorHandler";

const GlobalErrorAlert = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let timer;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const handleAppError = (event) => {
      const message = event?.detail?.message || "Something went wrong.";
      const type = event?.detail?.type || "error";

      // ✅ SET ALERT
      setAlert({ message, type });

      // ✅ FORCE SCROLL TO TOP
      setTimeout(() => {
        scrollToTop();
      }, 50); // ensures DOM renders first

      // ✅ AUTO CLEAR
      clearTimeout(timer);
      timer = setTimeout(() => {
        setAlert(null);
      }, 4000);
    };

    window.addEventListener(APP_ERROR_EVENT, handleAppError);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(APP_ERROR_EVENT, handleAppError);
    };
  }, []);

  if (!alert) return null;

  // ✅ dynamic styling (you weren’t using type before)
  const bgColor =
    alert.type === "success"
      ? "bg-green-600"
      : alert.type === "warning"
      ? "bg-yellow-500"
      : "bg-red-600";

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[90%] max-w-md">
      <div
        className={`rounded-xl ${bgColor} text-white shadow-lg px-4 py-3 text-sm font-medium`}
      >
        {alert.message}
      </div>
    </div>
  );
};

export default GlobalErrorAlert;
