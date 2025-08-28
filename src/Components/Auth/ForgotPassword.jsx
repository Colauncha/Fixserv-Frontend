import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // const errorData = await response.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to request password reset");
      }

      setIsSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Logo = () => (
    <div 
      className="flex space-x-2 text-xl items-center mb-6 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <span className="bg-[#779BE7] text-white text-lg font-bold w-14 h-14 flex items-center justify-center rounded-lg">
        FS
      </span>
      <span className="text-[#779BE7] ">Fixserv</span>  
    </div>
  );

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-100 to-white px-4">
        <div className="bg-white flex flex-col items-center justify-center text-center shadow-lg rounded-2xl p-14 w-full max-w-4xl min-h-[400px]">
          <Logo />
          {/* <p className="text-black font-medium text-lg mb-4">
            If an account exists with <span className="font-semibold">{email}</span>,
             a reset link has been sent!
          </p> */}
          <p className="text-black font-medium text-lg mb-4">
             A reset link has been sent!
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="mt-6 w-full bg-[#779BE7] hover:bg-blue-500 text-white py-2 px-4 rounded"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-100 to-white px-4">
      <div className="bg-white shadow-lg rounded-2xl p-14 w-full max-w-4xl min-h-[400px]">
        <div className="flex flex-col items-center justify-center mb-10"> 
          <Logo />
          <span className="text-center font-semibold mt-2">Forgot your password?</span>
          <p className="text-gray-600 text-center mb-8">
          Enter your email and we’ll send you a reset link.
        </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-400 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#779BE7] hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
