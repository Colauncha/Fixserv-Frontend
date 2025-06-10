import React from 'react'
import searchIcon from '../../assets/icons/search.png' 

const SelectionNavbar = () => {
  return (
    <div>
        <nav>
            <div className="flex items-center space-x-6 text-xl font-JejuMyeongjo text-[#7A9DF7]">
          <span className="bg-[#779BE7] font-JejuMyeongjo text-white w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span>Fixserv</span>
        </div>

         <div className="w-full h-10 sm:w-1/2 mb-2 sm:mb-0 flex justify-center">
                <input
                  type="text"
                  placeholder="Service, Artisans or Location"
                  className="w-full px-4 py-2  bg-[#ffff] rounded-full focus:outline-none"
                />
                <img src={searchIcon} alt="search" className="w-16 h-10 bg-[#7A9DF7] rounded-full" />
              </div>
        </nav>
      
    </div>
  )
}

export default SelectionNavbar
