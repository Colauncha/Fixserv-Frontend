import React from "react";
import { Bell, Globe, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";


const DashboardNavbar = () => {
  const navigate = useNavigate();

  const goToArtisanHome = () => {
    navigate("/artisan-home");
  };

  return (
    <nav className="flex items-center justify-between bg-white px-5 py-8">
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

      {/* Right side: Icons */}
      <div className="flex items-center space-x-4">
        <div 
          className="relative w-11 h-11 cursor-pointer"
          onClick={goToArtisanHome}
          title="View History">

          <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-10 h-10 absolute" />
          <Globe className="text-[#00FF9D] w-8 h-8 absolute top-3 left-4" />
        </div>

        <div className="relative">
          <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-10 h-10" />
          <span className="absolute top-3 right-0 bg-[#00FF9D] w-4 h-4 rounded-full" />
        </div> 
      </div>

    </nav>
  );
};

export default DashboardNavbar;


