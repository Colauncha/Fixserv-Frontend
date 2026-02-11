import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";


import { useNavigate } from 'react-router-dom';

const ArtisanLogIn = () => {
    const navigate = useNavigate();

      const [showPassword, setShowPassword] = useState(false);

      const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const [fieldErrors, setFieldErrors] = useState({
  email: "",
  password: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const newErrors = { email: "", password: "" };

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

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const user = data.data.response;
    const token = data.data.BearerToken;

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

if (user.role === "ARTISAN") {
  navigate("/artisan");
} else {
  navigate("/artisan-login");
}

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const googleLogin = useGoogleLogin({
  flow: "implicit",
  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: tokenResponse.id_token,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      const user = data.data.response;
      const token = data.data.BearerToken;

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

      navigate("/artisan");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  },
  onError: () => setError("Google login failed"),
});


  return (
        <div>
            <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
    
    {/* LEFT — IMAGE PANEL */}
    <div className="relative flex flex-col h-[350px] sm:h-[340px] lg:h-auto">
    
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
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

          {/* <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
          Welcome Back, Pro!
        </h2>
    
        <p className="text-sm sm:text-base mb-20 sm:mb-12 text-white opacity-90">
          Pick up right where you left off
        </p> */}
    
        <p className="text-sm sm:text-base mb-4 text-white opacity-90">
          If you are looking to request repairs
        </p>
    
        <button onClick={() => navigate("/log-in")} className="border border-white text-[#ffffff] px-6 py-2 rounded-xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
          Join as an client
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
            Enter your details to log in your Fixserv artisan account
          </p>
    
          {/* Google */}
          <button
  onClick={() => googleLogin()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign in with Google
</button>

    
              
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
  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
)}

    
      {/* Password */}
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
  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
)}

{error && (
  <p className="text-sm text-red-500 text-center mt-2">
    {error}
  </p>
)}




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
          onClick={() => navigate("/artisan-forget")}
          className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
      </div>
    
      {/* Submit */}
      {/* <button
        type="submit"
        onClick={() => navigate("/artisan")}
        className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
                   text-white py-3 rounded-md font-medium transition cursor-pointer"
      >
        Log In
      </button> */}
<button
  type="submit"
  disabled={loading}
  // disabled={loading || !formData.email || !formData.password}

  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8]
             text-white py-3 rounded-md font-medium transition cursor-pointer"
>
  {loading ? "Logging in..." : "Log In"}
</button>

    
      {/* Footer */}
      <p className="text-sm text-center text-black">
        Don’t have a Fixserv account?{" "}
        <a href="/artisan-signup" className="text-[#3E83C4] hover:underline font-medium">
          Sign Up dev
        </a>
      </p>
    
    </form>
    
        </div>
      </div>
    </section>
    
        </div>
  )
}

export default ArtisanLogIn