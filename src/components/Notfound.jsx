import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md text-center">

        {/* Error Code */}
        <h1 className="text-7xl font-bold text-[#3E83C4]">404</h1>

        {/* Message */}
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Page not found
        </h2>
        <p className="mt-2 text-gray-500">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-[#3E83C4] hover:bg-[#2d75b8] 
                       text-white px-6 py-3 rounded-md font-medium transition"
          >
            Go to Homepage
          </button>

          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 hover:border-gray-400 
                       text-gray-700 px-6 py-3 rounded-md font-medium transition"
          >
            Go Back
          </button>
        </div>

      </div>
    </section>
  );
};

export default Notfound;
