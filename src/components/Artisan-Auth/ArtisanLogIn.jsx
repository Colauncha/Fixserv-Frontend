import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, googleLogin as googleAuth } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext"; // if you use AuthContext
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

const { login } = useAuth();

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

  const res = await loginUser(
    { email, password: formData.password },
    { timeout: 60000 }
  );

  console.log("✅ STEP A: API returned", res?.status, res?.data);

  const inner = res?.data?.data; // { response, BearerToken }
  const token = inner?.BearerToken;
  const user = inner?.response;

  console.log("✅ STEP B: parsed", { token: !!token, user });

  if (!token || !user) {
    setError("Invalid server response (missing token/user).");
    return;
  }

  if (user.role !== "ARTISAN") {
    setError("This account is not an artisan account.");
    return;
  }

  // 1) localStorage — isolate
  try {
    console.log("✅ STEP C: saving to localStorage...");
    localStorage.setItem("fixserv_token", token);
    localStorage.setItem("fixserv_role", user.role);
    localStorage.setItem("fixserv_user", JSON.stringify(user));
    console.log("✅ STEP D: localStorage saved OK");
  } catch (storageErr) {
    console.error("❌ STORAGE ERROR =>", storageErr);
    console.log("STORAGE DETAILS =>", {
      name: storageErr?.name,
      message: storageErr?.message,
      code: storageErr?.code,
      stack: storageErr?.stack,
    });
    setError("Login succeeded but browser storage failed. Disable storage blocking / clear site data.");
    return;
  }

  // 2) AuthContext login — isolate
  try {
    console.log("✅ STEP E: calling AuthContext login...");
    login?.(token, { ...user, id: user._id });
    console.log("✅ STEP F: AuthContext login OK");
  } catch (ctxErr) {
    console.error("❌ AUTH CONTEXT ERROR =>", ctxErr);
    console.log("AUTH DETAILS =>", {
      name: ctxErr?.name,
      message: ctxErr?.message,
      code: ctxErr?.code,
      stack: ctxErr?.stack,
    });
    setError("Login succeeded but app session handler crashed (AuthContext).");
    return;
  }

  console.log("✅ STEP G: navigating...");
  navigate("/artisan");
} catch (err) {
  console.error("❌ LOGIN CATCH ERROR (RAW) =>", err);

  console.log("❌ DETAILS =>", {
    name: err?.name,
    message: err?.message,
    code: err?.code,
    stack: err?.stack,
  });

  // If axios/network error, this exists:
  console.log("❌ AXIOS INFO =>", {
    hasResponse: !!err?.response,
    status: err?.response?.status,
    data: err?.response?.data,
  });

  // DO NOT show timeout message unless it is truly a timeout
  if (err?.code === "ECONNABORTED") {
    setError("Server is taking too long to respond. Please try again.");
    return;
  }

  // If it’s NOT an axios response, it’s your app code throwing (storage/context/etc.)
  if (!err?.response) {
    setError(err?.message || "App crashed after login success. Check console error details.");
    return;
  }

  const apiData = err.response.data;
  const errMsg =
    apiData?.errors?.[0]?.message ||
    apiData?.message ||
    err?.message ||
    "Login failed";

  setError(errMsg);
} finally {
  setLoading(false);
}
};

const googleLogin = useGoogleLogin({
  // ✅ Use auth-code if your backend accepts { code } and exchanges it server-side
  flow: "auth-code",
  scope: "openid email profile",

  onSuccess: async (codeResponse) => {
    try {
      setLoading(true);
      setError("");

      // ✅ send the authorization code to your backend
      const { data } = await googleAuth({
        code: codeResponse.code,
      });

      // ✅ handle “soft failures” (200 but success:false)
      if (!data?.success) {
        const msgLower = String(data?.message || "").toLowerCase();

        if (data?.code === "EMAIL_NOT_VERIFIED" || msgLower.includes("verify")) {
          navigate("/verification", {
            state: { email: formData.email.trim().toLowerCase() },
          });
          return;
        }

        throw new Error(data?.message || "Google login failed");
      }

      const user = data?.user;
      const token = data?.BearerToken;

      if (!user || !token) {
        throw new Error(data?.message || "Invalid server response");
      }

      if (user.role !== "ARTISAN") {
        throw new Error("This Google account is not registered as an artisan.");
      }

      // ✅ Persist session
      login?.(token, { ...user, id: user._id });
      localStorage.setItem("fixserv_token", token);
      localStorage.setItem("fixserv_role", user.role);
      localStorage.setItem("fixserv_user", JSON.stringify(user));

      navigate("/artisan");
    } catch (err) {
      const status = err?.response?.status;
      const apiData = err?.response?.data;

      // ✅ also handle hard failures (403 etc)
      if (status === 403 && apiData?.code === "EMAIL_NOT_VERIFIED") {
        navigate("/verification", {
          state: { email: formData.email.trim().toLowerCase() },
        });
        return;
      }

      const message =
        apiData?.errors?.[0]?.message ||
        apiData?.message ||
        err?.message ||
        "Google login failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  },

  onError: () => setError("Google login failed"),
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

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

           <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-2 lg:mb-3 font-medium leading-tight">
          Hi!
        </h2>
    
           
        <p className="text-sm sm:text-base mb-4 text-white opacity-90">
          If you are looking to request repairs
        </p>
    
        <button onClick={() => navigate("/log-in")} className="border border-white text-[#ffffff] px-6 py-2 rounded-xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
          Join as an client
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
            Enter your details to log in your Fixserv artisan account
          </p>
    
          {/* Google */}
          
  <button
  type="button"
  disabled={loading}
  onClick={() => googleLogin()}
  className={`w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
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
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
>
  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>

{fieldErrors.password && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
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
    {error && (
  <p className="text-sm text-red-500 text-center mt-2">
    {error}
  </p>
)}
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

export default ArtisanLogIn