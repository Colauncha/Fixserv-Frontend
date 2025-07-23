import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIdentity } from '../../Auth/tokenStorage';
import useAuth from '../../Auth/useAuth';
import { Bell, Globe, Folder, UserCircleIcon } from "lucide-react";

const Navbar = ({bg, userIconFill}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { state } = useAuth();
  const [navLocation, setNavLocation] = useState('Home');
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const storedUser = getIdentity();

    const pathMap = {
      "/": "Home",
      "/about-us": "About",
      "/contact-us": "Contact"
    }

    setNavLocation(pathMap[path])

    if (storedUser) {
      setUserData(storedUser);
    }
  }, [path]);

  const handleUserDashboard = () => {
    if (userData.role === "CLIENT") {
      navigate("/client/dashboard");
    } else if (userData.role === "ARTISAN") {
      navigate("/artisans/dashboard");
    }
  };

  const handlePublicListing = () => {
    if (userData.role === "CLIENT") {
      navigate("/client/home");
    } else if (userData.role === "ARTISAN") {
      navigate("/artisans/home");
    }
  };

  const handleAuth = () => {
    navigate("/welcome");
  };
  
    return (
      <div className="w-full flex justify-between z-100"> 
      <nav className={`flex justify-between items-center pt-10 px-5 w-[100%] h-16 ${bg} rounded-md`}>
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
            className="hover:text-[#7A9DF7cc] transition-all duration-300 cursor-pointer relative group"
            onClick={() => navigate('/')}
          >
            Home
            <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 ${navLocation === 'Home' && 'scale-x-105'} transition-transform duration-300`} />
          </li>
          <li
            className="hover:text-[#7A9DF7cc] transition-all duration-300 cursor-pointer relative group"
            onClick={() => navigate('/about-us')}
          >
            About Us
            <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 ${navLocation === 'About' && 'scale-x-105'} transition-transform duration-300`} />
          </li>
          <li
            className="hover:text-[#7A9DF7cc] transition-all duration-300 cursor-pointer relative group"
            onClick={() => navigate('/contact-us')}
          >
            Contact Us
            <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 ${navLocation === 'Contact' && 'scale-x-105'} transition-transform duration-300`} />
          </li>
        </ul>

        {state.isAuthenticated && userData ?
          (<div className="flex items-center gap-8 mx-5">
            <div 
              className="relative w-6 h-6 cursor-pointer"
              onClick={handlePublicListing}
              title="Public Listing">
              <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
              <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
            </div>
    
            <div className="relative cursor-pointer" title="Notifications">
              <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
              <span className="absolute top-3 right-0 bg-[#00FF9D] w-4 h-4 rounded-full" />
            </div>

            <div className="relative cursor-pointer" title="Profile">
              <UserCircleIcon 
                className={`w-6 h-6 text-[#7A9DF7] cursor-pointer ${userIconFill || 'fill-[#ffffff]'}`}
                onClick={handleUserDashboard}
              />
            </div>
          </div>)
        : (<div  className="flex items-center space-x-2">
          <button
            onClick={handleAuth}
            className="bg-[#779BE7] hover:bg-[#779BE5dd] hover:shadow-gray-300 shadow-xl text-white px-4 py-1 h-10 w-44 text-md gap-20 rounded-xl cursor-pointer"
          >
            Get Started
          </button>
        </div>)}
      </nav>
      </div>
    );
  };
export default Navbar;  


