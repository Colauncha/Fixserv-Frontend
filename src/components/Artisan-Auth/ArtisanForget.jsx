// import React from 'react'
// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import googleLogo from '../../assets/sign/google logo.png';
// import { useNavigate } from 'react-router-dom';

// const ArtisanForget = () => {
//     const navigate = useNavigate();

//   return (
//       <div>
//                 <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
//         {/* LEFT — IMAGE PANEL */}
//       <div className="relative flex flex-col h-[300px] sm:h-[340px] lg:h-auto">
        
//           {/* Background */}
//           <img
//             src={signImage}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <img
//             src={signOverlay}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover"
//           />
        
//           {/* TOP HEADER (logo aligned with right title) */}
//         <div className="relative z-10 px-6 sm:px-10 lg:px-40 pt-6 sm:pt-10 lg:pt-16">
//           <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
//         </div>

//         {/* Center Content */}
//         <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

//           <h2 className="text-xl sm:text-3xl lg:text-4xl font-medium leading-tight">
//               Opps!
//             </h2>
        
//             <p className="text-2xl mb-3 opacity-90 text-white">
//               Locked out?
//             </p>
        
//             <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 text-white">
//               Don’t stress. We’ll send you a reset link so you can jump right back in.
//             </p>
        
            
//           </div>
//         </div>
        
        
//           {/* RIGHT — FORM */}
//       <div className="flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        
//             <div className="w-full max-w-md">
//                 <button onClick={() => navigate(-1)} className="text-sm text-[#3E83C4] flex items-center gap-1 hover:underline mb-10 cursor-pointer">
//           ← Back
//         </button>
        
//               <h2 className="text-2xl font-semibold text-black text-center">
//                 Forgot Password?
//               </h2>
//               <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//                 Enter your email address below and we will send you further instructions on how to reset your password
//               </p>
             
        
        
//               {/* Form */}
//               <form className="space-y-4">
                
        
//                 <input
//                   type="email"
//                   placeholder="Email Address"
//                   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//                 />
        
        
               
        
            
      
        
//                 <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
//                   Send Email
//                 </button>
    
//                 <p className="text-sm text-center text-black">
//             Already have a Fixserv account?{" "}
//             <a href="/artisan-login" className="text-[#3E83C4] hover:underline font-medium">
//               Log In
//             </a>
//           </p>
//               </form>
//             </div>
//           </div>
//         </section>
        
//             </div>
//   )
// }

// export default ArtisanForget

import React, { useState } from "react";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import { useNavigate } from "react-router-dom";

const ArtisanForget = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      return setError("Email is required");
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="relative">
        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 px-10 pt-16">
          <img src={signLogo} className="h-10" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-white px-10 h-full">
          <h2 className="text-4xl font-medium">Oops!</h2>
          <p className="text-xl mt-2">Locked out?</p>
          <p className="text-sm mt-4 opacity-90 max-w-md text-center">
            Don’t stress. We’ll send you a reset link so you can jump right back in.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#3E83C4] mb-8 hover:underline"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold text-center">
            Forgot Password?
          </h2>

          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Enter your email and we’ll send reset instructions.
          </p>

          {success ? (
            <div className="text-center">
              <p className="text-green-600 text-sm mb-4">
                Reset link sent! Please check your email.
              </p>

              <button
                onClick={() => navigate("/artisan-login")}
                className="text-[#3E83C4] text-sm hover:underline"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
              >
                {loading ? "Sending..." : "Send Email"}
              </button>

              <p className="text-sm text-center mt-4">
                Remembered your password?{" "}
                <a
                  href="/artisan-login"
                  className="text-[#3E83C4] hover:underline"
                >
                  Log In
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtisanForget;
