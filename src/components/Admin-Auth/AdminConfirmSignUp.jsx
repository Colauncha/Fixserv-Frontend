import React from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';

import { useNavigate } from 'react-router-dom';

const AdminConfirmSignUp = () => {
    const navigate = useNavigate();
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
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-14 text-center text-white max-w-lg mx-auto">
            <h2 className="text-4xl font-medium mb-6 leading-tight">
              Manage Your Platform
            </h2>
        
            <p className="text-base mb-8 opacity-90 text-white">
              Oversee artisans, clients, transactions, and platform performance from a single, powerful dashboard.
            </p>
        
            
          </div>
        </div>
        
        
          {/* RIGHT — FORM */}
          <div className="flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
        
              <h2 className="text-2xl font-semibold text-black text-center">
                Admin Portal
              </h2>
              <p className="text-sm text-[#656565] text-center mt-2 mb-8">
                Sign in to access the admin dashboard
              </p>
        
        
              {/* Form */}
              <form className="space-y-4">
                <label className='text-light mb-2'>Two-Factor Authentication</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full border border-[#9BAAB9] text-center rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
               
        
        
                {/* Confirmation */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2">
              
              <span className="text-sm text-black">Enter the 6 digits code sent to your email</span>
            </label>
        
            
          </div>
           {/* Remember & Forgot */}
      <div className="flex items-center justify-between mb-12">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
                       focus:ring-blue-700 cursor-pointer"
          />
          <span className="text-sm text-black">Remember me</span>
        </label>
    
        <button
          type="button"
          onClick={() => navigate("/forget-password")}
          className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

        
                 <button onClick={() => navigate("/admin/admin-post-verification")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                  Verify & Log In
                </button>
                <button onClick={() => navigate("/admin-login")} className="w-full border border-[#3E83C4] hover:bg-[#3E83C4] text-[#3E83C4] py-3 hover:text-white rounded-md font-medium transition cursor-pointer">
                  Back to Log In
                </button>
    
                
          <p className='text-sm text-center text-black bottom-0'>Protected by enterprise-grade security</p>
              </form>
            </div>
          </div>
        </section>
        
            </div>
  )
}

export default AdminConfirmSignUp