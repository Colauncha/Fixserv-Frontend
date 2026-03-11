// working but need to handle ui errors 

// import React, { useState } from 'react'
// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import googleLogo from '../../assets/sign/google logo.png';
// import appleLogo from '../../assets/sign/apple logo.png';
// import { Eye, EyeOff } from "lucide-react";
// import { useGoogleLogin } from "@react-oauth/google";
// // import { loginUser, googleLogin as googleAuth } from "../../api/auth.api";
// import { useAuth } from "../../context/AuthContext"; // if you use AuthContext
// import { useNavigate } from 'react-router-dom';



// import { loginUser, googleLogin as googleAuth } from "../../api/auth.api";
// // import { fetchAdminById } from "../../api/admin.api";


// const ArtisanLogIn = () => {
//     const navigate = useNavigate();

//       const [showPassword, setShowPassword] = useState(false);

//       const [formData, setFormData] = useState({
//   email: "",
//   password: "",
// });

// const [fieldErrors, setFieldErrors] = useState({
//   email: "",
//   password: "",
// });

// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

// const { login } = useAuth();

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   const newErrors = { email: "", password: "" };
//   if (!formData.email.trim()) newErrors.email = "Email is required";
//   if (!formData.password) newErrors.password = "Password is required";

//   if (Object.values(newErrors).some(Boolean)) {
//     setFieldErrors(newErrors);
//     return;
//   }

//   setFieldErrors({ email: "", password: "" });

//   const email = formData.email.trim().toLowerCase();

//   try {
//   setLoading(true);

//   const res = await loginUser(
//     { email, password: formData.password },
//     { timeout: 60000 }
//   );

//   console.log("✅ STEP A: API returned", res?.status, res?.data);

//   const inner = res?.data?.data; // { response, BearerToken }
//   const token = inner?.BearerToken;
//   const user = inner?.response;

//   console.log("✅ STEP B: parsed", { token: !!token, user });

//   if (!token || !user) {
//     setError("Invalid server response (missing token/user).");
//     return;
//   }

//   if (user.role !== "ARTISAN") {
//     setError("This account is not an artisan account.");
//     return;
//   }
// try {
//   console.log("✅ STEP C: saving token/role to localStorage...");
//   localStorage.setItem("fixserv_token", token);
//   localStorage.setItem("fixserv_role", user.role);
//   console.log("✅ STEP D: token/role saved OK");
// } catch (storageErr) {
//   console.error("❌ STORAGE ERROR =>", storageErr);
//   setError("Login succeeded but browser storage failed. Disable storage blocking / clear site data.");
//   return;
// }

// // 2) Fetch fresh profile so user is always up-to-date after re-login
// const adminId = user?.id || user?._id || user?.artisanId;

// let freshUser = user;

// try {
//   if (adminId) {
//     console.log("✅ STEP E: fetching fresh profile...", adminId);
//     const profRes = await fetchAdminById(adminId);

//     // depending on backend shape: {data:{...}} or {data:{data:{...}}}
//     freshUser = profRes?.data?.data || profRes?.data || user;
//     console.log("✅ STEP F: fresh profile loaded");
//   }
// } catch (e) {
//   console.warn("⚠️ Could not fetch fresh profile after login, using login user.", e);
// }

// // Normalize fields for your UI
// const normalizedUser = {
//   ...freshUser,
//   id: freshUser?._id || freshUser?.id || adminId,
//   // make sure skills always exists for UI
//   skills: freshUser?.skills || freshUser?.skillSet || user?.skills || user?.skillSet || [],
//   // unify phone naming
//   phone: freshUser?.phone || freshUser?.phoneNumber || user?.phone || user?.phoneNumber || "",
// };

// // 3) Persist full user object
// try {
//   localStorage.setItem("fixserv_user", JSON.stringify(normalizedUser));
// } catch (storageErr) {
//   console.error("❌ STORAGE ERROR saving user =>", storageErr);
//   setError("Login succeeded but saving user profile failed in storage. Clear site data and try again.");
//   return;
// }

