// import React, { useState } from 'react'
// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import googleLogo from '../../assets/sign/google logo.png';
// import appleLogo from '../../assets/sign/apple logo.png';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from "lucide-react";
// import { registerArtisan } from "../../api/auth.api";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";


// const ArtisanSignUp = () => {


//       const navigate = useNavigate();

//         const [showPassword, setShowPassword] = useState(false);
//       const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//       const [formData, setFormData] = useState({
//   fullName: "",
//   email: "",
//   location: "",
//   password: "",
//   confirmPassword: "",
// });
// const [loading, setLoading] = useState(false);


//       const handleChange = (e) => {
//   setFormData({ ...formData, [e.target.name]: e.target.value });
// };

// const [error, setError] = useState(null);

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError(null);

//   if (formData.password !== formData.confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   if (!agreed) {
//     setError("You must agree to the Terms & Conditions");
//     return;
//   }

//   try {
//     setLoading(true);

// const payload = {
//   fullName: formData.fullName.trim(),
//   email: formData.email.trim(),
//   password: formData.password.trim(),
//   role: "ARTISAN",
//   artisanData: {
//     businessName: "",
//     skillSet: [],
//     businessHours: {},
//     location: formData.location.trim(),
//     rating: 0,
//   },
// };


//     const res = await registerArtisan(payload);

//     // ✅ Save token only if returned
//     if (res.data?.token)
//     //    {
//     //   localStorage.setItem("fixserv_token", res.data.token);
//     // }

//     // ✅ Save role
//     localStorage.setItem("fixserv_role", "ARTISAN");

//     // ✅ Correct navigation with state
//     navigate("/verification-one", {
//       state: { email: formData.email },
//     });

//   } catch (err) {
//     console.error(err);
//    setError(
//   err?.response?.data?.message ||
//   err?.message ||
//   "Registration failed"
// );

//   } finally {
//     setLoading(false);
//   }
// };



// const [agreed, setAgreed] = useState(false);

// // if (!agreed) {
// //   alert("You must agree to the terms and conditions");
// //   return;
// // }




// const googleLogin = useGoogleLogin({
//   onSuccess: async (tokenResponse) => {
//     try {
//       const res = await fetch(
//         "https://user-management-h4hg.onrender.com/api/admin/google-login",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             idToken: tokenResponse.access_token,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Google login failed");
//       }

//       // ✅ SAVE AUTH
//       localStorage.setItem("fixserv_token", data.token);
//       localStorage.setItem("fixserv_user", JSON.stringify(data.user));
//       localStorage.setItem("fixserv_role", data.user.role);

//       // ✅ ROUTE BY ROLE
//       if (data.user.role === "ARTISAN") {
//         navigate("/artisan");
//       } else {
//         navigate("/client");
//       }

//     } catch (err) {
//       console.error(err.message);
//     }
//   },
// });

// const handleVerify = async () => {
//   try {
//     const res = await fetch(
//       "https://user-management-h4hg.onrender.com/api/users/verify-email",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           otp,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.message);

//     // ✅ SAVE TOKEN AFTER VERIFICATION
//     localStorage.setItem("fixserv_token", data.token);
//     localStorage.setItem("fixserv_user", JSON.stringify(data.user));
//     localStorage.setItem("fixserv_role", data.user.role);

//     navigate("/artisan/onboarding");
//   } catch (err) {
//     setError(err.message);
//   }
// };



//   return (
//         <div>
//             <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
    
//     {/* LEFT — IMAGE PANEL */}
//       <div className="relative flex flex-col h-[300px] sm:h-[340px] lg:h-auto">
    
//       {/* Background */}
//       <img
//         src={signImage}
//         alt=""
//         className="absolute inset-0 w-full h-full object-cover"
//       />
//       <img
//         src={signOverlay}
//         alt=""
//         className="absolute inset-0 w-full h-full object-cover"
//       />
    
//         {/* Logo */}
//         <div className="relative z-10 px-6 sm:px-10 lg:px-48 pt-6 sm:pt-10 lg:pt-16">
//           <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
//         </div>

//         {/* Center Content */}
//         <div className="
//   relative z-10 flex-1 flex flex-col items-center justify-center
//   mb-8 sm:mb-12 lg:mb-40
//   px-6 sm:px-10 lg:px-14
//   text-center text-white max-w-lg mx-auto
// ">

//           {/* <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
//           Start Earning with Your Skills
//         </h2> */}

    
//         <p className="text-base mb-2 opacity-90 text-white">
//           If you are looking to request repairs
//         </p>
    
//         <button onClick={() => navigate("/sign-up")} className="border border-white px-5 sm:px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
//           Join as an client
//         </button>
//       </div>
//     </div>
    
    
//       {/* RIGHT — FORM */}
//       <div className="flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
//         <div className="w-full max-w-md">
    
//           <h2 className="text-2xl font-semibold text-black text-center">
//             Welcome to Fixserv
//           </h2>
//           <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//             Create your artisan account to get repair requests, manage your earnings, and build a reputation that keeps clients coming back.
//           </p>
    
