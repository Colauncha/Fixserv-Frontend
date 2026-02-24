// import React, { useState } from 'react'
// import signLogo from '../../assets/sign/sign logo.png';
// import signImage from '../../assets/sign/sign image.png';
// import signOverlay from '../../assets/sign/sign overlay.png';
// import googleLogo from '../../assets/sign/google logo.png';
// import appleLogo from '../../assets/sign/apple logo.png';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff } from "lucide-react";
// import { useGoogleLogin } from "@react-oauth/google";

// const AdminSignUp = () => {
//     const navigate = useNavigate();
//       const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// const [formData, setFormData] = useState({
//   fullName: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
//   permissions: ["basic-access"],
// });

// const googleAdminLogin = useGoogleLogin({
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
//         throw new Error(data.message || "Google admin login failed");
//       }

//       /**
//        * EXPECTED BACKEND RESPONSE
//        * {
//        *   token: "...",
//        *   user: { id, fullName, email, role: "ADMIN" }
//        * }
//        */

//       // ✅ SAVE AUTH
//       localStorage.setItem("fixserv_token", data.token);
//       localStorage.setItem("fixserv_user", JSON.stringify(data.user));
//       localStorage.setItem("fixserv_role", data.user.role);

//       // ✅ ENSURE ADMIN ONLY
//       if (data.user.role !== "ADMIN") {
//         throw new Error("Unauthorized role");
//       }

//       // ✅ REDIRECT
//       navigate("/admin");

//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Google authentication failed");
//     }
//   },

//   onError: () => {
//     setError("Google authentication was cancelled");
//   },
// });


// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

// const [agreed, setAgreed] = useState(false);


// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prev) => ({ ...prev, [name]: value }));
// };

// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   setError("");

// //   if (formData.password !== formData.confirmPassword) {
// //     setError("Passwords do not match");
// //     return;
// //   }

// //   try {
// //     setLoading(true);

// //     const payload = {
// //       email: formData.email.trim(),
// //       password: formData.password,
// //       fullName: formData.fullName.trim(),
// //       role: "ADMIN",
// //       adminData: {
// //         permissions: formData.permissions,
// //       },
// //     };

// //     const res = await fetch(
// //       "https://user-management-h4hg.onrender.com/api/users/register",
// //       {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       }
// //     );

// //     const data = await res.json();

// //     if (!res.ok) {
// //       throw new Error(data.message || "Registration failed");
// //     }

// //     // ✅ Save role (needed for protected routes)
// //     localStorage.setItem("fixserv_role", "ADMIN");

// //     // ❌ Do NOT assume token exists here
// //     // Token should be set after login

// //     // ✅ Redirect to admin login
// //     navigate("/admin-login");

// //   } catch (err) {
// //     setError(err.message);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (!agreed) {
//     setError("You must agree to the Terms & Conditions");
//     return;
//   }

//   if (formData.password !== formData.confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   try {
//     setLoading(true);

//     const payload = {
//       email: formData.email.trim(),
//       password: formData.password,
//       fullName: formData.fullName.trim(),
//       role: "ADMIN",
//       adminData: {
//         permissions: formData.permissions,
//       },
//     };

//     const res = await fetch(
//       "https://user-management-h4hg.onrender.com/api/users/register",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // optional, safe
//     localStorage.setItem("fixserv_role", "ADMIN");

//     navigate("/admin-login");
//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//       <div>
//                 <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        
//         {/* LEFT — IMAGE PANEL */}
//       <div className="relative flex flex-col h-[300px] sm:h-[340px] lg:h-auto">

//           {/* Background */}
//           <img
//             src={signImage}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//           <img
//             src={signOverlay}
//             alt=""
//             className="absolute inset-0 w-full h-full object-cover"
//           />
        
//         {/* Logo */}
//         <div className="relative z-10 px-6 sm:px-10 lg:px-40 pt-6 sm:pt-10 lg:pt-16">
//           <img src={signLogo} className="h-8 sm:h-9 lg:h-10 w-auto" />
//         </div>
        
