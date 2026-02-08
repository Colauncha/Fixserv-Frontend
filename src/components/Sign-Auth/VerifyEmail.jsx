import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

        <h2 className="text-xl font-semibold text-black mb-3">
          Check your email 📩
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          We’ve sent a verification link to
          <br />
          <span className="font-medium text-black">
            {email || "your email address"}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Please check your inbox (and spam folder) and click the link
          to verify your account before logging in.
        </p>

        <button
          onClick={() => navigate("/log-in")}
          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition"
        >
          Go to Login
        </button>

        <button
          className="mt-4 text-sm text-[#3E83C4] hover:underline"
          onClick={() => alert("Resend email coming soon")}
        >
          Didn’t receive the email?
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
