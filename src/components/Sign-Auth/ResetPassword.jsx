// import React, { useState } from 'react';

// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import { useNavigate } from "react-router-dom";
// import correct from "../../assets/client images/correct.png"
// import { Eye, EyeOff } from "lucide-react";


// const ResetPassword = () => {

    
// const navigate = useNavigate();
// const [showSuccess, setShowSuccess] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   return (
//    <div>
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
//   <div className="relative z-10 px-48 pt-16">
//     <img src={signLogo} alt="Fixserv logo" className="h-10 w-auto" />
//   </div>

//   {/* CENTER CONTENT */}
//   <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-14 text-center text-white max-w-md mx-auto">

//     <p className="text-base mb-30 text-white opacity-90">
//       Now create a new password to complete login.
//     </p>

//   </div>
// </div>



//   {/* RIGHT — FORM */}
  
// {/* <div className="flex items-center justify-center px-6 bg-white"> */}
//     <div className="flex justify-center px-6 bg-white pt-20">

//   <div className="w-full max-w-md">

//     {/* Back button */}
//     <div
//       onClick={() => navigate(-1)}
//       className="flex items-center gap-2 mb-20 text-sm text-[#3E83C4] cursor-pointer hover:text-blue-600"
//     >
//       ← Back
//     </div>

        

//       {/* <h2 className="text-2xl font-semibold text-gray-900 text-center"> */}
//         <h2 className="text-2xl font-semibold text-black text-center mt-10">

//         Reset Password
//       </h2>
//       <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//         Your account’s security matters to us. Choose a strong password to keep things safe.
//       </p>

//       {/* Form */}
//       {/* <form className="space-y-5"> */}
//         <form
//   className="space-y-5"
//   onSubmit={(e) => {
//     e.preventDefault();
//     setShowSuccess(true);
//   }}
// >

  

// {/* Password */}
//            <div className="relative">
//   <input
//     type={showPassword ? "text" : "password"}
//     placeholder="Password"
//     className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm
//                focus:outline-none focus:border-blue-500"
//   />

//   <button
//     type="button"
//     onClick={() => setShowPassword(!showPassword)}
//     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//   >
//     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>


//             {/* Confirm Password */}
// <div className="relative">
//   <input
//     type={showConfirmPassword ? "text" : "password"}
//     placeholder="Confirm Password"
//     className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm
//                focus:outline-none focus:border-blue-500"
//   />

//   <button
//     type="button"
//     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//   >
//     {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>

//   {/* Submit */}
//   <button
//     type="submit"
//     className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
//                text-white py-3 rounded-md font-medium transition cursor-pointer"
//   >
//     Reset Password
//   </button>

// </form>

//     </div>
//   </div>

//   {showSuccess && (
//   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">

//       {/* Check icon */}
//       <img className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full" src={correct} alt="" />

//       <h3 className="text-lg font-semibold text-black mb-2">
//         Password Reset Successful
//       </h3>

//       <p className="text-sm text-[#656565] mb-6">
//         You can now use your new password to login to your Fixserv account
//       </p>

//       <button
//   onClick={() => {
//     setShowSuccess(false);
//     navigate("/log-in");
//   }}
//   className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer"
// >
//   Log In
// </button>


//     </div>
//   </div>
// )}

// </section>

//     </div>
//   )
// }

// export default ResetPassword


import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import correct from "../../assets/client images/correct.png";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://user-management-h4hg.onrender.com/api/admin/reset-password?token=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT IMAGE PANEL (unchanged) */}
      <div className="relative hidden lg:flex flex-col">
        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 px-48 pt-16">
          <img src={signLogo} className="h-10 w-auto" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-14 text-center text-white max-w-md mx-auto">
          <p className="text-base opacity-90">
            Now create a new password to complete login.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex justify-center px-6 bg-white pt-20">
        <div className="w-full max-w-md">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-20 text-sm text-[#3E83C4]"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold text-black text-center mt-10">
            Reset Password
          </h2>

          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Your account’s security matters to us. Choose a strong password.
          </p>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">
            <img src={correct} className="w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Password Reset Successful
            </h3>
            <p className="text-sm text-[#656565] mb-6">
              You can now login with your new password
            </p>
            <button
              onClick={() => navigate("/log-in")}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
