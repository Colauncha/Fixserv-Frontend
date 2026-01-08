import React from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import { useNavigate } from 'react-router-dom';

const ArtisanForget = () => {
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
            <h2 className="text-4xl font-medium leading-tight">
              Opps!
            </h2>
        
            <p className="text-2xl mb-8 opacity-90 text-white">
              Locked out?
            </p>
        
            <p className="text-base mb-10 opacity-90 text-white">
              Don’t stress. We’ll send you a reset link so you can jump right back in.
            </p>
        
            
          </div>
        </div>
        
        
          {/* RIGHT — FORM */}
          <div className="flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
                <button onClick={() => navigate("/artisan-login")} className="text-sm text-[#3E83C4] flex items-center gap-1 hover:underline mb-10 cursor-pointer">
          ← Back
        </button>
        
              <h2 className="text-2xl font-semibold text-black text-center">
                Forgot Password?
              </h2>
              <p className="text-sm text-[#656565] text-center mt-2 mb-8">
                Enter your email address below and we will send you further instructions on how to reset your password
              </p>
        
             
        
        
              {/* Form */}
              <form className="space-y-4">
                
        
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
        
        
               
        
            
      
        
                <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                  Send Email
                </button>
    
                <p className="text-sm text-center text-black">
            Already have a Fixserv account?{" "}
            <a href="/artisan-login" className="text-[#3E83C4] hover:underline font-medium">
              Log In
            </a>
          </p>
              </form>
            </div>
          </div>
        </section>
        
            </div>
  )
}

export default ArtisanForget