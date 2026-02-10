import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { Eye, EyeOff } from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";


const LogIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [fieldErrors, setFieldErrors] = useState({
  email: "",
  password: "",
});


const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

const newErrors = {
  email: "",
  password: "",
};

if (!formData.email.trim()) {
  newErrors.email = "Email is required";
}

if (!formData.password.trim()) {
  newErrors.password = "Password is required";
}

if (newErrors.email || newErrors.password) {
  setFieldErrors(newErrors);
  return;
}

// clear errors if valid
setFieldErrors({ email: "", password: "" });


  try {
    setLoading(true);

    const res = await fetch(
      "https://user-management-h4hg.onrender.com/api/admin/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      }
    );

    const data = await res.json();

//     console.log("✅ LOGIN RESPONSE:", data);

//     if (!res.ok) {
//       throw new Error(data.message || "Login failed");
//     }

//     console.log("✅ SAVING USER TO LOCALSTORAGE");

//     // ✅ Save auth
//    localStorage.setItem(
//   "fixserv_user",
//   JSON.stringify({
//     id: data.user.id,
//     fullName: data.user.fullName,
//     email: data.user.email,
//     role: data.user.role,
//   })
// );

// localStorage.setItem("fixserv_token", data.token);


// console.log("📦 STORED USER:", localStorage.getItem("fixserv_user"));

//     localStorage.setItem("fixserv_role", data.user?.role || "CLIENT");

//     // ✅ Go to dashboard
//     navigate("/client");

//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

console.log("✅ LOGIN RESPONSE:", data);
console.log("✅ SAVING USER TO LOCALSTORAGE");

const user = data.data.response;
const token = data.data.BearerToken;

localStorage.setItem(
  "fixserv_user",
  JSON.stringify({
    id: user._id,          // 🔥 IMPORTANT
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  })
);

localStorage.setItem("fixserv_token", token);
localStorage.setItem("fixserv_role", user.role);

navigate("/client");

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const googleLogin = useGoogleLogin({
  flow: "implicit", // gives us id_token
  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: tokenResponse.id_token, // 🔥 THIS is what backend wants
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      const user = data.data.response;
      const token = data.data.BearerToken;

      // ✅ Save same way as normal login
      localStorage.setItem(
        "fixserv_user",
        JSON.stringify({
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        })
      );

      localStorage.setItem("fixserv_token", token);
      localStorage.setItem("fixserv_role", user.role);

      navigate("/client");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },
  onError: () => {
    setError("Google login failed");
  },
});



  return (
    <div>
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">


{/* LEFT — IMAGE PANEL */}
<div className="relative flex flex-col min-h-[340px] sm:min-h-[340px] lg:min-h-full">


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

        {/* Logo */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-36 pt-6 sm:pt-10 lg:pt-16">
          <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
        </div>

        {/* Center Content */}
        {/* <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

          * <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
      Welcome Back!
    </h2>

    <p className="text-sm sm:text-base mb-16 sm:mb-12  text-white opacity-90">
      Let’s help you get it fixed
    </p> *

    <p className="text-sm sm:text-base mb-4 sm:mb-6  text-white opacity-90">
      Are you a professional looking to offer your services?
    </p>

    <button onClick={() => navigate("/artisan-login")} className="border border-white px-5 sm:px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] transition">
      Join as an artisan
    </button>
  </div> */}
          <div className="
  relative z-10 flex-1 flex flex-col items-center justify-center
  mb-8 sm:mb-12 lg:mb-10
  px-6 sm:px-10 lg:px-14
  text-center text-white max-w-lg mx-auto
">
  <p className="text-sm sm:text-base mb-6 opacity-90">
    Are you a skilled professional? Looking to offer your services?
  </p>

  <button
    onClick={() => navigate('/artisan-signup')}
    className="border border-white px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] cursor-pointer transition"
  >
    Join as an artisan
  </button>
</div>
</div>


  {/* RIGHT — FORM */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
        <div className="w-full max-w-md">

      <h2 className="text-2xl font-semibold text-black text-center">
        Log In
      </h2>
      <p className="text-sm text-[#656565] text-center mt-2 mb-8">
        Enter your details to log in your Fixserv client account
      </p>

      {/* Google */}
      {/* <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md cursor-pointer mb-4">
        <img src={googleLogo} alt="Google" className="w-5 h-5" />
        Sign up with Google
      </button> */}

      <button
  onClick={() => googleLogin()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md cursor-pointer mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign up with Google
</button>


      {/* Apple */}
      <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6 cursor-pointer">
        <img src={appleLogo} alt="Apple" className="w-5 h-5" />
        Sign up with Apple
      </button>

{/* <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16"> */}
          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">

  <div className="w-6 h-px bg-[#B3B3B3]" />
  <span className="text-sm text-[#B3B3B3]">Or</span>
  <div className="w-6 h-px bg-[#B3B3B3]" />
</div>

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>


  {/* Email */}
<input
  type="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={(e) => {
    setFormData({ ...formData, email: e.target.value });
    setFieldErrors({ ...fieldErrors, email: "" });
  }}
  className={`w-full border rounded-md px-4 py-3 text-sm
    ${fieldErrors.email ? "border-red-500" : "border-[#9BAAB9]"}
  `}
/>

{fieldErrors.email && (
  <p className="text-xs text-red-500 mt-1">
    {fieldErrors.email}
  </p>
)}



  {/* Password */}
  {/* <input
    type="password"
    placeholder="Password"
    className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
               focus:outline-none focus:ring-2 focus:ring-blue-500"
  /> */}
             <div className="relative">
<input
  type={showPassword ? "text" : "password"}
  placeholder="Password"
  value={formData.password}
  onChange={(e) => {
    setFormData({ ...formData, password: e.target.value });
    setFieldErrors({ ...fieldErrors, password: "" });
  }}
  className={`w-full border rounded-md px-4 py-3 pr-12 text-sm
    ${fieldErrors.password ? "border-red-500" : "border-[#9BAAB9]"}
  `}
/>

{fieldErrors.password && (
  <p className="text-xs text-red-500 mt-1">
    {fieldErrors.password}
  </p>
)}
  

  
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
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

  {/* Submit */}
  {error && (
  <p className="text-sm text-red-500 text-center mt-2">
    {error}
  </p>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md cursor-pointer"
>
  {loading ? "Logging in..." : "Log In"}
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