import React, { useState }  from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// import profileImage from "../../../assets"
import profileImage from "../../../assets/client images/client-home/profile.png";
import mark from "../../../assets/client images/client-home/mark.png";
import star from "../../../assets/client images/client-home/star.png";


const ViewRepair = () => {

      const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* <section className="w-full px-24 md:px-53 py-14"> */}
                <section className="w-full py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-6">
  
        {/* Header */}
        <div className="text-center mb-12">
          <button onClick={() => navigate("/repair")} className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1">
            <ArrowLeft size={18} />
           Back
        </button>
        
          
          <h1 className="text-lg font-semibold text-black">
           Request Summary-#FX1230
          </h1>
          <p className="text-sm text-[#656565] mt-1">
            Double-check your request and make payment to confirm
          </p>
        </div>

        {/* Main Content */}
            <div className="grid grid-cols-[260px_1fr] gap-30 max-w-7xl mx-auto">

          {/* LEFT — Artisan Card */}
<div className="bg-[#EEF6FF] rounded-xl p-4 w-[290px]">
            <div className="flex flex-col">
          
              <img
                src={profileImage}
                alt="artisan"
                className="w-[250px] h-[220px] rounded-xl object-cover mb-4"
              />
          
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-black text-3xl">John Adewale</h2>
                <img src={mark} alt="verified" className="w-6 h-6" />
              </div>
          
              <p className="text-lg text-[#656565] mt-1">
                Electronics Technicians
              </p>
          
              {/* Rating */}
              <div className="flex items-center gap-1 mt-2 text-lg">
                <img src={star} alt="star" className="w-6 h-6" />
                <span className="font-medium text-black">4.7</span>
                <span className="text-black">(89 reviews)</span>
              </div>
          
              {/* Categories */}
              <div className="flex gap-2 mt-3">
                {["Phone", "Tablet", "Laptop"].map((item) => (
                  <span
                    key={item}
                    className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-lg"
                  >
                    {item}
                  </span>
                ))}
              </div>
          
              <div className="mt-4 text-lg text-[#656565] space-y-1">
                <p>
                  Experience: <span className="font-medium text-black">5+ years</span>
                </p>
                <p>
                  Location: <span className="font-medium text-black">Surulere, Lagos</span>
                </p>
              </div>
            </div>
          </div>


          {/* RIGHT — Booking Summary */}
<div className="pt-2">
  <h2 className="text-lg font-semibold text-black mb-6">
    Battery Replacement
  </h2>

  <div className="space-y-3 text-lg text-black">

    <p><span className="text-[#656565]">Booking ID:</span> FX1230</p>
    <p><span className="text-[#656565]">Device Type:</span> Phone</p>
    <p><span className="text-[#656565]">Device Brand:</span> iPhone</p>
    <p><span className="text-[#656565]">Device Model:</span> iPhone 12 Pro - Black</p>
    <p><span className="text-[#656565]">Issue description:</span> My phone dies quickly, overheats when charging</p>
    <p><span className="text-[#656565]">Location:</span> 23, Allen Avenue, Ikeja, Lagos.</p>
    <div className="pt-6 space-y-2">
      <p><span className="text-[#656565]">Service Cost:</span> ₦7,000.00</p>
      <p><span className="text-[#656565]">Platform Fee:</span> ₦500.00</p>
      <p><span className="text-[#656565]">Tax Fee:</span> ₦0.00</p>
      <p className="text-base font-semibold text-blue-600 pt-2">
        Total Fee: ₦7,500.00
      </p>
    </div>
  </div>
</div>



        </div>
      </div>
      </section>

      <section className="mt-16 max-w-4xl mx-auto">
  
   <div className="text-center space-y-4">
    <button
  // onClick={() => setActiveModal("wallet")}
  onClick={() => navigate("/rate-service")}
  className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white cursor-pointer px-16 py-3 rounded-md text-sm font-medium transition"
>
Rate Service
</button>


    <div>

      <button
  onClick={() => setActiveModal("cancel")}
  className="text-sm text-blue-600 cursor-pointer"
>
  Cancel Service
</button>




    </div>
  </div>

</section>

    </div>
  )
}

export default ViewRepair