// // 4) AuthContext
// try {
//   console.log("✅ STEP G: calling AuthContext login...");
//   login?.(token, normalizedUser);
//   console.log("✅ STEP H: AuthContext login OK");
// } catch (ctxErr) {
//   console.error("❌ AUTH CONTEXT ERROR =>", ctxErr);
//   setError("Login succeeded but app session handler crashed (AuthContext).");
//   return;
// }

//   console.log("✅ STEP G: navigating...");
//   navigate("/artisan");
// } catch (err) {
//   console.error("❌ LOGIN CATCH ERROR (RAW) =>", err);

//   console.log("❌ DETAILS =>", {
//     name: err?.name,
//     message: err?.message,
//     code: err?.code,
//     stack: err?.stack,
//   });

//   // If axios/network error, this exists:
//   console.log("❌ AXIOS INFO =>", {
//     hasResponse: !!err?.response,
//     status: err?.response?.status,
//     data: err?.response?.data,
//   });

//   // DO NOT show timeout message unless it is truly a timeout
//   if (err?.code === "ECONNABORTED") {
//     setError("Server is taking too long to respond. Please try again.");
//     return;
//   }

//   // If it’s NOT an axios response, it’s your app code throwing (storage/context/etc.)
//   if (!err?.response) {
//     setError(err?.message || "App crashed after login success. Check console error details.");
//     return;
//   }

//   const apiData = err.response.data;
//   const errMsg =
//     apiData?.errors?.[0]?.message ||
//     apiData?.message ||
//     err?.message ||
//     "Login failed";

//   setError(errMsg);
// } finally {
//   setLoading(false);
// }
// };

// const googleLogin = useGoogleLogin({
//   // ✅ Use auth-code if your backend accepts { code } and exchanges it server-side
//   flow: "auth-code",
//   scope: "openid email profile",

//  onSuccess: async (codeResponse) => {
//   try {
//     setLoading(true);
//     setError("");

//     const { data } = await googleAuth({ code: codeResponse.code });

//     if (!data?.success) {
//       const msgLower = String(data?.message || "").toLowerCase();
//       if (data?.code === "EMAIL_NOT_VERIFIED" || msgLower.includes("verify")) {
//         navigate("/verification", {
//           state: { email: formData.email.trim().toLowerCase() },
//         });
//         return;
//       }
//       throw new Error(data?.message || "Google login failed");
//     }

//     const user = data?.user;
//     const token = data?.BearerToken;

//     if (!user || !token) throw new Error("Invalid server response");
//     if (user.role !== "ARTISAN") throw new Error("This Google account is not registered as an artisan.");

//     // 1) Persist token/role first
//     localStorage.setItem("fixserv_token", token);
//     localStorage.setItem("fixserv_role", user.role);

//     // 2) Fetch fresh profile (optional but best)
//     const adminId = user?._id || user?.id || user?.artisanId;

//     let freshUser = user;
//     try {
//       if (adminId) {
//         const profRes = await fetchAdminById(adminId);
//         freshUser = profRes?.data?.data || profRes?.data || user;
//       }
//     } catch (e) {
//       console.warn("⚠️ Could not fetch fresh profile after google login", e);
//     }

//     // 3) Normalize for UI
//     const finalUser = {
//       ...freshUser,
//       id: freshUser?._id || freshUser?.id || adminId,
//       skills: freshUser?.skills || freshUser?.skillSet || user?.skills || user?.skillSet || [],
//       phone: freshUser?.phone || freshUser?.phoneNumber || user?.phone || user?.phoneNumber || "",
//     };

//     // 4) Save user + context
//     localStorage.setItem("fixserv_user", JSON.stringify(finalUser));
//     login?.(token, finalUser);

//     navigate("/artisan");
//   } catch (err) {
//     const status = err?.response?.status;
//     const apiData = err?.response?.data;

