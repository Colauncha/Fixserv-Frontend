
import { useState, useEffect, useRef } from "react";
import { getIdentity } from "../../Auth/tokenStorage";
import { Bell, Globe, Folder, Menu, X, ExternalLink } from "lucide-react";
import CharProfilePic from "../CharProfilePic";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../assets/Loaders/Loader";

const DashboardNavbar = () => {
  const [userData, setUserData] = useState(null);
  const [isDashboard, setIsDashboard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState({ artisans: [], services: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef();
  const suggestionRef = useRef();

  useEffect(() => {
    const storedUser = getIdentity();
    setUserData(storedUser || null);
    setIsDashboard(location.pathname.includes("dashboard"));
  }, [location.pathname]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const keyword = searchTerm.trim();
      if (keyword.length > 0) {
        setLoading(true);
        setShowSuggestions(true);

        fetch(
          `${import.meta.env.VITE_API_SEARCH_URL}/search?keyword=${keyword}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => {
            // More flexible response handling
            let artisansList = [];
            let servicesList = [];

            if (data.success) {
              // Handle different possible response structures
              if (data.data?.artisans?.data) {
                artisansList = data.data.artisans.data;
              } else if (data.data?.artisans) {
                artisansList = data.data.artisans;
              } else if (data.artisans) {
                artisansList = data.artisans;
              }

              if (data.data?.services?.data) {
                servicesList = data.data.services.data;
              } else if (data.data?.services) {
                servicesList = data.data.services;
              } else if (data.services) {
                servicesList = data.services;
              }
            }

            setSuggestions({
              artisans: Array.isArray(artisansList) ? artisansList : [],
              services: Array.isArray(servicesList) ? servicesList : [],
            });
          })
          .catch((err) => {
            console.error('Search error:', err);
            setSuggestions({ artisans: [], services: [] });
          })
          .finally(() => setLoading(false));
      } else {
        setSuggestions({ artisans: [], services: [] });
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSuggestions && searchRef.current && !searchRef.current.contains(e.target)) {
        console.log(e.target, suggestionRef.current);
        console.log(suggestionRef.current.contains(e.target));
        setShowSuggestions(false);
      }
    };
  
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showSuggestions) {
        setShowSuggestions(false);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuggestions]);

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

  const handleNotify = () => {
    navigate("/notify");
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const renderSuggestions = () => (
  <div ref={suggestionRef} className="absolute top-14 w-full bg-white shadow-md rounded-lg border border-gray-200 z-50 max-h-64 overflow-auto">
    {loading && (
      <div className="flex items-center justify-center gap-3 text-sm text-center py-4 text-gray-500">
        Searching... <Loader size={'4'} otherStyles={"inline-block text-blue-500"} />
      </div>
    )}

    {suggestions.error ? (
      <div className="text-red-500 text-sm p-3">{suggestions.error}</div>
    ) : (
      <>
        <div className="p-3">
          <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">Artisans</h4>
          {suggestions.artisans.length > 0 ? (
            suggestions.artisans.map((artisan) => (
              <div
                key={artisan._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onMouseDown={() => {
                  setShowSuggestions(false);
                  setSearchTerm("");
                  navigate(`/client/selection?artisanId=${artisan._id || artisan.id}`);
                }}
              >
                👤 {artisan.fullName || "Unnamed"}{" "}
                <span className="text-gray-400 text-xs">({artisan.businessName || "Unnamed business"})</span>
              </div>
            ))
          ) : (
            !loading && <div className="text-gray-400 text-sm px-3 py-2">No artisans found</div>
          )}
        </div>

        <div className="border-t border-gray-100 p-3">
          <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">Services</h4>
          {suggestions.services.length > 0 ? (
            suggestions.services.map((service) => (
              <div
                key={service._id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setShowSuggestions(false);
                  setSearchTerm("");
                  navigate(`/client/selection?artisanId=${service.artisanId}&serviceId=${service._id}`);
                }}
              >
                🛠️ {service.title || "Untitled Service"}{" "}
                <span className="text-gray-400 text-xs">({service.description?.slice(0, 30)}...)</span>
              </div>
            ))
          ) : (
            !loading && <div className="text-gray-400 text-sm px-3 py-2">No services found</div>
          )}
        </div>

        <div className="border-t border-gray-100 p-3">
          <p
            className="relative group flex items-center justify-center gap-2 text-xs text-gray-500 cursor-pointer hover:underline transition-all duration-300"
            onClick={() => {
              setShowSuggestions(false);
              setSearchTerm("");
              navigate("/client/home");
            }}
          >
            <span>View all</span>
            <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-all duration-300" />
          </p>
        </div>
      </>
    )}
  </div>
);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#94B0F855] shadow-md">
      <nav className="flex flex-wrap items-center justify-between p-4">
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

        {/* Desktop Search */}
        <div
          ref={searchRef}
          className="relative hidden md:flex h-12 min-w-[300px] lg:min-w-[500px] shadow-lg bg-white border border-[#94b0f864] rounded-full items-center justify-between mt-4 md:mt-0 mx-auto"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Service Names, Categories or Location"
            className="flex-1 px-5 text-[#a5a5a5] outline-none rounded-l-full"
          />
          <button className="bg-[#94B0F8] w-24 h-12 text-white font-semibold rounded-r-full hover:bg-[#94B0F855] hover:text-gray-800 transition-colors duration-300">
            Enter
          </button>
          {showSuggestions && renderSuggestions()}
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div
            className="relative w-6 h-6 cursor-pointer"
            onClick={handlePublicListing}
            title={`${
              userData?.role === 'CLIENT' ? 'Find Artisans' : 'Find Jobs'
            }`}
          >
            <Globe className="text-[#00FF9D] w-6 h-6 relative" />
          </div>
          <div
            className="relative cursor-pointer"
            title="Notifications"
            onClick={handleNotify}
          >
            <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
            <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
          </div>
          {!isDashboard &&
            (userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                onClick={handleUserDashboard}
                title="Profile"
                alt={userData.fullName || 'User Profile'}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <CharProfilePic
                onClick={handleUserDashboard}
                size={'8'}
                username={userData?.fullName}
                otherStyles={`cursor-pointer`}
              />
            ))}
        </div>

        {/* Mobile Menu Search Part */}
        <div
          className={`w-full md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div
            ref={searchRef}
            className="relative mt-10 mb-10 h-12 shadow-md bg-white border border-[#94b0f864] rounded-full flex items-center"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services or location"
              className="flex-1 px-5 text-[#a5a5a5] outline-none rounded-l-full"
            />
            <button className="bg-[#94B0F8] w-24 h-12 text-white font-semibold rounded-r-full hover:bg-[#94B0F855] hover:text-gray-800 transition-colors duration-300">
              Enter
            </button>
            {showSuggestions && renderSuggestions()}
          </div>

          <div className="flex justify-end gap-10 items-center px-4 py-2 border-t border-[#eee]">
            <div
              className="relative w-6 h-6 cursor-pointer"
              onClick={handlePublicListing}
              title="View History"
            >
              <Globe className="text-[#00FF9D] w-6 h-6 relative" />
            </div>
            <div
              className="relative cursor-pointer"
              onClick={handleNotify}
              title="Notifications"
            >
              <Bell
                className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6"
                onClick={handleNotify}
              />
              <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
            </div>
            {!isDashboard &&
              (userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  onClick={handleUserDashboard}
                  title="Profile"
                  alt={userData.fullName || 'User Profile'}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <CharProfilePic
                  onClick={handleUserDashboard}
                  size={'8'}
                  username={userData?.fullName}
                  otherStyles={`cursor-pointer`}
                />
              ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
