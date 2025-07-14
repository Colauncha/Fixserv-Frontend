import React from "react";
import { Bell, Globe, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const navigate = useNavigate();

  const goToArtisanHome = () => {
    navigate("/artisan-home");
  };

  return (
    <nav className="flex items-center justify-between border-b-1 border-[#94B0F855] shadow bg-white p-5">
      {/* Left side: Logo and Name */}
      <div className="flex items-center space-x-2">
        <div
          className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="bg-[#779BE7] font-JejuMyeongjo text-white w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span>Fixserv</span>
        </div>
      </div>

      <div className="flex h-12 min-w-2xl bg-[#FFFFFF] border-1 border-[#94B0F8] rounded-full py-2 items-center justify-center">
        <input
          type="text"
          placeholder="Service Names, Service Categories or Location"
          className="flex-1 outline-none h-4 px-5 text-[#a5a5a5] items-center justify-center"
        />         
        <button className="bg-[#94B0F8] w-24 h-12 text-[#ffffff] font-semibold rounded-r-full cursor-pointer hover:bg-[#94B0F855] hover:text-gray-800 transition-colors duration-300">
          Enter
        </button>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-8 mx-5">
        <div 
          className="relative w-6 h-6 cursor-pointer"
          onClick={goToArtisanHome}
          title="View History">

          <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
          <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
        </div>

        <div className="relative cursor-pointer" title="Notifications">
          <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
          <span className="absolute top-3 right-0 bg-[#00FF9D] w-4 h-4 rounded-full" />
        </div> 
      </div>

    </nav>
  );
};

export default DashboardNavbar;