//     if (status === 403 && apiData?.code === "EMAIL_NOT_VERIFIED") {
//       navigate("/verification", {
//         state: { email: formData.email.trim().toLowerCase() },
//       });
//       return;
//     }

//     const message =
//       apiData?.errors?.[0]?.message ||
//       apiData?.message ||
//       err?.message ||
//       "Google login failed";

//     setError(message);
//   } finally {
//     setLoading(false);
//   }
// },

//   onError: () => setError("Google login failed"),
// });

//   return (
//         <div>
//     <section className="h-screen grid grid-cols-1 lg:grid-cols-[40%_60%]">
    
//     {/* LEFT — IMAGE PANEL */}
// <div className="relative flex flex-col min-h-[340px] sm:min-h-[340px] lg:min-h-full">
    
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
//         <div className="relative z-10 px-6 sm:px-10 lg:px-30 pt-6 sm:pt-10 lg:pt-16">
//           <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
//         </div>

//         {/* Center Content */}
//         <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">

//            <h2 className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-2 lg:mb-3 font-medium leading-tight">
//           Hey!
//         </h2>
    
           
//         <p className="text-sm sm:text-base mb-4 text-white opacity-90">
//           Are you looking to request repairs?
//         </p>
    
//         <button onClick={() => navigate("/log-in")} className="border border-white text-[#ffffff] px-6 py-2 rounded-xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer">
//           Join as a client
//         </button>
//       </div>
//     </div>
    
    
//       {/* RIGHT — FORM */}
//            <div className="flex items-center justify-center 
//                 px-6 sm:px-10 lg:px-16 
//                 py-10 sm:py-14 lg:py-16">

//           {/* <div className="w-full max-w-2xl"> */}
//           <div className="w-full max-w-xl">
    
//           <h2 className="text-2xl font-semibold text-black text-center">
//             Log In
//           </h2>
//           <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//             Enter your details to log in your Fixserv artisan account
//           </p>
    
//           {/* Google */}
          
//   <button
//   type="button"
//   disabled={loading}
//   onClick={() => googleLogin()}
//   className={`w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
// >
//   <img src={googleLogo} alt="Google" className="w-5 h-5" />
//   Sign in with Google
// </button>

    
              
//           <div className="flex items-center justify-center gap-4 mb-6">
//       <div className="w-6 h-px bg-[#B3B3B3]" />
//       <span className="text-sm text-[#B3B3B3]">Or</span>
//       <div className="w-6 h-px bg-[#B3B3B3]" />
//     </div>
    
//           {/* Form */}
//           <form className="space-y-5" onSubmit={handleSubmit}>
    
//       {/* Email */}
//       <input
//   type="email"
//   placeholder="Email Address"
//   value={formData.email}
//   onChange={(e) => {
//     setFormData({ ...formData, email: e.target.value });
//     setFieldErrors({ ...fieldErrors, email: "" });
//   }}
//   className={`w-full border rounded-md px-4 py-3 text-sm
//     ${fieldErrors.email ? "border-red-500" : "border-[#9BAAB9]"}
//   `}
// />

// {fieldErrors.email && (
//   <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
// )}

    
//       {/* Password */}
//  <div className="relative">
//   <input
//   type={showPassword ? "text" : "password"}
//   placeholder="Password"
//   value={formData.password}
//   onChange={(e) => {
//     setFormData({ ...formData, password: e.target.value });
//     setFieldErrors({ ...fieldErrors, password: "" });
//   }}
//   className={`w-full border rounded-md px-4 py-3 pr-12 text-sm
//     ${fieldErrors.password ? "border-red-500" : "border-[#9BAAB9]"}
//   `}
  
// />
// <button
//   type="button"
//   onClick={() => setShowPassword(!showPassword)}
//   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
// >
//   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// </button>

// {fieldErrors.password && (
//   <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
// )}
// </div>
    
