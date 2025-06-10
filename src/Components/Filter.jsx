import React from 'react';
import SearchLogo from '../assets/icons/search.png'

const Filter = () => {
  return (
    <div className="bg-[#779BF7FA] w-full h-32 text-white px-30 flex flex-col gap-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4"></div>
        <h2 className="text-xl font-JejuMyeongjo">Explore</h2>

        <div className="flex h-12 mim-w-2xl bg-[#94B0F8] rounded-full py-2 items-center justify-center">
        <img src={SearchLogo} alt='search' className='h-7 w-14 pl-6' />
          <input
            type="text"
            placeholder="Service Names, Service Categories or Location"
            className="flex-1 outline-none h-4 pl-20 text-[#FFFFFF] bg-[#94B0F8] items-center justify-center"
          />         
          <button className="bg-[#FFFFFF] w-36 h-12 text-[#000000] font-semibold rounded-full ">
            Enter
          </button>
        </div>
      
    </div>
  );
};

export default Filter;

