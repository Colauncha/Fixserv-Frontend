import React from 'react'

import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';

import { useNavigate } from 'react-router-dom';

const LogIn = () => {
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
  <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-14 text-center text-white max-w-md mx-auto">
    <h2 className="text-3xl font-bold leading-tight">
      Welcome Back!
    </h2>

    <p className="text-base mb-10 text-white opacity-90">
      Let’s help you get it fixed
    </p>

    <p className="text-base mb-4 text-white opacity-90">
      Are you a professional looking to offer your services?
    </p>

    <button onClick={() => navigate("/artisan-login")} className="border border-white text-[#ffffff] px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
      Join as an artisan
    </button>
  </div>
</div>


  {/* RIGHT — FORM */}
  <div className="flex items-center justify-center px-6 py-16">
    <div className="w-full max-w-md">

      <h2 className="text-2xl font-semibold text-black text-center">
        Welcome to Fixserv
      </h2>
      <p className="text-sm text-[#656565] text-center mt-2 mb-8">
        Enter your details to set up your new Fixserv account
      </p>

      {/* Google */}
      <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4">
        <img src={googleLogo} alt="Google" className="w-5 h-5" />
        Sign up with Google
      </button>

      {/* Apple */}
      <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6">
        <img src={appleLogo} alt="Apple" className="w-5 h-5" />
        Sign up with Apple
      </button>

      <div className="flex items-center justify-center gap-4 mb-6">
  <div className="w-6 h-px bg-[#B3B3B3]" />
  <span className="text-sm text-[#B3B3B3]">Or</span>
  <div className="w-6 h-px bg-[#B3B3B3]" />
</div>

      {/* Form */}
      <form className="space-y-5">

  {/* Email */}
  <input
    type="email"
    placeholder="Email Address"
    className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  {/* Password */}
  <input
    type="password"
    placeholder="Password"
    className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

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

  {/* Submit */}
  <button
    type="submit"
    onClick={() => navigate("/client")}
    className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
               text-white py-3 rounded-md font-medium transition cursor-pointer"
  >
    Log In
  </button>

  {/* Footer */}
  <p className="text-sm text-center text-black">
    Don’t have a Fixserv account?{" "}
    <a href="/sign-up" className="text-[#3E83C4] hover:underline font-medium">
      Sign Up
    </a>
  </p>

</form>

    </div>
  </div>
</section>

    </div>
  )
}

export default LogIn