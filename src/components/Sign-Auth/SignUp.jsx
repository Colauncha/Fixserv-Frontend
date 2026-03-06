import React, { useState } from "react";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import googleLogo from "../../assets/sign/google logo.png";
import appleLogo from "../../assets/sign/apple logo.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser, googleLogin } from "../../api/auth.api";
// import { googleUserLogin } from "/src/api/auth.api.js";

const SignUp = () => {
  const navigate = useNavigate();
  
const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  location: "",
  password: "",
  confirmPassword: "",
  referral: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [agreed, setAgreed] = useState(false);

const [fieldErrors, setFieldErrors] = useState({});


const handleChange = (e) => {
  setError("");
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};


  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async () => {
  if (loading) return;

  setError("");
  const errors = {};

  const { firstName, lastName, email, phoneNumber, password, confirmPassword } = formData;

  if (!firstName.trim()) errors.firstName = "First name is required";
  if (!lastName.trim()) errors.lastName = "Last name is required";
  if (!email.trim()) errors.email = "Email is required";
  if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
  if (!password) errors.password = "Password is required";
  if (!confirmPassword) errors.confirmPassword = "Confirm your password";

  if (password && confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (!agreed) {
    errors.agreed = "You must agree to the Terms & Conditions";
  }

  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setFieldErrors({});

  try {
    setLoading(true);

    // ✅ normalize phone
    const rawPhone = phoneNumber.trim();
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
      setFieldErrors({
        phoneNumber: "Phone number must be a valid Nigerian number (e.g. 08012345678)",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("REGISTER PAYLOAD =>", {
      email: normalizedEmail,
      fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      role: "CLIENT",
      phoneNumber: normalizedPhone,
      passwordLength: password?.length,
    });

    await registerUser({
      email: normalizedEmail,
      password,
      fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      role: "CLIENT",
      phoneNumber: normalizedPhone,
    });

    // ✅ if register succeeds, go verify
    navigate("/verification", { state: { email: normalizedEmail } });

  } catch (err) {
    console.log("REGISTER ERROR BODY =>", err?.response?.data);
    console.log("REGISTER ERROR FIRST =>", err?.response?.data?.errors?.[0]);

    const status = err?.response?.status;
    const data = err?.response?.data;

    if (status === 504) {
      setError("Server is taking too long to respond. Please try again in a moment.");
      return;
    }

    if (err?.code === "ECONNABORTED" || !err?.response) {
      // backend may have created the user but response timed out
      navigate("/verification", { state: { email: email.trim().toLowerCase() } });
      return;
    }

    const rawMessage =
      data?.errors?.[0]?.message ||
      data?.message ||
      err?.message ||
      "";

    const msgLower = String(rawMessage).toLowerCase();

    // ✅ if account already exists, resend verification and go to verification screen
    if (msgLower.includes("already exists")) {
      const normalizedEmail = email.trim().toLowerCase();

      try {
        await resendVerification({ email: normalizedEmail });
      } catch (e) {
        // ignore
      }

      navigate("/verification", { state: { email: normalizedEmail } });
      return;
    }

    // ✅ fallback error message
    setError(rawMessage || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleGoogleError = () => {
  setError("Google Sign-In failed. Please try again.");
};

const login = useGoogleLogin({
  flow: "implicit",   // important
  scope: "openid email profile",

  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await googleLogin({
  idToken: tokenResponse.id_token,
});

if (!data?.user || !data?.BearerToken) {
  throw new Error(data?.message || "Invalid server response");
}

localStorage.setItem("fixserv_token", data.BearerToken);
localStorage.setItem("fixserv_role", data.user.role);

switch (data.user.role) {
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
  const message =
    err?.response?.data?.errors?.[0]?.message ||
    err?.response?.data?.message ||
    "Google Sign-In failed. Please try again.";

  setError(message);
} finally {
      setLoading(false);
    }
  },

  onError: handleGoogleError,
});

  return (
<section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%] animate-fadeIn">

      {/* LEFT — BRAND PANEL */}
      <div className="relative flex flex-col 
                h-[300px] sm:h-[340px] 
                lg:h-screen 
                overflow-hidden">

        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />

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
  <h2 className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-2 lg:mb-3 font-medium leading-tight">
          Hey!
        </h2>
  <p className="text-sm sm:text-base mb-6 opacity-90">
    Are you a skilled professional? Looking to offer your services?
  </p>

  <button
    onClick={() => navigate('/artisan-signup')}
    className="border border-white px-6 py-2 rounded-2xl font-medium cursor-pointer hover:bg-white hover:text-[#3E83C4] transition"
  >
    Join as an artisan
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
            Sign Up as a Client
          </h2>

          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Enter your details to set up your new Fixserv client account.
          </p>

          {/* Social Buttons */}
    
<button
  onClick={() => { console.log("🟡 Google button clicked"); 
    login(); 
  }}
    disabled={loading}
  className="w-full cursor-pointer flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
>
  <img src={googleLogo} className="w-5 h-5" />
  Sign up with Google
</button>

          <button className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-6 cursor-pointer">
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
          <form className="space-y-4 sm:space-y-5" onSubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>

<input
  name="firstName"
  value={formData.firstName}
  onChange={handleChange}
  placeholder="First Name"
  className={`w-full rounded-md px-4 py-3 text-sm border 
    ${fieldErrors.firstName ? "border-red-500" : "border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition"}`}
 />
{fieldErrors.firstName && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
)}

<input
  name="lastName"
  value={formData.lastName}
  onChange={handleChange}
  placeholder="Last Name"
  className={`w-full rounded-md px-4 py-3 text-sm border 
    ${fieldErrors.lastName ? "border-red-500" : "border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition"}`}
 />
{fieldErrors.lastName && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
)}

<input
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Email Address"
  className={`w-full rounded-md px-4 py-3 text-sm border 
    ${fieldErrors.email ? "border-red-500" : "border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition"}`}
/>
{fieldErrors.email && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
)}

<input
  name="phoneNumber"
  value={formData.phoneNumber}
  onChange={handleChange}
  placeholder="Phone Number"
  className={`w-full rounded-md px-4 py-3 text-sm border 
    ${fieldErrors.phoneNumber ? "border-red-500" : "border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition"}`}
/>
{fieldErrors.phoneNumber && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.phoneNumber}</p>
)}

{/* Password */}
<div className="relative">
<input
  type={showPassword ? "text" : "password"}
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Password"
  className={`w-full rounded-md px-4 py-3 pr-12 text-sm border 
    ${fieldErrors.password ? "border-red-500" : "border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition"}`}
/>
{formData.password && (
  <p className="text-xs text-gray-500 mt-1">
    Use at least 8 characters with letters and numbers
  </p>
)}
{fieldErrors.password && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
)}

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
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Confirm Password"
    className="w-full border border-[#9BAAB9] focus:outline-none focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] transition rounded-md px-4 py-3 pr-12 text-sm"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

