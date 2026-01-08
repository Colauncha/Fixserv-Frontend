
import React, { useState } from "react";

import mainBg from "../../../assets/client images/client-home/referal part/referalbg.png";
import overlayOne from "../../../assets/client images/client-home/referal part/referalbgoverlayone.png";
import overlayTwo from "../../../assets/client images/client-home/referal part/referalbgoverlaytwo.png";
import copy from "../../../assets/client images/client-home/referal part/copy.png";
import pana from "../../../assets/client images/client-home/referal part/pana.png";

import fixCoin from "../../../assets/client images/client-home/referal part/Fixcoin.png";
import users from "../../../assets/client images/client-home/referal part/ReferredUsers.png";
import point from "../../../assets/client images/client-home/referal part/MyFixpoints.png";
import board from "../../../assets/client images/client-home/referal part/LeaderBoard.png";
import task from "../../../assets/client images/client-home/referal part/Task.png";


import ReferredUsersPanel from "./ReferredUsersPanel";
import MyFixpointsPanel from "./MyFixpointsPanel";
import LeaderBoard from "./LeaderBoard";
import Task from "./Task";



const ReferalPage = () => {

    const [activeTab, setActiveTab] = useState("users");

      const allUsers = [
    ["Ufoma Napoleon", "uffynapoleon@gmail.com", "7-11-2025", "Successful"],
    ["Lawal Hassan", "Lawal123@gmail.com", "7-11-2025", "Pending"],
    ["John Adewale", "johnadewale@gmail.com", "7-10-2025", "Pending"],
    ["Tude Adesan", "tudeadesan@gmail.com", "7-09-2025", "Successful"],
    ["Natalie Kings", "natalieking@gmail.com", "7-08-2025", "Successful"],
    ["Shola Johnson", "sholajohnson@gmail.com", "7-07-2025", "Successful"],
    ["Janet Adetayo", "janetadetayo@gmail.com", "7-06-2025", "Successful"],
    ["Lawal Hassan", "lawaltest@gmail.com", "7-05-2025", "Pending"],
    ["Ufoma Napoleon", "ufomanew@gmail.com", "7-04-2025", "Successful"],
  ];

    const [sortOption, setSortOption] = useState("Newest");
    const [page, setPage] = useState(1);
    const itemsPerPage = 4;
  
    // Sort data
    const sortedUsers = [...allUsers].sort((a, b) => {
      const dateA = new Date(a[2]);
      const dateB = new Date(b[2]);
      return sortOption === "Newest" ? dateB - dateA : dateA - dateB;
    });
  
    // Pagination logic
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  
    const handleNext = () => {
      if (page < totalPages) setPage(page + 1);
    };
  
    const handlePageClick = (num) => {
      setPage(num);
    };
  
    const toggleSort = () => {
      setSortOption(sortOption === "Newest" ? "Oldest" : "Newest");
    };


  return (
    <div className="w-full bg-white">

  {/* HERO */}
  <section className="relative w-full h-[300px] bg-[#254B71] overflow-hidden">

    {/* Back */}
    <div className="max-w-7xl mx-auto px-2 md:px-6 relative z-20">
      <button className="absolute top-16 left-6 text-white text-sm flex items-center gap-1 cursor-pointer">
        ← Back
      </button>
    </div>

    {/* Background Layers */}
    <img src={mainBg} className="absolute inset-0 w-full h-full object-cover" />
    <img src={overlayOne} className="absolute inset-0 w-full h-full object-cover" />
    <img src={overlayTwo} className="absolute inset-0 w-full h-full object-cover" />

    {/* Centered Title */}
    <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4 mb-20">
      <h1 className="text-4xl font-semibold mb-2">Referrals</h1>
      <p className="text-sm text-blue-100 max-w-lg">
        Share your referral code to your friends and watch your fixpoint grow
      </p>
    </div>
  </section>

  {/* FLOATING CARD ZONE */}
  <section className="relative -mt-12 pb-20">
    <div className="max-w-7xl mx-auto px-2 md:px-6">

      {/* Outer Card */}
      <div className="bg-[#EFF7FF] rounded-2xl p-6 md:p-10 shadow-xl">

        {/* Inner Card */}
        <div className="bg-white rounded-xl px-8 py-10 flex items-center justify-between gap-10">

          {/* Left Content */}
          <div className="w-[65%]">

            {/* Referral Code */}
            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden h-[52px]">
              <span className="flex-1 px-5 text-sm text-gray-700">
                FX-PRAISE123
              </span>

              <button className="flex items-center gap-2 bg-gray-500 text-white px-6 h-full text-sm cursor-pointer">
                <img src={copy} className="w-4 h-4" />
                Copy Link
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Invite */}
            <p className="text-sm text-gray-700 mb-2">Invite your friends</p>

            <div className="flex bg-gray-100 rounded-lg overflow-hidden h-[52px]">
              <input
                placeholder="Enter email address"
                className="flex-1 px-5 text-sm bg-transparent outline-none"
              />

              <button className="bg-[#3E83C4] text-white px-10 h-full text-sm cursor-pointer">
                Send
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="w-[35%] flex justify-center">
            <img src={pana} className="w-[260px]" />
          </div>

        </div>
      </div>
    </div>
  </section>

  <section className="max-w-7xl mx-auto bg-white p-6 rounded-md">

  <div className="flex gap-8">

    {/* LEFT PANEL */}
    <div className="w-[380px] space-y-6">


{/* Referral Summary Container */}
<div className="border border-blue-300 rounded-2xl p-6 bg-blue-50 max-w-4xl">
  {/* Inner Card */}
    <h3 className="text-base font-semibold text-gray-800 mb-4">
      Referral Summary
    </h3>
  <div className="bg-white rounded-xl shadow-md px-6 py-4">

    <div className="space-y-3 text-sm ">
      {/* Row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-gray-600">
          <img src={fixCoin} alt="coin" className="w-5 h-5" />
          Total Fixpoints
        </span>
        <span className="font-semibold text-gray-900">
          850 pts
        </span>
      </div>

      <hr className="border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-gray-600">Equivalent values</span>
        <span className="font-semibold text-gray-900">₦1700.00</span>
      </div>

      <hr className="border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-gray-600">Referrals Completed</span>
        <span className="font-semibold text-gray-900">3</span>
      </div>

      <hr className="border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-gray-600">Next Reward Unlocks at</span>
        <span className="font-semibold text-gray-900">1000 pts</span>
      </div>
    </div>
  </div>
</div>

<div className="space-y-4">

  {[
    { id: "users", icon: users, title: "Referred Users", desc: "See all the users you have referred" },
    { id: "points", icon: point, title: "My Fixpoints", desc: "Track your earnings, bonuses and redemption" },
    { id: "board", icon: board, title: "Leader Board", desc: "View the top referrers" },
    { id: "tasks", icon: task, title: "Task & Bonuses", desc: "Earn more fixpoints" },
  ].map((item) => (
    <div
      key={item.id}
      onClick={() => setActiveTab(item.id)}
      className={`flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer transition relative
        ${activeTab === item.id ? "bg-blue-50" : "hover:bg-gray-50"}
      `}
    >
      {/* Blue Active Indicator */}
      {activeTab === item.id && (
        <div className="absolute left-0 top-2 bottom-2 w-2 bg-blue-500 rounded-full"></div>
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center
        ${activeTab === item.id ? "bg-blue-100" : "bg-blue-50"}
      `}>
        <img src={item.icon} className="w-5 h-5" />
      </div>

      {/* Text */}
      <div>
        <p className={`text-sm font-semibold 
          ${activeTab === item.id ? "text-gray-900" : "text-gray-800"}
        `}>
          {item.title}
        </p>
        <p className="text-xs text-gray-500">{item.desc}</p>
      </div>
    </div>
  ))}

</div>


    </div>


    <div className="flex-1">
  {activeTab === "users" && (
    <ReferredUsersPanel
      sortOption={sortOption}
      toggleSort={toggleSort}
      paginatedUsers={paginatedUsers}
      totalPages={totalPages}
      page={page}
      handlePageClick={handlePageClick}
      handleNext={handleNext}
    />
  )}

  {activeTab === "points" && <MyFixpointsPanel />}
  {activeTab === "board" && <LeaderBoard />}
  {activeTab === "tasks" && <Task />}
</div>



</div>

      </section>
</div>

  );
};
export default ReferalPage;