import React from  'react';
import { Bell } from 'lucide-react';
import SearchLogo from '../../assets/icons/search.png'; 

const ArtisanNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-2 shadow-md bg-white w-full">
      
      <div className="flex items-center space-x-4">
        {/* Hamburger/more Icon */}
        <div className="flex flex-col justify-between w-12 h-8 cursor-pointer">
          <span className="h-1 bg-[#7A9DF7] rounded"></span>
          <span className="h-1 bg-[#7A9DF7] rounded"></span>
          <span className="h-1 bg-[#7A9DF7] rounded"></span>
        </div>

        {/* Welcome Text */}
        <h3 className="text-2xl font-light text-[#000000] pl-15">
          Welcome <br />
          <span className="text-2xl font-light">to Fixserv</span>
        </h3>
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center border border-[#7A9DF7] rounded-full overflow-hidden w-[750px] max-w-[90%]">
        <input
          type="text"
          placeholder="Available works"
          className="px-4 py-1 w-full outline-none text-[#110000C2]"
        />

       <button>
        <img src={SearchLogo} alt='search' className="bg-[#7A9DF7] p-3 px-10 rounded-full text-white cursor-pointer" />
         </button>
        {/* <button className="bg-[#7A9DF7] p-3 px-10 rounded-full text-white">
          🔍
        </button> */}
      </div>

      
      <div className="flex items-center space-x-8 px-12">
        {/* Bell with dot */}
        <div className="relative">
          <Bell className="text-[#7A9DF7] w-6 h-6" />
          <span className="absolute top-3 right-0 w-2 h-2 bg-[#05D283] rounded-full"></span>
        </div>

        {/* Avatar with letter */}
        <div className="bg-[#7A9DF7] text-[#110000C2] w-8 h-8 flex items-center justify-center rounded-full font-semibold">
          A
        </div>
      </div>
    </div>
  );
};

export default ArtisanNavbar;