//       {/* Remember & Forgot */}
//       <div className="flex items-center justify-between mb-12">
//         <label className="flex items-center gap-2 cursor-pointer">
//           <input
//             type="checkbox"
//             className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
//                        focus:ring-blue-700 cursor-pointer"
//           />
//           <span className="text-sm text-black">Remember me</span>
//         </label>
    
//         <button
//           type="button"
//           onClick={() => navigate("/artisan-forget")}
//           className="text-sm text-[#3E83C4] hover:underline cursor-pointer"
//         >
//           Forgot password?
//         </button>
//       </div>
    
//       {/* Submit */}
//     {error && (
//   <p className="text-sm text-red-500 text-center mt-2">
//     {error}
//   </p>
// )}
// <button
//   type="submit"
//   disabled={loading}
//   // disabled={loading || !formData.email || !formData.password}

//   className="w-full bg-[#3E83C4] hover:bg-[#2d75b8]
//              text-white py-3 rounded-md font-medium transition cursor-pointer"
// >
//   {loading ? "Logging in..." : "Log In"}
// </button>

    
//       {/* Footer */}
//       <p className="text-sm text-center text-black">
//         Don’t have a Fixserv account?{" "}
//         <a href="/artisan-signup" className="text-[#3E83C4] hover:underline font-medium">
//           Sign Up
//         </a>
//       </p>
    
//     </form>
    
//         </div>
//       </div>
//     </section>
    
//         </div>
//   )
// }

// export default ArtisanLogIn


import React, { useState } from "react";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import googleLogo from "../../assets/sign/google logo.png";
import appleLogo from "../../assets/sign/apple logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { loginUser, googleLogin as googleAuth } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
// import fetchAdminById if you need to refresh user profile
// import { fetchAdminById } from "../../api/admin.api";

const ArtisanLogIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NORMAL EMAIL/PASSWORD LOGIN
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

      const res = await loginUser({ email, password: formData.password }, { timeout: 60000 });
      const inner = res?.data?.data; // { response, BearerToken }
      const token = inner?.BearerToken;
      const user = inner?.response;

      if (!token || !user) {
        setError("Invalid server response (missing token/user).");
        return;
      }

      if (user.role !== "ARTISAN") {
        setError("This account is not an artisan account.");
        return;
      }

      // Persist token/role
      localStorage.setItem("fixserv_token", token);
      localStorage.setItem("fixserv_role", user.role);

      // Optionally fetch fresh profile if backend supports it
      let normalizedUser = user;
      /*
      try {
        const adminId = user?._id || user?.id || user?.artisanId;
        if (adminId) {
          const profRes = await fetchAdminById(adminId);
          const fresh = profRes?.data?.data || profRes?.data || user;
          normalizedUser = {
            ...fresh,
            id: fresh?._id || fresh?.id || adminId,
            skills: fresh?.skills || fresh?.skillSet || [],
            phone: fresh?.phone || fresh?.phoneNumber || "",
          };
        }
      } catch (e) {
        console.warn("Could not refresh profile, using login user.", e);
      }
      */

      // Save full user
      localStorage.setItem("fixserv_user", JSON.stringify(normalizedUser));

      // Call AuthContext
      login?.(token, normalizedUser);

      navigate("/artisan");
    } catch (err) {

  console.error("Artisan login error =>", err);

  if (err?.code === "ECONNABORTED") {
    setError("Server is taking too long to respond. Please try again.");
    return;
  }

  if (!err?.response) {
    setError("Network error. Please check your internet connection.");
    return;
  }

  const status = err?.response?.status;
  const apiData = err?.response?.data;

  const rawMessage =
    apiData?.errors?.[0]?.message ||
    apiData?.message ||
    err?.message ||
    "";

  const msg = String(rawMessage).toLowerCase();



  /* EMAIL NOT FOUND */

if (
  msg.includes("user not found") ||
  msg.includes("email not found") ||
  msg.includes("account not found") ||
  msg.includes("no user with that email") ||
  msg.includes("user does not exist") ||
  msg.includes("email does not exist") ||
  msg.includes("email not registered")
) {
  setFieldErrors({
    email: "No artisan account found with this email.",
    password: "",
  });
  return;
}




  /* INCORRECT PASSWORD */

  if (
    msg.includes("invalid credentials") ||
    msg.includes("incorrect password") ||
    msg.includes("password incorrect")
  ) {
    setFieldErrors({
      email: "",
      password: "Incorrect password. Please try again.",
    });
    return;
  }



  /* UNAUTHORIZED */

  if (status === 401) {
    setError("Invalid email or password.");
    return;
  }



  /* SERVER ERROR */

  if (status >= 500) {
    setError("Server error. Please try again later.");
    return;
  }



  setError("Unable to log in. Please try again.");

}
 finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "openid email profile",

    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        setError("");

        const { data } = await googleAuth({ code: codeResponse.code, role: "ARTISAN" });

        if (!data?.success) {
          const msgLower = String(data?.message || "").toLowerCase();
          if (data?.code === "EMAIL_NOT_VERIFIED" || msgLower.includes("verify")) {
            navigate("/verification", { state: { email: formData.email.trim().toLowerCase() } });
            return;
          }
          throw new Error(data?.message || "Google login failed");
        }

        const user = data?.user;
        const token = data?.BearerToken;

        if (!user || !token) throw new Error("Invalid server response");
        if (user.role !== "ARTISAN") throw new Error("This Google account is not registered as an artisan.");

        // Persist token and role
        localStorage.setItem("fixserv_token", token);
        localStorage.setItem("fixserv_role", user.role);

        // Normalize user
        const finalUser = {
          ...user,
          id: user?._id || user?.id || user?.artisanId,
          skills: user?.skills || user?.skillSet || [],
          phone: user?.phone || user?.phoneNumber || "",
        };

        // Save user and context
        localStorage.setItem("fixserv_user", JSON.stringify(finalUser));
        login?.(token, finalUser);

        navigate("/artisan");
      } catch (err) {
        const apiData = err?.response?.data;
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
        {/* LEFT IMAGE PANEL */}
        <div className="relative flex flex-col min-h-[340px] sm:min-h-[340px] lg:min-h-full">
          <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
          <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />
          <div className="relative z-10 px-6 sm:px-10 lg:px-30 pt-6 sm:pt-10 lg:pt-16">
            <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
          </div>
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-10 lg:px-14 text-center text-white max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl mb-6 font-medium leading-tight">Hey!</h2>
            <p className="text-sm sm:text-base mb-4 text-white opacity-90">
              Are you looking to request repairs?
            </p>
            <button
              onClick={() => navigate("/log-in")}
              className="border border-white text-white px-6 py-2 rounded-xl font-medium hover:bg-white hover:text-[#3E83C4] transition cursor-pointer"
            >
              Join as a client
            </button>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-semibold text-black text-center">Log In</h2>
            <p className="text-sm text-[#656565] text-center mt-2 mb-8">
              Enter your details to log in your Fixserv artisan account
            </p>

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

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setFieldErrors({ ...fieldErrors, email: "" });
                }}
                className={`w-full border rounded-md px-4 py-3 text-sm ${fieldErrors.email ? "border-red-500" : "border-[#9BAAB9]"}`}
              />
              {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setFieldErrors({ ...fieldErrors, password: "" });
                  }}
                  className={`w-full border rounded-md px-4 py-3 pr-12 text-sm ${fieldErrors.password ? "border-red-500" : "border-[#9BAAB9]"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>

              <div className="flex items-center justify-between mb-12">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded focus:ring-blue-700 cursor-pointer" />
                  <span className="text-sm text-black">Remember me</span>
                </label>
                <button type="button" onClick={() => navigate("/artisan-forget")} className="text-sm text-[#3E83C4] hover:underline cursor-pointer">
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}

              <button type="submit" disabled={loading} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                {loading ? "Logging in..." : "Log In"}
              </button>

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
  );
};

export default ArtisanLogIn;