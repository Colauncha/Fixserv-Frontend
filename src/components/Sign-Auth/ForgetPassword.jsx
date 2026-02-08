// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ForgetPassword = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="w-full min-h-screen">

//       <section className="relative w-full flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-10">

//         {/* Back */}
//         <button onClick={() => navigate('/log-in')} className="text-sm text-[#3E83C4] flex items-center gap-1 hover:underline mb-8 cursor-pointer">
//           ← Back
//         </button>

//         {/* Content */}
//         <div className="flex flex-1 items-center justify-center bg-white py-10 sm:py-16">

//           <div className="w-full max-w-md">

//             <h1 className="text-2xl font-semibold text-black text-center mb-1">
//               Forgot Password?
//             </h1>

//             <h2 className="text-2xl font-semibold text-black text-center mb-4">
//               Not a Problem
//             </h2>

//             <p className="text-sm text-[#656565] text-center mb-10 leading-relaxed">
//               Enter your email address below and we will send you further
//               instructions on how to reset your password
//             </p>

//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
//                          focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
//             />

//             <button
//               className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
//                          text-white py-3 rounded-md font-medium transition mb-4 cursor-pointer"
//             >
//               Send Mail
//             </button>

//             <p className="text-sm text-center text-black">
//               <button
//                 onClick={() => navigate("/log-in")}
//                 className="text-[#3E83C4] hover:underline cursor-pointer font-medium"
//               >
//                 Log In
//               </button>
//             </p>

//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ForgetPassword;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <section className="relative w-full flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/log-in")}
          className="text-sm text-[#3E83C4] flex items-center gap-1 hover:underline mb-8 cursor-pointer"
        >
          ← Back
        </button>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center bg-white py-10 sm:py-16">
          <div className="w-full max-w-md">

            <h1 className="text-2xl font-semibold text-black text-center mb-1">
              Forgot Password?
            </h1>

            <h2 className="text-2xl font-semibold text-black text-center mb-4">
              Not a Problem
            </h2>

            <p className="text-sm text-[#656565] text-center mb-10 leading-relaxed">
              Enter your email address below and we will send you further
              instructions on how to reset your password
            </p>

            {!success && (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />

                {error && (
                  <p className="text-sm text-red-500 text-center mb-4">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] 
                             text-white py-3 rounded-md font-medium transition mb-4 cursor-pointer"
                >
                  {loading ? "Sending..." : "Send Mail"}
                </button>
              </>
            )}

            {success && (
              <div className="text-center space-y-4">
                <p className="text-green-600 text-sm">
                  Password reset instructions have been sent to your email.
                </p>

                <button
                  onClick={() => navigate("/log-in")}
                  className="text-[#3E83C4] hover:underline font-medium"
                >
                  Back to Login
                </button>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgetPassword;
