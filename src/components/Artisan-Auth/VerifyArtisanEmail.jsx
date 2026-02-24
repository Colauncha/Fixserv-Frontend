import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendVerification } from "../../api/auth.api";

const VerifyArtisanEmail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const notice = state?.notice;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please go back and sign up again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await resendVerification({ email: email.trim().toLowerCase() });

      setMessage(
        "Verification email has been resent. Please check your inbox and spam folder."
      );
    } catch (err) {
      const status = err?.response?.status;
      const rawMessage =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend verification email.";

      if (status === 404) {
        setError("No account found for this email. Please sign up again.");
      } else {
        setError(rawMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-xl font-semibold text-black mb-3">
          Check your email 📩
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          We’ve sent a verification link to
          <br />
          <span className="font-medium text-black">
            {email || "your email address"}
          </span>
        </p>

        <p className="text-xs text-gray-500 mb-6">
          Please check your inbox (and spam folder) and click the link to verify
          your account before logging in.
        </p>

        {error && (
          <div className="w-full bg-red-50 border border-red-400 text-red-600 text-sm px-4 py-3 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="w-full bg-green-50 border border-green-400 text-green-700 text-sm px-4 py-3 rounded-md text-center mb-4">
            {message}
          </div>
        )}

        {notice && (
  <div className="w-full bg-blue-50 border border-blue-300 text-blue-700 text-sm px-4 py-3 rounded-md text-center mb-4">
    {notice}
  </div>
)}

        <button
          onClick={() => navigate("/artisan-login")}
          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md font-medium transition cursor-pointer"
        >
          Go to Login
        </button>

       
        <p className="mt-4 text-sm text-gray-600">
  Didn’t receive the email?{" "}
  <button
    type="button"
    onClick={handleResend}
    disabled={loading}
    className="text-[#3E83C4] hover:underline font-medium disabled:opacity-50 cursor-pointer"
  >
    {loading ? "Resending..." : "Resend Verification Email"}
  </button>
</p>

      </div>
    </div>
  );
};

export default VerifyArtisanEmail;