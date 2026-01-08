import React from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full"> 
      <section className="relative w-full h-[90vh] mt-10 px-40">
     <button className="text-sm text-[#3E83C4] flex items-center gap-1 hover:underline mb-10 cursor-pointer">
          ← Back
        </button>
         <section className="flex items-center justify-center px-20 py-20 bg-white">

      <div className="w-full max-w-md">

        {/* Back link */}
       

        {/* Title */}
        <h1 className="text-2xl font-semibold text-black text-center mb-1">
          Forgot Password?
        </h1>

        <h2 className="text-2xl font-semibold text-black text-center mb-4">
          Not a Problem
        </h2>

        <p className="text-sm text-[#656565] text-center mb-12 leading-relaxed">
          Enter your email address below and we will send you further
          instructions on how to reset your password
        </p>

        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 mb-10"
        />

        {/* Button */}
        <button
          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
                     text-white py-3 rounded-md font-medium transition mb-4 cursor-pointer"
        >
          Send Mail
        </button>

        {/* Login link */}
        <p className="text-sm text-center text-black">
          {/* Remember your password?{" "} */}
          <button onClick={() => navigate("/log-in")} className="text-[#3E83C4] hover:underline cursor-pointer font-medium">
            Log In
          </button>
        </p>

      </div>
    </section>
    </section>
        </div>
   
  );
};

export default ForgetPassword;
