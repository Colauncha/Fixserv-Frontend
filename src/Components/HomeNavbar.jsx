import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeNavbar = () => {

    const navigate = useNavigate();

  const handleLogIn = () => {
    navigate("/LogIn");
  };

  
    return (
      <div className="flex justify-center"> 
      <nav className="flex justify-between items-center pt-6 px-10 w-[80%] h-16 max-w-7xl bg-white rounded-md">
        <div className="flex items-center space-x-6 text-xl font-JejuMyeongjo text-[#7A9DF7]">
          <span className="bg-[#779BE7] font-JejuMyeongjo text-white w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span>Fixserv</span>
        </div>
        <ul className="flex items-center space-x-6 text-md gap-20 text-[#7A9DF7]">
            <li className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/landing')}>Home</li>
          <li className="hover:text-blue-600 cursor-pointer">About Us</li>
          <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
        </ul>
        <button 
        onClick={handleLogIn}
        className="bg-[#779BE7] text-white px-4 py-1 h-10 w-44 text-md gap-20 rounded-lg">Log in</button>
      </nav>
      </div>
    );
  };
export default HomeNavbar;  


