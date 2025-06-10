import React from "react";
import moreIcon from '../../assets/icons/more icon.png';
import searchIcon from '../../assets/icons/search.png'; 

const ClientNavbar = () => {
  return (
    <> 
    <nav className="bg-white shadow- px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between w-full">
      {/* Left: Logo and Brand */}
      <img src={moreIcon} alt="export" className="h-16 mt-2" />
      <div className="text-xl font-bold text-[#110000C2] mb-4 sm:mb-0">
        Welcome to Fixserv
      </div>

      {/* Center: Search Input */}
      <div className="w-full h-10 sm:w-1/2 mb-2 sm:mb-0 flex justify-center">
        <input
          type="text"
          placeholder="Service, Artisans or Location"
          className="w-full px-4 py-2  bg-[#94B0F8] rounded-full focus:outline-none"
        />
        <img src={searchIcon} alt="search" className="w-16 h-10 rounded-full" />
      </div>
      </div>
      </nav>

      {/*  Categories dropdowns bar */}
      <div className="flex items-center justify-center w-full gap-10 py-4 ">
      <div className="flex-wrap gap-8 bg-[#ECF1FC]">
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Television</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Refrigerator</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Gadgets</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Game Gadgets</option>
        </select>
      </div>
      </div>

      </>   
  );
};

export default ClientNavbar;
