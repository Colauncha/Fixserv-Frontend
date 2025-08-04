
import { useState, useEffect, useRef } from "react";
import { getIdentity } from "../../Auth/tokenStorage";
import { Bell, Globe, Folder, Menu, X } from "lucide-react";
import CharProfilePic from "../CharProfilePic";
import { useNavigate, useLocation } from "react-router-dom";

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

  useEffect(() => {
    const storedUser = getIdentity();
    setUserData(storedUser || null);
    setIsDashboard(location.pathname.includes("dashboard"));
  }, [location.pathname]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     const keyword = searchTerm.trim();
  //     if (keyword.length > 0) {
  //       setLoading(true);
  //       setShowSuggestions(true);

  //       fetch(`https://search-and-discovery.onrender.com/api/search?keyword=${keyword}&isAvailableNow=true`)
  //         .then(res => res.json())
  //         .then(data => {
  //           if (data.success) {
  //             setSuggestions({
  //               artisans: data.data.artisans?.data || [],
  //               services: data.data.services?.data || []
  //             });
  //           } else {
  //             setSuggestions({ artisans: [], services: [] });
  //           }
  //         })
  //         .catch(err => {
  //           console.error("Search error:", err);
  //           setSuggestions({ artisans: [], services: [] });
  //         })
  //         .finally(() => setLoading(false));
  //     } else {
  //       setShowSuggestions(false);
  //     }
  //   }, 300);

  //   return () => clearTimeout(delayDebounce);
  // }, [searchTerm]);

  // Click outside dropdown
  
  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    const keyword = searchTerm.trim();
    if (keyword.length > 0) {
      setLoading(true);
      setShowSuggestions(true);

      fetch(`https://search-and-discovery.onrender.com/api/search?keyword=${keyword}`)  // Removed isAvailableNow=true
        .then(res => res.json())
        .then(data => {
          console.log("Search API response:", data);  // Debug response
          
          if (data.success && data.data) {
            const artisansList = data.data.artisans?.data || [];
            const servicesList = data.data.services?.data || [];

            // Sanity check on data existence
            setSuggestions({
              artisans: artisansList,
              services: servicesList
            });
          } else {
            console.warn("Unexpected data structure:", data);
            setSuggestions({ artisans: [], services: [] });
          }
        })
        .catch(err => {
          console.error("Search error:", err);
          setSuggestions({ artisans: [], services: [] });
        })
        .finally(() => setLoading(false));
    } else {
      setShowSuggestions(false);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const toggleMenu = () => setMenuOpen(prev => !prev);

  const renderSuggestions = () => (
    <div className="absolute top-14 w-full bg-white shadow-md rounded-lg border border-gray-200 z-50 max-h-64 overflow-auto">
      {loading && (
        <div className="text-sm text-center py-4 text-gray-500">Searching...</div>
      )}

      <div className="p-2">
        <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">Artisans</h4>
        {suggestions.artisans.length > 0 ? (
          suggestions.artisans.map((artisan) => (
            <div
              key={artisan._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                navigate(`/artisan/${artisan._id}`);
                setShowSuggestions(false);
              }}
            >
              👤 {artisan.fullName || artisan.businessName || "Unnamed"}{" "}
              <span className="text-gray-400 text-xs">({artisan.category || "No category"})</span>
            </div>
          ))
        ) : (
          !loading && <div className="text-gray-400 text-sm px-3 py-2">No artisans found</div>
        )}
      </div>

      <div className="border-t border-gray-100 p-2">
        <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">Services</h4>
        {suggestions.services.length > 0 ? (
          suggestions.services.map((service) => (
            <div
              key={service._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                navigate(`/service/${service._id}`);
                setShowSuggestions(false);
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
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#94B0F855] shadow-md">
      <nav className="flex flex-wrap items-center justify-between p-4">
        {/* Logo */}
        <div className="flex justify-between items-center w-full md:w-auto">
          <div
            className="flex items-center space-x-2 text-xl font-JejuMyeongjo text-[#7A9DF7] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="bg-[#779BE7] text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold">FS</span>
            <span>Fixserv</span>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {menuOpen ? <X className="w-6 h-6 text-[#7A9DF7]" /> : <Menu className="w-6 h-6 text-[#7A9DF7]" />}
          </button>
        </div>

        {/* Desktop Search */}
        <div ref={searchRef} className="relative hidden md:flex h-12 min-w-[300px] lg:min-w-[500px] shadow-lg bg-white border border-[#94b0f864] rounded-full items-center justify-between mt-4 md:mt-0 mx-auto">
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
        <div className="hidden md:flex items-center gap-8">
          <div className="relative w-6 h-6 cursor-pointer" onClick={handlePublicListing} title="View History">
            <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
            <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
          </div>
          <div className="relative cursor-pointer" title="Notifications">
            <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
            <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
          </div>
          {!isDashboard && (
            userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                onClick={handleUserDashboard}
                title="Profile"
                alt={userData.fullName || "User Profile"}
                className="w-8 h-8 rounded-full object-cover cursor-pointer"
              />
            ) : (
              <CharProfilePic onClick={handleUserDashboard} size={'8'} username={userData?.fullName} otherStyles={`cursor-pointer`} />
            )
          )}
        </div>

        {/* Mobile Menu + Search */}
        <div className={`w-full md:hidden transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div ref={searchRef} className="relative mt-10 mb-10 h-12 shadow-md bg-white border border-[#94b0f864] rounded-full flex items-center">
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
            <div className="relative w-6 h-6 cursor-pointer" onClick={handlePublicListing} title="View History">
              <Folder className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6 absolute" />
              <Globe className="text-[#00FF9D] w-4 h-4 absolute top-3 left-4" />
            </div>
            <div className="relative cursor-pointer" title="Notifications">
              <Bell className="text-[#7A9DF7] fill-[#7A9DF7] w-6 h-6" />
              <span className="absolute top-3 right-0 bg-[#00FF9D] w-3 h-3 rounded-full" />
            </div>
            {!isDashboard && (
              userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  onClick={handleUserDashboard}
                  title="Profile"
                  alt={userData.fullName || "User Profile"}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer"
                />
              ) : (
                <CharProfilePic onClick={handleUserDashboard} size={'8'} username={userData?.fullName} otherStyles={`cursor-pointer`} />
              )
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
