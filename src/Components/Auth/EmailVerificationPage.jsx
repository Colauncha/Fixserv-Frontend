import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import KycNavbar from "../Navbar/KycNavbar";
import resendEmail from "../../assets/uploads/Resend Email.png";

const EmailVerificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const state = location.state;

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/api/users/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "email@gmail.com" }), 
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend email");
      }

      setMessage("✅ Verification email resent successfully!");
    } catch (error) {
      setMessage("❌ Failed to resend email. Please try again.");
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <KycNavbar />
      <div className="flex items-center justify-center mt-20">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 py-10 px-6 max-w-lg w-full text-center"
          style={{
            boxShadow:
              "0 -3px 6px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
          }}
        >
       
          <div className="flex justify-center mb-2">
            <img
              src={resendEmail}
              alt="Email Illustration"
              className="w-42 h-42"
            />
          </div>

      
          <h2 className="text-xl font-extrabold text-gray-900 text-center mb-6">
            Confirm your email address
          </h2>

         
          <div className="flex flex-col items-center">
            <div className="text-left space-y-3 mb-12">
              <p className="text-gray-600 text-sm">
                We sent a confirmation email to:{" "}
                <a
                  href="mailto:email@gmail.com"
                  className="font-semibold text-black-500 hover:underline"
                >
                  {state?.email}
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                Check your email and click on the confirmation link to continue
              </p>
            </div>
          </div>

    
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-500 font-semibold hover:underline cursor-pointer disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Email"}
            </button>
          </div>


          {message && (
            <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;






