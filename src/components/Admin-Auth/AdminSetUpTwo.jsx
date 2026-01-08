import React from "react";
import upload from "../../assets/Admin Images/UPLOAD YOUR CERTIFICATE.png";
import { useNavigate } from "react-router-dom";



const AdminSetUpTwo = () => {
    const navigate = useNavigate();

  return (
    <div className="w-full bg-[#F6F6F6] flex justify-center">
<section className="w-full max-w-5xl mt-10 px-10 py-10 relative">

        {/* Skip */}
        <button onClick={() => navigate("/admin")} className="absolute top-6 cursor-pointer right-6 text-sm border border-gray-300 px-3 py-1 rounded text-gray-600">
          Skip onboarding
        </button>
      
      
              {/* Illustration */}
              <div className="flex justify-center mt-12 mb-8">
                <img src={upload} alt="" className="w-[420px]" />
              </div>
      
              {/* Welcome Text */}
              <h3 className="text-center text-lg font-semibold mb-2">
                Verification Management
              </h3>
      
              <p className="text-center text-sm text-gray-600 max-w-md mx-auto mb-10">
                Review and verify artisan profiles, approve documents, manage credentials, and ensure quality standards across the platform.
              </p>
      
              {/* Progress Bar */}
              <div className="border border-[#656565] px-6 py-4 flex items-center justify-between">
      
                {/* Left dots */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-4 h-1.5 bg-[#3E83C4] rounded"></div>
                  <div className="w-2 h-1.5 bg-gray-300 rounded"></div>
                  <div className="w-2 h-1.5 bg-gray-300 rounded"></div>
                </div>
      
                {/* Center text */}
                <span className="text-sm text-gray-600">
                  2/4
                </span>
      
                 <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin/admin-setup")}  className="border border-gray-300 cursor-pointer text-gray-600 text-sm px-5 py-2 rounded">
              Previous
            </button>

            

                <button onClick={() => navigate("/admin/admin-setup-three")} className="bg-[#3E83C4] text-white text-sm px-6 py-2 rounded cursor-pointer">
                  Next
                </button>
              </div>
              </div>
      
            </section>
    </div>
  );
};

export default AdminSetUpTwo;
