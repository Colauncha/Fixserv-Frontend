import React from "react";
import cancel from "../../assets/Artisan Images/cancel.png";
import doc from "../../assets/Artisan Images/doc.png";
import { useNavigate } from "react-router-dom";

const PostVerificationTwo = () => {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 relative">

        {/* Close Button */}
        <button className="absolute top-6 right-6">
          <img src={cancel} alt="Close" className="w-4 h-4" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome to Fixserv!
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          Let’s get your account set up for the best experience. Complete these
          steps to get started
        </p>

        {/* Step 1 */}
        <div className="flex items-center justify-between border border-blue-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <img src={doc} alt="Verify Email" className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Verify Email
              </h4>
              <p className="text-sm text-gray-600">
                Email verification is crucial for account security and
                communication.
              </p>
            </div>
          </div>

          <button className="bg-blue-200 text-[#3E83C4] text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-300 transition">
            Resend Email
          </button>
        </div>

        {/* Step 2 */}
        <div className="flex items-center justify-between border border-blue-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100">
              <img src={doc} alt="Profile" className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Complete Your Professional Profile
              </h4>
              <p className="text-sm text-gray-600">
                A complete profile helps clients trust your services and find
                you easily.
              </p>
            </div>
          </div>

          <button onClick={() => navigate("/upload-certificate")} className="bg-[#3E83C4] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer transition">
            Go to Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostVerificationTwo;
