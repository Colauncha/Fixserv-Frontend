import React from 'react';
import SearchLogo from '../assets/icons/search.png';

const Filter = () => {
  return (
    <div className="bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] w-full text-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center font-JejuMyeongjo">Explore</h2>

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 relative">
          <div className="flex items-center w-full relative">
            <img src={SearchLogo} alt="search" className="absolute left-4 w-5 h-5" />
            <input
              type="text"
              placeholder="Service Names, Service Categories or Location"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gradient-to-l from-[#7a9df7] to-[#7a9ed7] border border-[#656eebd0] text-white placeholder-white text-sm md:text-base outline-none"
            />
          </div>

          <button className="w-full sm:w-auto h-12 px-6 bg-white text-black font-semibold rounded-full hover:bg-[#E0E0E0] transition-colors duration-300">
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