//         {/* Center Content */}
//         <div className="
//   relative z-10 flex-1 flex flex-col items-center justify-center
//   mb-8 sm:mb-12 lg:mb-30
//   px-6 sm:px-10 lg:px-14
//   text-center text-white max-w-lg mx-auto
// ">

//           <h2 className="text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-5 lg:mb-10 font-medium leading-tight">
//               Manage Your Platform
//             </h2>
        
//             <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 text-white">
//               Oversee artisans, clients, transactions, and platform performance from a single, powerful dashboard.
//             </p>
        
            
//           </div>
//         </div>
        
        
//           {/* RIGHT — FORM */}
//       <div className="flex items-center justify-center px-4 sm:px-6 py-10 sm:py-14 lg:py-16">
//             <div className="w-full max-w-md">
        
//               <h2 className="text-2xl font-semibold text-black text-center">
//                 Admin Portal
//               </h2>
//               <p className="text-sm text-[#656565] text-center mt-2 mb-8">
//                 Sign up to access the admin dashboard
//               </p>
        
//               {/* Google */}
//               <button
//   type="button"
//   onClick={() => googleAdminLogin()}
//   className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-md mb-4"
// >
//   <img src={googleLogo} alt="Google" className="w-5 h-5" />
//   Sign up with Google
// </button>

        
                      
//               <div className="flex items-center justify-center gap-4 mb-6">
//           <div className="w-6 h-px bg-[#B3B3B3]" />
//           <span className="text-sm text-[#B3B3B3]">Or</span>
//           <div className="w-6 h-px bg-[#B3B3B3]" />
//         </div>
        
//               {/* Form */}
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 <input
//   type="text"
//   name="fullName"
//   placeholder="Full Name"
//   value={formData.fullName}
//   onChange={handleChange}
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
// />

        
               
// <input
//   type="email"
//   name="email"
//   placeholder="Email Address"
//   value={formData.email}
//   onChange={handleChange}
//   className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
// />

        
        
// {/* Password */}
//            <div className="relative">
// <input
//   type={showPassword ? "text" : "password"}
//   name="password"
//   placeholder="Password"
//   value={formData.password}
//   onChange={handleChange}
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
// <input
//   type={showConfirmPassword ? "text" : "password"}
//   name="confirmPassword"
//   placeholder="Confirm Password"
//   value={formData.confirmPassword}
//   onChange={handleChange}
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
        
//                 {/* Confirmation */}
//           <div className="flex items-center justify-between mb-12">
//             <label className="flex items-center gap-2 cursor-pointer">
//               {/* <input
//                 type="checkbox"
//                 className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
//                            focus:ring-blue-700 cursor-pointer"
//               /> */}
//               <input
//   type="checkbox"
//   checked={agreed}
//   onChange={(e) => setAgreed(e.target.checked)}
//   className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
// />

//               <span className="text-sm text-black">I agree to the <span className='text-[#3E83C4]'>Terms & Conditions</span> and <span className='text-[#3E83C4]'>Privacy Policy</span></span>
//             </label>
        
            
//           </div>
        
//                 {/* <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
//                   Sign Up
//                 </button> */}
// {error && (
//   <p className="text-sm text-red-500 text-center">{error}</p>
// )}

//                 {/* <button
//   onClick={handleSubmit}
//   disabled={loading}
//   className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition disabled:opacity-60"
// >
//   {loading ? "Creating Account..." : "Sign Up"}
// </button> */}
// <button
//   type="submit"
//   disabled={loading || !agreed}
//   className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition disabled:opacity-60"
// >
//   {loading ? "Creating Account..." : "Sign Up"}
// </button>


    
//                 <p className="text-sm text-center text-black mb-20">
//             Already have a Fixserv account?{" "}
//             <a href="/admin-login" className="text-[#3E83C4] hover:underline font-medium">
//               Log In
//             </a>
//           </p>
//           <p className='text-sm text-center text-black bottom-0'>Protected by enterprise-grade security</p>
//               </form>
//             </div>
//           </div>
//         </section>
        
//             </div>
//   )
// }

// export default AdminSignUp

