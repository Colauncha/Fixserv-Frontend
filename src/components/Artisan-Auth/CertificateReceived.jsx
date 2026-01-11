import React from "react";
import pending from "../../assets/Artisan Images/pending.png";
import { useNavigate } from "react-router-dom";

const CertificateReceived = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          <img
            src={pending}
            alt="Certificate under review"
            className="w-18 h-18"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-black mb-3">
          We've Received Your Certificate
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Your skill certificate is currently being reviewed by our team to
          ensure it meets our quality standards. This process helps us maintain
          a trusted and reliable platform for everyone.
          <br />
          <br />
          <span className="font-medium text-gray-700">
            Estimated review time:
          </span>{" "}
          24 – 48 hours. You will receive an email notification once the review is complete.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-[#3E83C4] cursor-pointer hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition"
          aria-label="Go to dashboard"
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
};

export default CertificateReceived;
