import React, { useEffect, useState } from "react";
import { APP_ERROR_EVENT } from "../../utils/apiErrorHandler";

const GlobalErrorAlert = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    let timer;

    const handleAppError = (event) => {
      const message = event?.detail?.message || "Something went wrong.";
      const type = event?.detail?.type || "error";

      setAlert({ message, type });

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

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[90%] max-w-md">
      <div className="rounded-xl bg-red-600 text-white shadow-lg px-4 py-3 text-sm font-medium">
        {alert.message}
      </div>
    </div>
  );
};

export default GlobalErrorAlert;