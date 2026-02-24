import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { Eye, EyeOff } from "lucide-react";
import { registerUser, googleLogin as googleAuth } from "../../api/auth.api";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ArtisanSignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});


const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  phoneNumber: "",
  location: "",
  password: "",
  confirmPassword: "",
  categories: [],   
});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });

  if (fieldErrors[e.target.name]) {
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  }
};


  // GOOGLE SIGNUP
const googleSignUp = useGoogleLogin({
  flow: "implicit",
  scope: "openid email profile",

  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await googleAuth({
        idToken: tokenResponse.id_token,
        role: "ARTISAN",   // important so backend knows role
      });

      localStorage.setItem("fixserv_token", data.BearerToken);
      localStorage.setItem("fixserv_role", data.user.role);
      localStorage.setItem("fixserv_user", JSON.stringify(data.user));

      navigate(
        data.user.role === "ARTISAN"
          ? "/artisan/onboarding"
          : "/client"
      );

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Google signup failed"
      );
    } finally {
      setLoading(false);
    }
  },

  onError: () => {
    setError("Google authentication failed");
  },
});


const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  const errors = {};

  if (!formData.fullName.trim()) errors.fullName = "Full name is required";
  if (!formData.email.trim()) errors.email = "Email is required";
  if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  if (!formData.location.trim()) errors.location = "Location is required";
  if (!formData.password) errors.password = "Password is required";
  if (!formData.confirmPassword)
    errors.confirmPassword = "Confirm your password";

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

  if (formData.categories.length === 0) {
  errors.categories = "Please select at least one category";
}

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setFieldErrors({});

try {
  setLoading(true);

  const rawPhone = formData.phoneNumber.trim();
  const cleanedPhone = rawPhone.replace(/[^\d+]/g, "");

  const normalizedPhone =
    cleanedPhone.startsWith("0")
      ? `+234${cleanedPhone.slice(1)}`
      : cleanedPhone.startsWith("234")
        ? `+${cleanedPhone}`
        : cleanedPhone.startsWith("+")
          ? cleanedPhone
          : `+${cleanedPhone}`;

  if (normalizedPhone.startsWith("+234") && normalizedPhone.length !== 14) {
    setFieldErrors((prev) => ({
      ...prev,
      phoneNumber: "Phone number must be a valid Nigerian number (e.g. 08012345678)",
    }));
    return;
  }

  const selectedCategories = formData.categories.map(String);
  const primaryCategory = selectedCategories[0];

  const payload = {
    email: formData.email.trim().toLowerCase(),
    password: formData.password, // don't trim
    fullName: formData.fullName.trim(),
    role: "ARTISAN",
    phoneNumber: normalizedPhone,

    category: primaryCategory,
    categories: selectedCategories,
    skillSet: selectedCategories,

    artisanData: {
      location: formData.location.trim(),
      category: primaryCategory,
      categories: selectedCategories,
      skillSet: selectedCategories,
    },
  };

  console.log("ARTISAN REGISTER PAYLOAD =>", payload);


  const { data } = await registerUser(payload);
  console.log("REGISTER RESPONSE =>", data);
  if (!data?.success) {
    throw new Error(data?.message || "Registration failed");
  }

  
setError(null);
  navigate("/artisan-verification", { state: { email: payload.email } });
}catch (err) {

if (axios.isAxiosError(err) && (!err.response || err.code === "ECONNABORTED")) {
  setError("Network issue: we couldn't confirm signup. Please try again.");
  return;
}

const apiData = err?.response?.data;
if (!apiData) {
  setError(err?.message || "Registration failed");
  return;
}

  console.log("ARTISAN REGISTER ERROR =>", err.response.status, apiData);
  console.log("ARTISAN REGISTER ERROR[0] =>", apiData?.errors?.[0]);
  console.log(
    "ARTISAN REGISTER ERROR MESSAGE =>",
    apiData?.errors?.[0]?.message || apiData?.message
  );
  console.log(
    "ARTISAN REGISTER ERROR FIELD =>",
    apiData?.errors?.[0]?.field || apiData?.errors?.[0]?.path
  );

  const status = err.response.status;

  const rawMessage =
    apiData?.errors?.[0]?.message ||
    apiData?.message ||
    err?.message ||
    "";

  const msgLower = String(rawMessage).toLowerCase();

  let message = "Registration failed";

  if (
    status === 409 ||
    msgLower.includes("duplicate key") ||
    msgLower.includes("e11000") ||
    msgLower.includes("dup key") ||
    msgLower.includes("email_1")
  ) {
    message = "An account with this email already exists. Please log in instead.";
  } else if (status === 422) {
    message = "Password is too weak. Please choose a stronger password.";
  } else if (status === 400) {
    message = rawMessage || "Invalid email or missing fields.";
  } else {
    message = rawMessage || "Something went wrong. Please try again.";
  }

  setError(message);
} finally {
  setLoading(false);
}
};


const CATEGORY_OPTIONS = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "AC Repair",
  "Cleaning",
  "Welding",
  "Tiling",
];

const toggleCategory = (category) => {
  setFormData((prev) => {
    const exists = prev.categories.includes(category);

    if (exists) {
      return {
        ...prev,
        categories: prev.categories.filter((c) => c !== category),
      };
    } else {
      return {
        ...prev,
        categories: [...prev.categories, category],
      };
    }
  });

  if (fieldErrors.categories) {
    setFieldErrors({ ...fieldErrors, categories: undefined });
  }
};

  return (
        <div>
             <section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%]">
    
    {/* LEFT — IMAGE PANEL */}
      <div className="relative flex flex-col 
                h-[300px] sm:h-[340px] 
                lg:h-screen 
                overflow-hidden">
    
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
        <div className="
  relative z-10 flex-1 flex flex-col items-center justify-center
  mb-8 sm:mb-12 lg:mb-40
  px-6 sm:px-10 lg:px-14
  text-center text-white max-w-lg mx-auto
