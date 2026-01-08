import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import { useNavigate } from "react-router-dom";
import correct from "../../assets/client images/correct.png"

const AdminReset = () => {
    const navigate = useNavigate();
const [showSuccess, setShowSuccess] = useState(false);
  return (
       <div>
            <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 m-20 mt-8">
    
    {/* LEFT — IMAGE PANEL */}
    <div className="relative hidden lg:flex flex-col">
    
      {/* Background */}
      <img
        src={signImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <img
        src={signOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    
      {/* TOP HEADER (logo aligned with right title) */}
      <div className="relative z-10 px-38 pt-16">
        <img src={signLogo} alt="Fixserv logo" className="h-10 w-auto" />
      </div>
    
      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-14 text-center text-white max-w-md mx-auto">
    
        <p className="text-4xl mb-4 text-white">
          Almost There!
        </p>
        <p className='text-sm mb-30 text-white'>You’ve got the link, now just create a new password and you’re back in action.</p>
    
      </div>
    </div>
    
    
    
      {/* RIGHT — FORM */}
      
    {/* <div className="flex items-center justify-center px-6 bg-white"> */}
        <div className="flex justify-center px-6 bg-white pt-20">
    
      <div className="w-full max-w-md">
    
        {/* Back button */}
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-20 text-sm text-[#3E83C4] cursor-pointer hover:text-blue-600"
        >
          ← Back
        </div>
    
            
    
          {/* <h2 className="text-2xl font-semibold text-gray-900 text-center"> */}
            <h2 className="text-2xl font-semibold text-black text-center mt-10">
    
            Reset Password
          </h2>
          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Your account’s security matters to us. Choose a strong password to keep things safe.
          </p>
    
          {/* Form */}
          {/* <form className="space-y-5"> */}
            <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setShowSuccess(true);
      }}
    >
    
      
    
      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    
      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
                   text-white py-3 rounded-md font-medium transition cursor-pointer"
      >
        Reset Password
      </button>
    
    </form>
    
        </div>
      </div>
    
      {showSuccess && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">
    
          {/* Check icon */}
          <img className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full" src={correct} alt="" />
    
          <h3 className="text-lg font-semibold text-black mb-2">
            Password Reset Successful
          </h3>
    
          <p className="text-sm text-[#656565] mb-6">
            You can now use your new password to login to your Fixserv account
          </p>
    
          <button
      onClick={() => {
        setShowSuccess(false);
        navigate("/admin-login");
      }}
      className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer"
    >
      Log In
    </button>
    
    
        </div>
      </div>
    )}
    
    </section>
    
        </div>
  )
}

export default AdminReset