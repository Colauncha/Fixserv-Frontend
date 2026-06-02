import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { adminLogin, googleLogin } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";


const AdminLogIn = () => {
    const navigate = useNavigate();
      const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [formData, setFormData] = useState({
  email: "",
  password: "",
});

const { login } = useAuth();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return;

  setError("");

  try {
    setLoading(true);

    const email = formData.email.trim().toLowerCase();

    const res = await adminLogin({
      email,
      password: formData.password,
    });

    const wrapper = res.data;
    const inner = wrapper?.data ?? wrapper;

    const token = inner?.BearerToken || inner?.token;
    const user = inner?.response || inner?.user;

    if (!token || !user) {
      setError("Unable to log in. Please try again.");
      return;
    }

   
    if (user.role !== "ADMIN") {
      setError("Unauthorized access.");
      return;
    }

    login?.(token, user);

    navigate("/admin");

  } catch (err) {

    if (err?.code === "ECONNABORTED") {
      setError("Server is taking too long to respond.");
      return;
    }

    if (!err?.response) {
      setError("Network error. Check your connection.");
      return;
    }

    const status = err.response.status;

    const apiData = err.response.data;

    const rawMessage =
      apiData?.errors?.[0]?.message ||
      apiData?.message ||
      err?.message ||
      "";

    const msg = String(rawMessage).toLowerCase();

    if (
      msg.includes("invalid credentials") ||
      msg.includes("incorrect password")
    ) {
      setError("Incorrect email or password.");
      return;
    }

    if (
      msg.includes("user not found") ||
      msg.includes("email not found")
    ) {
      setError("No admin account found.");
      return;
    }

    if (status >= 500) {
      setError("Server error. Please try again later.");
      return;
    }

    setError("Unable to log in.");

  } finally {
    setLoading(false);
  }
};

const googleAdminLogin = useGoogleLogin({

  flow: "implicit",

  onSuccess: async (tokenResponse) => {

    try {

      setLoading(true);
      setError("");

      const { data } = await googleLogin({
        idToken: tokenResponse.access_token,
      });

      const token = data?.BearerToken || data?.token;
      const user = data?.user || data?.response;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      if (user.role !== "ADMIN") {
        throw new Error("Unauthorized access");
      }

      login(token, user);

      navigate("/admin");

    } catch (err) {

      setError(
        err?.message || "Google login failed."
      );

    } finally {

      setLoading(false);

    }

  },

  onError: () => {
    setError("Google authentication cancelled");
  },

});

useEffect(() => {
  const token = localStorage.getItem("fixserv_token");
  const role = localStorage.getItem("fixserv_role");

  if (!token) return;

  switch (role) {
    case "ADMIN":
      navigate("/admin");
      break;

    case "CLIENT":
      navigate("/client");
      break;

    case "ARTISAN":
      navigate("/artisan");
      break;

    default:
      navigate("/");
  }
}, [navigate]);

  return (
      <div>
                <section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%]">
        

        <div className="relative flex flex-col min-h-[340px] sm:min-h-[340px] lg:min-h-full">
        
        
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
        
         
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">
          <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
              Manage Your Platform
            </h2>
        
            <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 text-white">
              Oversee artisans, clients, transactions, and platform performance from a single, powerful dashboard.
            </p>
        
            
          </div>
        </div>
        
        
      
      <div className="flex items-center justify-center 
                px-6 sm:px-10 lg:px-16 
                py-10 sm:py-14 lg:py-16">

   
          <div className="w-full max-w-xl">
        
              <h2 className="text-2xl font-semibold text-black text-center">
                Admin Portal
              </h2>
              <p className="text-sm text-[#656565] text-center mt-2 mb-8">
                Enter your details to access the admin dashboard
              </p>
        

              <button
  type="button"
  onClick={() => googleAdminLogin()}
  className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
>
  <img src={googleLogo} alt="Google" className="w-5 h-5" />
  Sign in with Google
</button>

        
                      
              <div className="flex items-center justify-center gap-4 mb-6 mt-6">
          <div className="w-6 h-px bg-[#B3B3B3]" />
          <span className="text-sm text-[#B3B3B3]">Or</span>
          <div className="w-6 h-px bg-[#B3B3B3]" />
        </div>
        
              {/* Form */}
              <form className="space-y-4" onSubmit={handleLogin}>
                <label htmlFor="email">Email:</label>
                
        
               
        
              <input
  type="email"
  name="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>

        
        
                <label htmlFor="password">Password:</label>
       
           <div className="relative">
<input
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Password"
  value={formData.password}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
/>


  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

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
        
                {/* <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                  Sign In
                </button> */}
                {error && (
  <p className="text-sm text-red-500 text-center">{error}</p>
)}

                <button
  type="submit"
  disabled={loading}
  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition disabled:opacity-60"
>
  {loading ? "Signing In..." : "Sign In"}
</button>

    
          <p className='text-sm text-center text-black bottom-0'>Protected by enterprise-grade security</p>
              </form>
            </div>
          </div>
        </section>
        
            </div>
  )
}

export default AdminLogIn