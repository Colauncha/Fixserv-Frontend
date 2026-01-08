import React from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import mark from "../../assets/client images/client-home/mark.png";
import star from "../../assets/client images/client-home/star.png";
import upload from "../../assets/client images/client-home/upload.png";
import { useNavigate } from "react-router-dom";

const ClientBooking = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* <section className="w-full px-8 md:px-20 py-14"> */}
      {/* <section className="w-full px-24 md:px-53 py-14"> */}
              <section className="w-full py-14 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-6">
        
        {/* Back */}
        <button className="text-sm text-[#3E83C4] mb-6 flex items-center gap-1">
          ← Back
        </button>

        <div className="grid md:grid-cols-[1.6fr_1fr] gap-6">
          
          
          {/* LEFT – FORM */}
<div>
  <h2 className="text-lg font-semibold text-black mb-6">
    Tell Us About The Issue
  </h2>

  <div className="space-y-6">

    <select className="w-full border border-[#5F8EBA] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]">
      <option>Device Type</option>
      <option>Phone</option>
      <option>Tablet</option>
      <option>Laptop</option>
    </select>

    <input
      type="text"
      placeholder="Device Brand"
      className="w-full border rounded-md px-4 py-3 text-sm outline-none border-[#5F8EBA] focus:border-[#3e83c4]"
    />

    <input
      type="text"
      placeholder="Device Model"
      className="w-full border rounded-md px-4 py-3 text-sm outline-none border-[#5F8EBA] focus:border-[#3e83c4]"
    />

    <input
      type="text"
      placeholder="Location"
      className="w-full border rounded-md px-4 py-3 text-sm outline-none border-[#5F8EBA] focus:border-[#3e83c4]"
    />

    <select className="w-full border rounded-md px-4 py-3 text-sm outline-none border-[#5F8EBA] focus:border-[#3e83c4]">
      <option>Service Required</option>
      <option>Screen Replacement</option>
      <option>Battery Replacement</option>
      <option>Diagnostics</option>
    </select>

    {/* Upload */}
    <div>
      <p className="text-sm text-black mt-4 mb-4">
        Upload image of Damaged Device
      </p>

      <div className="border border-dashed border-gray-300 rounded-md p-12 text-center text-sm text-gray-400 cursor-pointer hover:border-blue-400 transition">
        <div className="flex flex-col items-center gap-4">
          
          <img src={upload} alt="" className="w-10 h-10 flex items-center justify-center rounded-full bg-[#B3B3B3]"/>
          <p>Click to upload or drag & drop</p>
          <p className="text-xs">PNG, JPG, JPEG up to 5MB</p>
        </div>
      </div>
    </div>

    {/* Issue Description */}
    <textarea
      placeholder="Issue Description"
      rows={4}
      className="w-full border border-[#5F8EBA] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4] resize-none"
    />

    {/* Additional Notes */}
    <input
      type="text"
      placeholder="Additional Notes"
      className="w-full border border-[#5F8EBA] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]"
    />

    {/* Continue Button */}
    <div className="pt-4">
      <button onClick={() => navigate("/booking-summary")} className="w-full md:w-48 mx-auto block bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md text-sm font-medium transition cursor-pointer">
        Continue
      </button>
    </div>

  </div>
</div>


          {/* RIGHT – ARTISAN CARD */}
         {/* <div className="bg-blue-50 rounded-xl p-4 h-fit"> */}
          {/* <div className="bg-blue-50 rounded-xl px-0.5 py-4 h-fit"> */}
            <div className="bg-[#EEF6FF] rounded-xl px-6 py-4 w-fit h-fit mx-auto">


  <div className="flex flex-col items-center text-center gap-2">
    

  <img
  src={profileImage}
  alt="artisan"
  className="w-[240px] aspect-square rounded-lg object-cover"
/>

    <div className="flex items-center gap-2 mt-2">
      <h3 className="font-semibold text-black">John Adewale</h3>
      <img src={mark} alt="verified" className="w-4 h-4" />
    </div>

    <p className="text-sm text-[#656565]">
      Electronics Technicians
    </p>

    {/* Rating */}
    <div className="flex items-center gap-1 mt-1 text-sm text-black">
      <img src={star} alt="star" className="w-4 h-4" />
      <span>4.7</span>
      <span className="text-black">(89 reviews)</span>
    </div>

    {/* Categories */}
    <div className="flex gap-2 mt-2">
      {["Phone", "Tablet", "Laptop"].map((item) => (
        <span
          key={item}
          className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs"
        >
          {item}
        </span>
      ))}
    </div>

    <div className="mt-2 text-sm text-[#656565] space-y-1">
      <p>
        Experience: <span className="font-medium text-black">5+ years</span>
      </p>
      <p>
        Location: <span className="font-medium text-black">Surulere, Lagos</span>
      </p>
    </div>

  </div>
</div>


        </div>
        </div>
      </section>
    </div>
  );
};

export default ClientBooking;
