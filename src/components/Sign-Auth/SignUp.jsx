// import React from 'react'

// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import googleLogo from '../../assets/sign/google logo.png';
// import appleLogo from '../../assets/sign/apple logo.png';
// import { useNavigate } from 'react-router-dom';

// const SignUp = () => {
//   const navigate = useNavigate();
//   return (
//     <div>
//         <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

// {/* LEFT — IMAGE PANEL */}
// <div className="relative hidden lg:flex flex-col">

//   {/* Background */}
//   <img
//     src={signImage}
//     alt=""
//     className="absolute inset-0 w-full h-full object-cover"
//   />
//   <img
//     src={signOverlay}
//     alt=""
//     className="absolute inset-0 w-full h-full object-cover"
//   />

//   {/* TOP HEADER (logo aligned with right title) */}
//   <div className="relative z-10 px-36 pt-16">
//     <img src={signLogo} alt="Fixserv logo" className="h-10 w-auto" />
//   </div>

//   {/* CENTER CONTENT */}
//   <div className="relative z-10 flex flex-1 mb-50 flex-col items-center justify-center px-14 text-center text-white max-w-lg mx-auto">
//     <h2 className="text-2xl mb-28 font-medium leading-tight">
//       Hi! Let’s Get Started
//     </h2>

    

//     <p className="text-base mb-4 opacity-90 text-white">
//       Are you a skiled professional? looking to offer your services?
//     </p>

//     <button onClick={() => navigate("/artisan-signup")} className="border border-white px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
//       Join as an artisan
//     </button>
//   </div>
// </div>


//   {/* RIGHT — FORM */}
//   <div className="flex items-center justify-center px-6 py-16">
//     <div className="w-full max-w-md">

//       <h2 className="text-2xl font-semibold text-black text-center">
//         Sign Up as a Client
//       </h2>
//       <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//         Enter your details to set up your new Fixserv client account.
//       </p>

//       {/* Google */}
//       <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4">
//         <img src={googleLogo} alt="Google" className="w-5 h-5" />
//         Sign up with Google
//       </button>

//       {/* Apple */}
//       <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6">
//         <img src={appleLogo} alt="Apple" className="w-5 h-5" />
//         Sign up with Apple
//       </button>

//       <div className="flex items-center justify-center gap-4 mb-6">
//   <div className="w-6 h-px bg-[#B3B3B3]" />
//   <span className="text-sm text-[#B3B3B3]">Or</span>
//   <div className="w-6 h-px bg-[#B3B3B3]" />
// </div>

//       {/* Form */}
//       <form className="space-y-4">
//         <input
//           type="text"
//           placeholder="First Name"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="text"
//           placeholder="Last Name"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="email"
//           placeholder="Email Address"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="text"
//           placeholder="Location"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <input
//           type="text"
//           placeholder="Referral Code (optional)"
//           className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
//         />

//         <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
//           Create Account
//         </button>
//       </form>
//     </div>
//   </div>
// </section>

//     </div>
//   )
// }

// export default SignUp




import React from "react";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import googleLogo from "../../assets/sign/google logo.png";
import appleLogo from "../../assets/sign/apple logo.png";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT — BRAND PANEL */}
      <div className="relative flex flex-col h-[300px] sm:h-[340px] lg:h-auto">

        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />

        {/* Logo */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-36 pt-6 sm:pt-10 lg:pt-16">
          <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

          <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
            Hi! Let’s Get Started
          </h2>

          <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90">
            Are you a skilled professional? Looking to offer your services?
          </p>

          <button
            onClick={() => navigate("/artisan-signup")}
            className="border border-white px-5 sm:px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] transition"
          >
            Join as an artisan
          </button>
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="w-full max-w-md">

          <h2 className="text-2xl font-semibold text-black text-center">
            Sign Up as a Client
          </h2>

          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Enter your details to set up your new Fixserv client account.
          </p>

          {/* Social Buttons */}
          <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4">
            <img src={googleLogo} className="w-5 h-5" />
            Sign up with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6">
            <img src={appleLogo} className="w-5 h-5" />
            Sign up with Apple
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-6 h-px bg-[#B3B3B3]" />
            <span className="text-sm text-[#B3B3B3]">Or</span>
            <div className="w-6 h-px bg-[#B3B3B3]" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            {[
              "First Name",
              "Last Name",
              "Email Address",
              "Location",
              "Password",
              "Confirm Password",
              "Referral Code (optional)",
            ].map((placeholder, i) => (
              <input
                key={i}
                type={placeholder.toLowerCase().includes("password") ? "password" : "text"}
                placeholder={placeholder}
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              />
            ))}

            <button
              onClick={() => navigate("/client")}
              className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

    </section>
  );
};

export default SignUp;
