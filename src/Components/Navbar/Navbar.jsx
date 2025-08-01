import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getIdentity } from '../../Auth/tokenStorage';
import useAuth from '../../Auth/useAuth';
import { Bell, Globe, Folder, UserCircleIcon, Menu, X } from "lucide-react";
import CharProfilePic from '../CharProfilePic';

const Navbar = ({ bg, userIconFill }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { state } = useAuth();
  const [navLocation, setNavLocation] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [showNavbar, setShowNavbar] = useState(false); // For slide-in animation

  useEffect(() => {
    const storedUser = getIdentity();

    const pathMap = {
      "/": "Home",
      "/about-us": "About",
      "/contact-us": "Contact",
    };

    setNavLocation(pathMap[path]);
    if (storedUser) setUserData(storedUser);

    // Trigger slide-in
    setTimeout(() => {
      setShowNavbar(true);
    }, 50);
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

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={`w-full z-50 sticky top-0 bg-white shadow-md transition-all duration-500 ease-in-out transform ${showNavbar ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
      <nav className={`flex flex-col md:flex-row justify-between items-center ${bg} px-5 py-4 md:h-16 rounded-md`}>
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div
            className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="bg-[#779BE7] text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">FS</span>
            <span>Fixserv</span>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? <X className="w-6 h-6 text-[#7A9DF7]" /> : <Menu className="w-6 h-6 text-[#7A9DF7]" />}
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <ul className={`flex-col md:flex-row md:flex md:items-center gap-6 text-md text-[#7A9DF7] mt-4 md:mt-0 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
          {['Home', 'About Us', 'Contact Us'].map((label) => {
            const route = label === 'Home' ? '/' : `/${label.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <li
                key={label}
                onClick={() => {
                  setMenuOpen(false);
                  navigate(route);
                }}
                className="hover:text-[#7A9DF7cc] drop-shadow-lg transition-all duration-300 cursor-pointer relative group"
              >
                {label}
                {!menuOpen && (
                  <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 ${navLocation === label.split(' ')[0] && 'scale-x-10 rounded-2xl'} transition-transform duration-300`} />
                )}
              </li>
            );
          })}
        </ul>

        {/* Auth Section */}
        <div className={`flex-col md:flex-row md:flex md:items-center gap-4 mt-4 md:mt-0 ${menuOpen ? 'flex' : 'hidden'} md:flex`}>
          {state.isAuthenticated && userData ? (
            <div className={`flex items-center gap-6 ${menuOpen && 'mt-5'}`}>
              <div
                className="relative w-6 h-6 cursor-pointer"
                onClick={handlePublicListing}
                title="Public Listing"
              >
                <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
                <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
              </div>

              <div className="relative cursor-pointer" title="Notifications">
                <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
                <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
              </div>

              <div className="relative cursor-pointer" title="Profile">
                {userData?.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    onClick={handleUserDashboard}
                    title="Profile"
                    alt={userData.fullName || "User Profile"}
                    className="w-8 h-8 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <CharProfilePic onClick={handleUserDashboard} size={'8'} username={userData?.fullName} otherStyles={`cursor-pointer shadow-color-${userIconFill}`} />
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleAuth();
              }}
              className={`bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out text-white px-4 py-2 rounded-xl text-md ${menuOpen && 'mt-5'}`}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