//           {/* Google */}
// <button
//   onClick={() => googleLogin()}
//   className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md"
// >
//   <img src={googleLogo} className="w-5 h-5" />
//   Sign up with Google
// </button>
    
//           {/* Apple */}
//           {/* <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6">
//             <img src={appleLogo} alt="Apple" className="w-5 h-5" />
//             Sign up with Apple
//           </button> */}
    
//           <div className="flex items-center justify-center gap-4 mb-6">
//       <div className="w-6 h-px bg-[#B3B3B3]" />
//       <span className="text-sm text-[#B3B3B3]">Or</span>
//       <div className="w-6 h-px bg-[#B3B3B3]" />
//     </div>
    
//           {/* Form */}
//           <form className="space-y-4" onSubmit={handleSubmit}>

//             <input
//   type="text"
//   name="fullName"
//   placeholder="Full Name"
//   value={formData.fullName}
//   onChange={handleChange}
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
// />


    
//             <input
//   type="email"
//   name="email"
//   value={formData.email}
//   onChange={handleChange}
//   placeholder="Email Address"
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
// />
    
//            <input
//   type="text"
//   name="location"
//   value={formData.location}
//   onChange={handleChange}
//   placeholder="Location"
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
// />
    
// {/* Password */}
//            <div className="relative">
// <input
//   type={showPassword ? "text" : "password"}
//   name="password"
//   value={formData.password}
//   onChange={handleChange}
//   placeholder="Password"
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
// />


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
//   {/* <input
//     type={showConfirmPassword ? "text" : "password"}
//     placeholder="Confirm Password"
//     className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm
//                focus:outline-none focus:border-blue-500"
//   /> */}
//   <input
//   type={showConfirmPassword ? "text" : "password"}
//   name="confirmPassword"
//   value={formData.confirmPassword}
//   onChange={handleChange}
//   placeholder="Confirm Password"
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
// />


//   <button
//     type="button"
//     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//   >
//     {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//   </button>
// </div>
    
//             {/* Remember & Forgot */}
//       <div className="flex items-center justify-between mb-12">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//               checked={agreed}
//   onChange={(e) => setAgreed(e.target.checked)}
//             className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
//                        focus:ring-blue-700 cursor-pointer"
//           />
          

//           <span className="text-sm text-black">I agree to the <span className='text-[#3E83C4]'>Terms & Conditions</span> and <span className='text-[#3E83C4]'>Privacy Policy</span></span>
//         </label>
    
        
//       </div>
    
//             {/* <button onClick={() => navigate("/verification-one")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
//               Create Account
//             </button> */}
// {error && (
//   <p className="text-sm text-red-500 text-center">{error}</p>
// )}

//             <button
//   type="submit"
//   disabled={loading || !agreed}
//   // onClick={handleSubmit}
//   className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition"
// >
//   {loading ? "Creating Account..." : "Create Account"}
// </button>


//             <p className="text-sm text-center text-black">
//         Already have a Fixserv account?{" "}
//         <a href="/artisan-login" className="text-[#3E83C4] hover:underline font-medium">
//           Log Up
//         </a>
//       </p>
//           </form>
//         </div>
//       </div>
//     </section>
    
//         </div>
//   )
// }

// export default ArtisanSignUp

import React, { useState } from "react";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import googleLogo from "../../assets/sign/google logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerArtisan } from "../../api/auth.api";
import { useGoogleLogin } from "@react-oauth/google";

const ArtisanSignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===============================
  // EMAIL + PASSWORD SIGNUP
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!agreed) {
      return setError("You must agree to the Terms & Conditions");
    }

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: "ARTISAN",
        artisanData: {
          businessName: "",
          skillSet: [],
          businessHours: {},
          location: formData.location.trim(),
          rating: 0,
        },
      };

      await registerArtisan(payload);

      // 🚫 DO NOT SAVE TOKEN HERE
      navigate("/verification-one", {
        state: { email: formData.email },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GOOGLE SIGNUP
  // ===============================
  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://user-management-h4hg.onrender.com/api/admin/google-login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken: tokenResponse.credential, // ✅ CORRECT
            }),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        localStorage.setItem("fixserv_token", data.token);
        localStorage.setItem("fixserv_user", JSON.stringify(data.user));
        localStorage.setItem("fixserv_role", data.user.role);

        navigate(
          data.user.role === "ARTISAN"
            ? "/artisan/onboarding"
            : "/client"
        );
      } catch (err) {
        setError(err.message || "Google signup failed");
      }
    },
  });

  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="relative">
        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 p-10">
          <img src={signLogo} className="h-10" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6">
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-center">
            Create Artisan Account
          </h2>

          <button
            type="button"
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md"
          >
            <img src={googleLogo} className="w-5 h-5" />
            Sign up with Google
          </button>

          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="location" placeholder="Location" onChange={handleChange} />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
          />

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to Terms & Conditions
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ArtisanSignUp;
