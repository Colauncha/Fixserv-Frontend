import React, { useState, useRef } from "react";
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  registerUser,
  googleLogin,
} from "../../api/auth.api";

const AdminSignUp = () => {
    const navigate = useNavigate();
      const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  permissions: ["basic-access"],
});

const googleAdminLogin = useGoogleLogin({
  flow: "implicit",

  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await googleLogin({
        idToken: tokenResponse.access_token,
      });

      if (!data?.user || !data?.BearerToken) {
        throw new Error("Invalid server response");
      }

      if (data.user.role !== "ADMIN") {
        throw new Error("Unauthorized role");
      }

      localStorage.setItem(
        "fixserv_token",
        data.BearerToken
      );

      localStorage.setItem(
        "fixserv_user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "fixserv_role",
        data.user.role
      );

      navigate("/admin");
    } catch (err) {
      console.log("GOOGLE ADMIN ERROR =>", err);

      setError(
        err.backendMessage ||
        err.message ||
        "Google authentication failed"
      );
    } finally {
      setLoading(false);
    }
  },

  onError: () => {
    setError("Google authentication was cancelled");
  },
});


const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [fieldErrors, setFieldErrors] = useState({});
const formRef = useRef(null);

const [agreed, setAgreed] = useState(false);

const getPasswordStrength = (password) => {
  if (!password) return { label: "", color: "" };

  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return { label: "Weak password", color: "text-red-500" };

  if (score <= 3)
    return { label: "Medium strength", color: "text-yellow-500" };

  return {
    label: "Strong password",
    color: "text-green-600",
  };
};


const handleChange = (e) => {
  const { name, value } = e.target;

  setError("");

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setFieldErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setError("");

  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm your password";
  }

  if (
    formData.password &&
    formData.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!agreed) {
    errors.agreed = "You must agree to the Terms & Conditions";
  }

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);

    const firstErrorField = Object.keys(errors)[0];

    const element =
      formRef.current?.querySelector(
        `[name="${firstErrorField}"]`
      );

    if (element) {
      element.focus();
    }

    return;
  }

  setFieldErrors({});

try {
  setLoading(true);

  const payload = {
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    fullName: formData.fullName.trim(),
    role: "ADMIN",
    adminData: {
      permissions: ["basic-access"],
    },
  };

  console.log("ADMIN REGISTER PAYLOAD =>", payload);

  await registerUser(payload);

  navigate("/admin-login");
} 
catch (err) {
  console.log("FULL ERROR", err);
  console.log("STATUS", err.status);
  console.log("BACKEND MESSAGE", err.backendMessage);

  const status = err.status;

  const msg = String(
    err.backendMessage || err.message || ""
  ).toLowerCase();

  if (
  msg.includes("email already") ||
  msg.includes("email exist") ||
  msg.includes("already exists") ||
  msg.includes("already registered") ||
  msg.includes("user already") ||
  msg.includes("duplicate") ||
  msg.includes("e11000")
) {
  setFieldErrors({
    email: "An account with this email already exists.",
  });
  return;
}

  if (msg.includes("invalid email")) {
    setFieldErrors({
      email: "Please enter a valid email address.",
    });
    return;
  }

  if (
    msg.includes("password") &&
    msg.includes("least")
  ) {
    setFieldErrors({
      password: "Password must be at least 8 characters.",
    });
    return;
  }

  if (status >= 500) {
    setError("Server error. Please try again later.");
    return;
  }

  setError(
    err.message ||
    "Unable to create account."
  );
} finally {
    setLoading(false);
  }
};
  return (
      <div>
                    <section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%]">

            <div className="relative flex flex-col 
                h-[300px] sm:h-[340px] 
                lg:h-screen 
                overflow-hidden">

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
        
        <div className="relative z-10 px-6 sm:px-10 lg:px-30 pt-6 sm:pt-10 lg:pt-16">
          <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
        </div>
        
        <div className="
  relative z-10 flex-1 flex flex-col items-center justify-center
  mb-8 sm:mb-12 lg:mb-30
  px-6 sm:px-10 lg:px-14
  text-center text-white max-w-lg mx-auto
">

          <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
              Manage Your Platform
            </h2>
        
            <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 text-white">
              Oversee artisans, clients, transactions, and platform performance from a single, powerful dashboard.
            </p>
        
            
          </div>
        </div>
        
        
           <div className="flex items-start justify-center 
                px-6 sm:px-10 lg:px-16
                py-10 sm:py-14 lg:py-16
                h-screen 
                overflow-y-auto">
                    <div className="w-full max-w-xl">
        
              <h2 className="text-2xl font-semibold text-black text-center">
                Admin Portal
              </h2>
              <p className="text-sm text-[#656565] text-center mt-2 mb-8">
                Sign up to access the admin dashboard
              </p>
        
              <button
  type="button"
  onClick={() => googleAdminLogin()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign up with Google
</button>

        
                      
              <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-6 h-px bg-[#B3B3B3]" />
          <span className="text-sm text-[#B3B3B3]">Or</span>
          <div className="w-6 h-px bg-[#B3B3B3]" />
        </div>
        
              <form
  ref={formRef}
  className="space-y-4"
  onSubmit={handleSubmit}
>
                <input
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={formData.fullName}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>
{fieldErrors.fullName && (
  <p className="text-xs text-red-500">
    {fieldErrors.fullName}
  </p>
)}

        
               
<input
  type="email"
  name="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>
{fieldErrors.email && (
  <p className="text-xs text-red-500">
    {fieldErrors.email}
  </p>
)}

           <div className="relative">
<input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
/>
{formData.password && (
  <p
    className={`text-xs mt-1 ${
      getPasswordStrength(formData.password).color
    }`}
  >
    {getPasswordStrength(formData.password).label}
  </p>
)}

{fieldErrors.password && (
  <p className="text-xs text-red-500">
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

<div className="relative">
<input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
/>
{fieldErrors.confirmPassword && (
  <p className="text-xs text-red-500">
    {fieldErrors.confirmPassword}
  </p>
)}


  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
        
          <div className="flex items-center justify-between mb-12">
            <label className="flex items-center gap-2 cursor-pointer">
              
              <input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
/>


              <span className="text-sm text-black">I agree to the <span className='text-[#3E83C4]'>Terms & Conditions</span> and <span className='text-[#3E83C4]'>Privacy Policy</span></span>
            </label>
        {fieldErrors.agreed && (
  <p className="text-xs text-red-500">
    {fieldErrors.agreed}
  </p>
)}
            
          </div>
        
{error && (
  <p className="text-sm text-red-500 text-center">{error}</p>
)}

<button
  type="submit"
  disabled={loading || !agreed}
  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Sign Up"}
</button>


    
                <p className="text-sm text-center text-black mb-20">
            Already have a Fixserv account?{" "}
            <a href="/admin-login" className="text-[#3E83C4] hover:underline font-medium">
              Log In
            </a>
          </p>
          <p className='text-sm text-center text-black bottom-0'>Protected by enterprise-grade security</p>
              </form>
            </div>
          </div>
        </section>
        
            </div>
  )
}

export default AdminSignUp