<input
  value={formData.referral}
  onChange={handleChange}
  type="text"
  name="referral"
  placeholder="Referral Code (Optional)"
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>

 {/* Terms */}
<label className="flex items-start gap-2 text-sm text-gray-600">
  <input
    type="checkbox"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    className="mt-1 cursor-pointer"
  />
  <span>
    I agree to the{" "}
    <span className="text-[#3E83C4] cursor-pointer">Terms & Conditions</span>{" "}
    and{" "}
    <span className="text-[#3E83C4] cursor-pointer">Privacy Policy</span>
  </span>
</label>

{fieldErrors.agreed && (
  <p className="text-xs text-red-500 mt-1">{fieldErrors.agreed}</p>
)}



{error && (
  <div className="w-full bg-red-50 border border-red-400 text-red-600 text-sm px-4 py-3 rounded-md text-center">
    {error}
  </div>
)}

<button
  type="submit"
  disabled={loading}
  className="w-full cursor-pointer bg-[#3E83C4] hover:bg-[#2f6fa9] active:scale-[0.98] transition-all text-white py-3 rounded-md font-medium"
>
  {loading ? (
  <span className="flex items-center justify-center gap-2">
    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
    Creating account...
  </span>
) : (
  "Sign Up as a Client"
)}
</button>

            <p className="text-sm text-center text-black">
              Already have a Fixserv account?{" "}
              <a className="text-[#3E83C4] hover:underline" href="/log-in">
                Log In
              </a>
            </p>

          </form>
        </div>
      </div>

    </section>
  );
};

export default SignUp;
