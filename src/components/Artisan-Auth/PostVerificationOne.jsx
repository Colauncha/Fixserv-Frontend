import React from "react";
import successImg from "../../assets/Artisan Images/tick.png";
import { useNavigate } from "react-router-dom";

const PostVerificationOne = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <img
            src={successImg}
            alt="Success"
            className="w-20 h-20"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Welcome to Fixserv
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Your account is ready! To get the best service matches and build trust
          on the platform, we recommend completing your profile.
          <br />
          You can also start exploring our services right away.
        </p>

        {/* Primary Button */}
        <button
        onClick={() => navigate("/verification-two")}
          className="w-full bg-[#3E83C4] hover:bg-blue-600 cursor-pointer text-white font-medium py-3 rounded-lg transition mb-3"
        >
          Complete Your Profile
        </button>

        {/* Secondary Button */}
        <button
          className="w-full border border-[#3E83C4] text-[#3E83C4] cursor-pointer hover:bg-blue-50 font-medium py-3 rounded-lg transition"
        >
          Explore Service Now
        </button>

      </div>
    </div>
  );
};

export default PostVerificationOne;
