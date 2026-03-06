import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import signLogo from "../../assets/sign/sign logo.png";
import signImage from "../../assets/sign/sign image.png";
import signOverlay from "../../assets/sign/sign overlay.png";
import correct from "../../assets/client images/correct.png";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

      const BASE_URL = import.meta.env.VITE_USER_API;


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const handleSubmit = async () => {
  setError("");

  if (!token) {
    setError("Invalid or expired reset link");
    return;
  }

  if (!password || !confirmPassword) {
    setError("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  // Basic password strength rule
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    setError(
      "Password must be at least 8 characters and contain at least one number"
    );
    return;
  }

 try {
  setLoading(true);

  const res = await fetch(
    `${BASE_URL}/api/admin/reset-password?token=${encodeURIComponent(token)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    }
  );

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Password reset failed");
  }

  setShowSuccess(true);
} catch (err) {
  setError(err.message || "Something went wrong. Try again.");
} finally {
  setLoading(false);
}
};


  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT IMAGE PANEL (unchanged) */}
      <div className="relative hidden lg:flex flex-col">
        <img src={signImage} className="absolute inset-0 w-full h-full object-cover" />
        <img src={signOverlay} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 px-48 pt-16">
          <img src={signLogo} className="h-10 w-auto" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-14 text-center text-white max-w-md mx-auto">
          <p className="text-base opacity-90">
            Now create a new password to complete login.
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex justify-center px-6 bg-white pt-20">
        <div className="w-full max-w-md">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-20 text-sm text-[#3E83C4]"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-semibold text-black text-center mt-10">
            Reset Password
          </h2>

          <p className="text-sm text-[#656565] text-center mt-2 mb-8">
            Your account’s security matters to us. Choose a strong password.
          </p>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
              />
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 pr-12 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8 text-center">
            <img src={correct} className="w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Password Reset Successful
            </h3>
            <p className="text-sm text-[#656565] mb-6">
              You can now login with your new password
            </p>
            <button
              onClick={() => navigate("/log-in")}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-md"
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
