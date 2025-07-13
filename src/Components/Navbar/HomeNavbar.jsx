import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeNavbar = () => {

  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate("/auth/logIn");
  };

  
    return (
      <div className="w-full flex justify-between z-50"> 
      <nav className="flex justify-between items-center pt-10 px-5 w-[100%] h-16 bg-white rounded-md">
        <div
          className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="bg-[#779BE7] font-JejuMyeongjo text-white w-15 h-15 items-center 
           justify-center flex rounded-lg">FS</span>
          <span>Fixserv</span>
        </div>
        <ul className="flex items-center space-x-4 text-md gap-10 text-[#7A9DF7]">
            <li
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => navigate('/')}
            >
              Home
            </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/about-us')}
          >
            About Us
          </li>
          <li
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => navigate('/contact-us')}
          >
            Contact Us
          </li>
        </ul>
        <button 
        onClick={handleLogIn}
        className="bg-[#779BE7] text-white px-4 py-1 h-10 w-44 text-md gap-20 rounded-lg cursor-pointer">Log in</button>
      </nav>
      </div>
    );
  };
export default HomeNavbar;  


