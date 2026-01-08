import React from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { useNavigate } from 'react-router-dom';

const AdminSignUp = () => {
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
                Sign up to access the admin dashboard
              </p>
        
              {/* Google */}
              <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4">
                <img src={googleLogo} alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>
        
                      
              <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-6 h-px bg-[#B3B3B3]" />
          <span className="text-sm text-[#B3B3B3]">Or</span>
          <div className="w-6 h-px bg-[#B3B3B3]" />
        </div>
        
              {/* Form */}
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
               
        
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
        
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
                {/* Confirmation */}
          <div className="flex items-center justify-between mb-12">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
                           focus:ring-blue-700 cursor-pointer"
              />
              <span className="text-sm text-black">I agree to the <span className='text-[#3E83C4]'>Terms & Conditions</span> and <span className='text-[#3E83C4]'>Privacy Policy</span></span>
            </label>
        
            
          </div>
        
                <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                  Sign Up
                </button>
    
                <p className="text-sm text-center text-black mb-20">
            Already have a Fixserv account?{" "}
            <a href="/admin-login" className="text-[#3E83C4] hover:underline font-medium">
              Log In
            </a>
          </p>
          <p className='text-sm text-center text-black bottom-0'>Protected by enterprise-grade security</p>
              </form>
            </div>
          </div>
        </section>
        
            </div>
  )
}

export default AdminSignUp