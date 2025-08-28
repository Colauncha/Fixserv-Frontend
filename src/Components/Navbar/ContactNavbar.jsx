import {useEffect, useState} from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Bell, Globe, Folder, UserCircleIcon } from "lucide-react";

const ContactNavbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("userData");

    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleUserDashboard = () => {
    if (userData.role === "CLIENT") {
      navigate("/client/profile");
    } else if (userData.role === "ARTISAN") {
      navigate("/artisans/dashboard");
    }
  };

  const handleAuth = () => {
    navigate("/welcome");
  };
  
    return (
      <div className="w-full flex justify-between z-100"> 
      <nav className="flex justify-between items-center pt-10 px-5 w-[100%] h-28 bg-[#D8E3FC] rounded-md">
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

        {userData ?
          (<div className="flex items-center gap-8 mx-5">
            <div 
              className="relative w-6 h-6 cursor-pointer"
              onClick={() => {}}
              title="Public Listing">
              <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
              <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
            </div>
    
            <div 
            className="relative cursor-pointer"
            onClick={() => navigate('/notify')} 
            title="Notifications">
              <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
              <span className="absolute top-3 right-0 bg-[#00FF9D] w-4 h-4 rounded-full" />
            </div>

            <div className="relative cursor-pointer" title="Profile">
              <UserCircleIcon 
                className="w-6 h-6 text-[#7A9DF7] fill-[#ffffff] cursor-pointer"
                onClick={handleUserDashboard}
              />
            </div>
          </div>)
        : (<div  className="flex items-center space-x-2">
          <button
            onClick={handleAuth}
            className="bg-[#779BE7] text-white px-4 py-1 h-10 w-44 text-md gap-20 rounded-xl cursor-pointer"
          >
            Get Started
          </button>
        </div>)}
      </nav>
      </div>
    );
  };
export default ContactNavbar;  


