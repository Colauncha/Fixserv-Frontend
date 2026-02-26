import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { Eye, EyeOff } from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";
import { adminLogin, googleLogin as googleAuth } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext"


const LogIn = () => {
  const navigate = useNavigate();

  
const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

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

  const newErrors = { email: "", password: "" };
  if (!formData.email.trim()) newErrors.email = "Email is required";
  if (!formData.password) newErrors.password = "Password is required";

  if (Object.values(newErrors).some(Boolean)) {
    setFieldErrors(newErrors);
    return;
  }

  setFieldErrors({ email: "", password: "" });

  const email = formData.email.trim().toLowerCase();

  try {
    setLoading(true);

    const res = await adminLogin({ email, password: formData.password });
    console.log("✅ LOGIN RESPONSE:", res.data);

    // Your API shape is: { data: { BearerToken, response } }
    const wrapper = res.data;
    const inner = wrapper?.data ?? wrapper;

    const token = inner?.BearerToken || inner?.token;
    const user = inner?.response || inner?.user;

    if (!token || !user) {
      // This is a LOCAL validation error, not network
      setError(wrapper?.message || "Invalid server response (missing token/user).");
      return;
    }

    // ✅ Save auth

    login?.(token, user);
    
    // login?.(token, { ...user, id: user._id });

    // localStorage.setItem("fixserv_token", token);
    // localStorage.setItem("fixserv_role", user.role);
    // localStorage.setItem("fixserv_user", JSON.stringify(user));


    switch (user.role) {
      case "CLIENT":
        navigate("/client");
        break;
      case "ARTISAN":
        navigate("/artisan");
        break;
      case "ADMIN":
        navigate("/admin");
        break;
      default:
        navigate("/");
    }
  } catch (err) {
    console.error("LOGIN ERROR RAW =>", err);

    // ✅ REAL network/timeout errors only
    if (err?.code === "ECONNABORTED") {
      setError("Server is taking too long to respond. Please try again.");
      return;
    }

    if (!err?.response) {
      setError(err?.message || "Network/server issue. Please try again.");
      return;
    }

    const status = err.response.status;
    const apiData = err.response.data;

    // ✅ email not verified
    if (status === 403 && apiData?.code === "EMAIL_NOT_VERIFIED") {
      navigate("/verification", {
        state: {
          email,
          notice:
            "Please verify your email to continue. We can resend the link if you didn’t receive it.",
        },
      });
      return;
    }

    const backendMessage =
      apiData?.errors?.[0]?.message ||
      apiData?.message ||
      "Login failed";

    setError(backendMessage);
  } finally {
    setLoading(false);
  }
};

const googleLoginHandler = useGoogleLogin({
  flow: "implicit", // will return id_token
  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);
      setError("");

      // Call your central backend endpoint
      const { data } = await googleAuth({
        idToken: tokenResponse.id_token,
      });

      console.log("✅ GOOGLE LOGIN RESPONSE:", data);

      // Validate response
      if (!data?.user || !data?.BearerToken) {
        throw new Error(data?.message || "Invalid server response");
      }

      const user = data.user;
      const token = data.BearerToken;

      // Save to AuthContext
      login(token, {
        ...user,
        id: user._id,
      });

      // Redirect based on role
      switch (user.role) {
        case "CLIENT":
          navigate("/client");
          break;
        case "ARTISAN":
          navigate("/artisan");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/"); // fallback
      }

    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);
      setError(err?.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  },
  onError: () => {
    setError("Google login failed. Please try again.");
  },
});




  return (
    <div>
    <section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%]">


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
        <div className="relative z-10 px-6 sm:px-10 lg:px-30 pt-6 sm:pt-10 lg:pt-16">
          <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
        </div>
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
      <div className="flex items-center justify-center 
                px-6 sm:px-10 lg:px-16 
                py-10 sm:py-14 lg:py-16">

          {/* <div className="w-full max-w-2xl"> */}
          <div className="w-full max-w-xl">


      <h2 className="text-2xl font-semibold text-black text-center">
        Log In
      </h2>
      <p className="text-sm text-[#656565] text-center mt-2 mb-8">
        Enter your details to log in your Fixserv client account
      </p>

      {/* <button
  onClick={() => googleLogin()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md cursor-pointer mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign up with Google
</button> */}

<button
  onClick={() => googleLoginHandler()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign in with Google
</button>



      {/* Apple */}
      <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6 cursor-pointer">
        <img src={appleLogo} alt="Apple" className="w-5 h-5" />
        Sign up with Apple
      </button>

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