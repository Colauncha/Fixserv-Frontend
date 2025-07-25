import { useState, useEffect } from "react";
import { getIdentity } from "../../Auth/tokenStorage";
import { Bell, Globe, Folder, UserCircleIcon, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardNavbar = () => {
  const [userData, setUserData] = useState(null);
  const [isDashboard, setIsDashboard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = getIdentity();

    if (storedUser) {
      setUserData(storedUser);
    }

    if (location.pathname.includes("dashboard")) {
      setIsDashboard(true);
    }
  }, [location]);

  const handlePublicListing = () => {
    if (userData?.role === "CLIENT") {
      navigate("/client/home");
    } else if (userData?.role === "ARTISAN") {
      navigate("/artisans/home");
    }
  };

  const handleUserDashboard = () => {
    if (userData?.role === "CLIENT") {
      navigate("/client/dashboard");
    } else if (userData?.role === "ARTISAN") {
      navigate("/artisans/dashboard");
    }
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#94B0F855] shadow-md">
      <nav className="flex flex-wrap items-center justify-between p-4">
        {/* Logo and mobile menu toggle */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div
            className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="bg-[#779BE7] text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">
              FS
            </span>
            <span>Fixserv</span>
          </div>

          <button className="md:hidden" onClick={toggleMenu}>
            {menuOpen ? (
              <X className="w-6 h-6 text-[#7A9DF7]" />
            ) : (
              <Menu className="w-6 h-6 text-[#7A9DF7]" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex h-12 min-w-[300px] lg:min-w-[500px] shadow-lg bg-white border border-[#94b0f864] rounded-full items-center justify-between mt-4 md:mt-0 mx-auto">
          <input
            type="text"
            placeholder="Service Names, Categories or Location"
            className="flex-1 px-5 text-[#a5a5a5] outline-none rounded-l-full"
          />
          <button className="bg-[#94B0F8] w-24 h-12 text-white font-semibold rounded-r-full hover:bg-[#94B0F855] hover:text-gray-800 transition-colors duration-300">
            Enter
          </button>
        </div>

        {/* Right Side Icons */}
        <div className="hidden md:flex items-center gap-8">
          <div
            className="relative w-6 h-6 cursor-pointer"
            onClick={handlePublicListing}
            title="View History"
          >
            <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
            <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
          </div>

          <div className="relative cursor-pointer" title="Notifications">
            <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
            <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
          </div>

          {!isDashboard && (
            <UserCircleIcon
              className="w-6 h-6 text-[#7A9DF7] cursor-pointer fill-white"
              onClick={handleUserDashboard}
              title="Profile"
            />
          )}
        </div>

        {/* Mobile Slide-in Menu */}
        <div className={`w-full md:hidden transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Search Bar Mobile */}
          <div className="mt-10 mb-10 h-12 shadow-md bg-white border border-[#94b0f864] rounded-full flex items-center">
            <input
              type="text"
              placeholder="Search services or location"
              className="flex-1 px-5 text-[#a5a5a5] outline-none rounded-l-full"
            />
            <button className="bg-[#94B0F8] w-24 h-12 text-white font-semibold rounded-r-full hover:bg-[#94B0F855] hover:text-gray-800 transition-colors duration-300">
              Enter
            </button>
          </div>

          {/* Icons Mobile */}
          <div className="flex justify-end gap-10 items-center px-4 py-2 border-t border-[#eee]">
            <div
              className="relative w-6 h-6 cursor-pointer"
              onClick={handlePublicListing}
              title="View History"
            >
              <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
              <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
            </div>

            <div className="relative cursor-pointer" title="Notifications">
              <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
              <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
            </div>

            {!isDashboard && (
              <UserCircleIcon
                className="w-6 h-6 text-[#7A9DF7] cursor-pointer fill-white"
                onClick={handleUserDashboard}
                title="Profile"
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