import React, { useState } from 'react'
import signLogo from '../../assets/sign/sign logo.png';
import signImage from '../../assets/sign/sign image.png';
import signOverlay from '../../assets/sign/sign overlay.png';
import googleLogo from '../../assets/sign/google logo.png';
import appleLogo from '../../assets/sign/apple logo.png';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

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
  onSuccess: async (tokenResponse) => {
    try {
      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: tokenResponse.access_token,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google admin login failed");
      }

      /**
       * EXPECTED BACKEND RESPONSE
       * {
       *   token: "...",
       *   user: { id, fullName, email, role: "ADMIN" }
       * }
       */

      // ✅ SAVE AUTH
      localStorage.setItem("fixserv_token", data.token);
      localStorage.setItem("fixserv_user", JSON.stringify(data.user));
      localStorage.setItem("fixserv_role", data.user.role);

      // ✅ ENSURE ADMIN ONLY
      if (data.user.role !== "ADMIN") {
        throw new Error("Unauthorized role");
      }

      // ✅ REDIRECT
      navigate("/admin");

    } catch (err) {
      console.error(err);
      setError(err.message || "Google authentication failed");
    }
  },

  onError: () => {
    setError("Google authentication was cancelled");
  },
});


const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [agreed, setAgreed] = useState(false);


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (formData.password !== formData.confirmPassword) {
//     setError("Passwords do not match");
//     return;
//   }

//   try {
//     setLoading(true);

//     const payload = {
//       email: formData.email.trim(),
//       password: formData.password,
//       fullName: formData.fullName.trim(),
//       role: "ADMIN",
//       adminData: {
//         permissions: formData.permissions,
//       },
//     };

//     const res = await fetch(
//       "https://user-management-h4hg.onrender.com/api/users/register",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.message || "Registration failed");
//     }

//     // ✅ Save role (needed for protected routes)
//     localStorage.setItem("fixserv_role", "ADMIN");

//     // ❌ Do NOT assume token exists here
//     // Token should be set after login

//     // ✅ Redirect to admin login
//     navigate("/admin-login");

//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!agreed) {
    setError("You must agree to the Terms & Conditions");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      email: formData.email.trim(),
      password: formData.password,
      fullName: formData.fullName.trim(),
      role: "ADMIN",
      adminData: {
        permissions: formData.permissions,
      },
    };

    const res = await fetch(
      "https://user-management-h4hg.onrender.com/api/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // optional, safe
    localStorage.setItem("fixserv_role", "ADMIN");

    navigate("/admin-login");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
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
        
        
          {/* RIGHT — FORM */}
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
        
              {/* Google */}
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
        
              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
  type="text"
  name="fullName"
  placeholder="Full Name"
  value={formData.fullName}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>

        
               
<input
  type="email"
  name="email"
  placeholder="Email Address"
  value={formData.email}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm"
/>

        
        
{/* Password */}
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


            {/* Confirm Password */}
<div className="relative">
<input
  type={showConfirmPassword ? "text" : "password"}
  name="confirmPassword"
  placeholder="Confirm Password"
  value={formData.confirmPassword}
  onChange={handleChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
/>


  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
        
                {/* Confirmation */}
          <div className="flex items-center justify-between mb-12">
            <label className="flex items-center gap-2 cursor-pointer">
              {/* <input
                type="checkbox"
                className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded 
                           focus:ring-blue-700 cursor-pointer"
              /> */}
              <input
  type="checkbox"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  className="w-4 h-4 text-[#3E83C4] border-gray-300 rounded focus:ring-blue-700 cursor-pointer"
/>

              <span className="text-sm text-black">I agree to the <span className='text-[#3E83C4]'>Terms & Conditions</span> and <span className='text-[#3E83C4]'>Privacy Policy</span></span>
            </label>
        
            
          </div>
        
                {/* <button onClick={() => navigate("/client")} className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer">
                  Sign Up
                </button> */}
{error && (
  <p className="text-sm text-red-500 text-center">{error}</p>
)}

                {/* <button
  onClick={handleSubmit}
  disabled={loading}
  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Sign Up"}
</button> */}
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