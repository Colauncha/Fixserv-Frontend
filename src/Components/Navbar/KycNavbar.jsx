import { useState, useEffect } from "react";
import { getIdentity } from "../../Auth/tokenStorage";
import { UserCircleIcon, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const KycNavbar = () => {
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
    <header className="sticky top-0 z-50 bg-white">
      <nav className="flex flex-wrap items-center justify-between p-4 px-20">
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

        {/* Right Side Icons */}
        {/* <div className="hidden md:flex items-center gap-8">
          {!isDashboard && (
            <UserCircleIcon
              className="w-6 h-6 text-[#7A9DF7] cursor-pointer fill-white"
              onClick={handleUserDashboard}
              title="Profile"
            />
          )}
        </div> */}

        {/* Mobile Slide-in Menu */}
        <div className={`w-full md:hidden transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Icons Mobile */}
          <div className="flex justify-end gap-10 items-center px-4 py-2 border-t border-[#eee]">
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

export default KycNavbar;