">

          <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-2 lg:mb-3 font-medium leading-tight">
          Hi!
        </h2>
    
        <p className="text-base mb-2 opacity-90 text-white">
          If you are looking to request repairs
        </p>
    
        <button onClick={() => navigate("/sign-up")} className="border border-white px-5 sm:px-6 py-2 rounded-2xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
          Join as a client
        </button>
      </div>
    </div>
    
    
      {/* RIGHT — FORM */}
       <div className="flex items-start justify-center 
                px-6 sm:px-10 lg:px-16
                py-10 sm:py-14 lg:py-16
                h-screen 
                overflow-y-auto">

        <div className="w-full max-w-xl">
          {/* <div className="w-full max-w-2xl"> */}
    
          <h2 className="text-2xl font-semibold text-black text-center">
            Welcome to Fixserv
          </h2>
          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Create your artisan account to get repair requests, manage your earnings, and build a reputation that keeps clients coming back.
          </p>
    
          {/* Google */}
<button
  onClick={() => googleSignUp()}
  disabled={loading}
  className="w-full flex items-center justify-center mb-4 gap-3 bg-black text-white py-3 rounded-md cursor-pointer"
>
  <img src={googleLogo} className="w-5 h-5" />
  Sign up with Google
</button>
    
          {/* Apple */}
          <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6">
            <img src={appleLogo} alt="Apple" className="w-5 h-5" />
            Sign up with Apple
          </button>
    
          <div className="flex items-center justify-center gap-4 mb-6">
      <div className="w-6 h-px bg-[#B3B3B3]" />
      <span className="text-sm text-[#B3B3B3]">Or</span>
      <div className="w-6 h-px bg-[#B3B3B3]" />
    </div>
    
          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
<input
  type="text"
  name="fullName"
  value={formData.fullName}
  onChange={handleChange}
  placeholder="Full Name"
  className={`w-full rounded-md px-4 py-3 text-sm border
    ${fieldErrors.fullName ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.fullName && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.fullName}</p>
)}

<input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Email Address"
  className={`w-full rounded-md px-4 py-3 text-sm border
    ${fieldErrors.email ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.email && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
)}

<input
  type="text"
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
  placeholder="Phone Number"
  className={`w-full rounded-md px-4 py-3 text-sm border
    ${fieldErrors.phoneNumber ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.phoneNumber && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.phoneNumber}</p>
)}

    
<input
  type="text"
  name="location"
  value={formData.location}
  onChange={handleChange}
  placeholder="Location"
  className={`w-full rounded-md px-4 py-3 text-sm border
    ${fieldErrors.location ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.location && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.location}</p>
)}

<div>
  <p className="text-sm font-medium mb-2">Select Your Service Category</p>

  <div className="grid grid-cols-2 gap-2">
    {CATEGORY_OPTIONS.map((category) => {
      const selected = formData.categories.includes(category);

      return (
        <button
          type="button"
          key={category}
          onClick={() => toggleCategory(category)}
          className={`px-3 py-2 text-sm rounded-md border transition
            ${
              selected
                ? "bg-[#3E83C4] text-white border-[#3E83C4]"
                : "border-[#9BAAB9] text-black"
            }`}
        >
          {category}
        </button>
      );
    })}
  </div>

  {fieldErrors.categories && (
    <p className="text-xs text-red-500 mt-2">
      {fieldErrors.categories}
    </p>
  )}
</div>

    
{/* Password */}
           <div className="relative">
<input
  type={showPassword ? "text" : "password"}
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Password"
  className={`w-full rounded-md px-4 py-3 pr-12 text-sm border
    ${fieldErrors.password ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.password && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
)}



  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>


            {/* Confirm Password */}
<div className="relative">
<input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm Password"
  className={`w-full rounded-md px-4 py-3 pr-12 text-sm border
    ${fieldErrors.confirmPassword ? "border-red-500" : "border-[#9BAAB9]"}`}
/>
{fieldErrors.confirmPassword && (
  <p className="text-xs text-red-500 mt-1">
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
    
            {/* Remember & Forgot */}
      <div className="flex items-center justify-between mb-12">
        <label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    className="w-4 h-4"
  />
  <span className="text-sm text-black">
    I agree to the <span className="text-[#3E83C4]">Terms & Conditions</span> and{" "}
    <span className="text-[#3E83C4]">Privacy Policy</span>
  </span>
</label>

{fieldErrors.agreed && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.agreed}</p>
)}

    
        
      </div>
    
            {/* <button onClick={() => navigate("/verification-one")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
              Create Account
            </button> */}
{error && (
  <p className="text-sm text-red-500 text-center">{error}</p>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full bg-[#3E83C4] text-white py-3 rounded-md cursor-pointer"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>


            {/* <button
  type="submit"
  disabled={loading || !agreed}
  // onClick={handleSubmit}
  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition"
>
  {loading ? "Creating Account..." : "Create Account"}
</button> */}
            <p className="text-sm text-center text-black">
        Already have a Fixserv account?{" "}
        <a href="/artisan-login" className="text-[#3E83C4] hover:underline font-medium">
          Log In
        </a>
      </p>
          </form>
        </div>
      </div>
    </section>
    
        </div>
  )
}

export default ArtisanSignUp

