import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      setIsResetSuccessful(true);
    } else {
      alert("Passwords must match and not be empty.");
    }
  };

  const Logo = () => (
    <div 
      className="flex space-x-2 text-xl items-center mb-6 cursor-pointer"
        onClick={() => navigate('/')}
    >
      <span className="bg-[#779BE7] text-white text-lg font-bold w-14 h-14 flex items-center justify-center rounded-lg">
        FS </span>
        <span className="text-[#779BE7] ">Fixserv</span>  
    </div>
  );

  if (isResetSuccessful) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-100 to-white px-4">
        <div className="bg-white flex flex-col items-center justify-center text-center shadow-lg rounded-2xl p-14 w-full max-w-4xl min-h-[600px]">
          <Logo />
          <div className="mt-6"> 
          <p className="text-black font-medium text-lg mb-2">Successful password reset!</p>
          <p className="text-gray-600 mt-8 text-base">
            You can now use your new password to login to your account 🙌
          </p>
          </div>
          
          <button
            onClick={() => window.location.href = "/auth/login"}
            className="mt-20 w-full  bg-[#779BE7] hover:bg-blue-500 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-blue-100 to-blue-0 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-14 w-full max-w-4xl min-h-[600px]">
        <div className="flex flex-col items-center justify-center mb-10"> 
        <Logo />

        <span className="text-center font-semibold mt-2">Reset your password</span>
        </div>

        <form onSubmit={handleReset}>
          <label className="block font-semibold mb-4">New Password</label>
          <input
            type={showNewPassword ? "text" : "newPassword"}
            className="w-full px-4 py-2 border border-gray-400 rounded mb-8"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
              type="button"
              className="absolute inset-y-24  right-[380px] flex items-center text-[#113ca8] cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          <label className="block font-semibold mb-4">Confirm New Password</label>
          <input
            type={showConfirmPassword ? "text" : "newPassword"}
            className="w-full px-4 py-2 border border-gray-400 rounded mb-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
              type="button"
              className="absolute inset-y-0  right-[350px] flex items-center text-[#113ca8] cursor-pointer"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          <button
            type="submit"
            className="w-full bg-[#779BE7] hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
