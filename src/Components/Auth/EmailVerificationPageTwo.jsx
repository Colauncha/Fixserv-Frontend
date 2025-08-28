
import React from "react";
import KycNavbar from "../Navbar/KycNavbar";
import resendEmail from "../../assets/uploads/Resend Email.png";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <KycNavbar />
      <div className="flex items-center justify-center mt-20">
        <div
          className="bg-white rounded-2xl shadow-lg px-15 max-w-lg w-full text-center"
          style={{
            boxShadow:
              "0 -3px 6px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
          }}
        >
         
          <div className="flex justify-center mb-2">
            <img
              src={resendEmail}
              alt="Email Illustration"
              className="w-42 h-42 mt-5"
            />
          </div>

          
          <div className="flex flex-col items-center">
            <div className="text-left space-y-3 mb-14">
              <p className="text-gray-600 text-sm">
                <span className="text-blue-500">Welome to Fixserv</span>, a
                verification mail has been sent to your email, follow the link
                to continue
              </p>
            </div>
          </div>

         
          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 font-semibold hover:underline cursor-pointer mb-10"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
