import React from "react";
import log from "../../assets/Admin Images/log.png";
import { useNavigate } from "react-router-dom"; 

const AdminPostVerification = () => {
   const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-[#F6F6F6]">

      <div className="text-center">

        {/* Title */}
        <h1 className="text-black text-2xl font-semibold mb-3">
          Service Booking Platform
        </h1>

        {/* Subtitle */}
        <p className="text-black text-sm max-w-md mx-auto mb-10">
          Professional admin portal for managing artisans, clients, and platform operations
        </p>

{/* CTA Button */}
<div className="flex justify-center">
<button
  onClick={() => navigate("/admin/admin-setup")}
  className="bg-[#3E83C4] text-white px-8 py-3 flex items-center rounded-md text-sm font-medium hover:opacity-90 transition cursor-pointer"
>
  Access Admin Portal 
  <img src={log} alt="Admin Logo" className="h-5 ml-2" />
</button>

</div>



        {/* Footer Text */}
        <p className="text-black text-xs mt-8">
          Secure • Professional • Trusted
        </p>

      </div>

    </section>
  );
};

export default AdminPostVerification;
