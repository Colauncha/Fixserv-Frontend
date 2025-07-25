import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogIn = () => {
    navigate('/auth/logIn');
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // close mobile menu
  };

  return (
    <header className="sticky top-0 bg-white z-50 shadow-sm">
      <nav className="w-full flex items-center justify-between px-5 py-4 rounded-md">
        {/* Logo & Toggle */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div
            className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            <span className="bg-[#779BE7] text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
              FS
            </span>
            <span>Fixserv</span>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <X className="w-6 h-6 text-[#7A9DF7]" />
              ) : (
                <Menu className="w-6 h-6 text-[#7A9DF7]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <ul
          className={`fixed top-16 left-0 w-full bg-white transition-transform duration-300 ease-in-out z-40 flex flex-col items-center space-y-6 py-6 text-[#7A9DF7] text-md font-medium md:static md:flex md:flex-row md:space-y-0 md:space-x-10 md:py-0 md:w-auto md:translate-x-0
          ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <li
            className="hover:text-[#7A9DF7cc] cursor-pointer relative group drop-shadow-lg transition-all duration-300"
            onClick={() => handleNavigate('/')}
          >
            Home
            {!menuOpen && <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 transition-transform duration-300`} />}
          </li>
          <li
            className="hover:text-[#7A9DF7cc] cursor-pointer relative group drop-shadow-lg transition-all duration-300"
            onClick={() => handleNavigate('/about-us')}
          >
            About Us
            {!menuOpen && <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 transition-transform duration-300`} />}
          </li>
          <li
            className="hover:text-[#7A9DF7cc] cursor-pointer relative group drop-shadow-lg transition-all duration-300"
            onClick={() => handleNavigate('/contact-us')}
          >
            Contact Us
            {!menuOpen && <span className={`absolute -bottom-0.5 left-0 w-full h-1 rounded-4xl bg-[#7A9DF7cc] scale-x-0 group-hover:scale-x-105 transition-transform duration-300`} />}
          </li>

          {/* Show button below links in mobile, inline in desktop */}
          <li className="block md:hidden">
            <button
              onClick={handleLogIn}
              className="bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out text-white px-6 py-2 rounded-xl"
            >
              Log In
            </button>
          </li>
        </ul>

        {/* Log In Button Desktop Only */}
        <div className="hidden md:block">
          <button
            onClick={handleLogIn}
            className="bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out text-white px-6 py-2 rounded-xl"
          >
            Log In
          </button>
        </div>
      </nav>
    </header>
  );
};

export default HomeNavbar;
