import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import BackgroundImage from '../assets/uploads/Welcome_bg.png'
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [role, setRole] = useState("Artisan");
  // const handleArtisan = () => {
    // setRole("Artisan");
    // console.log("Artisan role selected");
  // };
  // const handleGuest = () => {
    // setRole("Guest");
    // console.log("Guest role selected");
  // };

  const navigate = useNavigate();

  const handleArtisan = () => {
    navigate("/artisan-signup");
  };

  const handleGuest = () => {
    navigate("/guest-signup");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 bg-[#A1B7F2] flex flex-col justify-center items-center p-8">
      <img src={BackgroundImage} alt="Background" className="absolute inset-0 w-1/3 object-cover opacity-80" />
        <h1 className="text-7xl font-bold mb-4 px-10 text-[#110000C2]">Welcome Back!</h1>
        <p className="text-xl py-3 text-[#110000C2]">Get connected with professional<br/> artisans</p>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        <h2 className="text-2xl text-[#110000C2] font-semibold mb-6">Log in</h2>

        <form className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Password</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border border-[#94B0F8] rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[#113ca8]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="text-sm mb-4 pl-38 ">
            Forgot Password?{" "}
            <a href="#" className="text-[#000000] font-semibold">
              Reset Password
            </a>
          </div>

          {/* Role Selector */}
      <div className="flex relative w-48 h-12 mb-28">
            {/* Artisan Button (Main) */}
         <button
            type="button"
            onClick={handleArtisan}
            // onClick={() => setRole("Artisan")}
            className='w-full h-10 py-2 rounded-full font-medium text-xl transition-all flex
            justify-end bg-[#A1B7F2] text-white '>
            Artisan
         </button>

          {/* Guest Button */}
         <button
            type="button"
            onClick={handleGuest}
            // onClick={() => setRole("Guest")}
            className='absolute text-xl h-10 w-24 rounded-full transition-all flex
            items-center justify-center bg-[#ECF1FC] text-[#A1B7F2]'>
           Client
         </button>
        </div>
                   
        <div className="flex relative w-48 h-12 mb-28"> 
          <button
            type="button"
            className="flex items-center justify-center w-16 h-10 rounded px-4 py-2 shadow-md hover:bg-red-200 transition"
          >                     
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LogIn;

