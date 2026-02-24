import { NavLink } from "react-router-dom";
import logo from "../../assets/Artisan Images/fixserv.png";
import dashboard from "../../assets/Artisan Images/dashboard.png";
import job from "../../assets/Artisan Images/jobs.png";
import noti from "../../assets/Artisan Images/notification.png";
import wallet from "../../assets/Artisan Images/wallet.png";
import profile from "../../assets/Artisan Images/profile.png";
import veri from "../../assets/Artisan Images/verification.png";
import setting from "../../assets/Artisan Images/settings.png";
import help from "../../assets/Artisan Images/help.png";
import dark from "../../assets/Artisan Images/dark.png";
import adebayoImg from "../../assets/Artisan Images/adebayo.png";
import log from "../../assets/Artisan Images/log.png";
import { useAuth } from "../../context/AuthContext";

const ArtisanSidebar = () => {

  const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-6 py-2 text-sm transition ${
    isActive
      ? "bg-[#C9DDF2] text-[#2563EB] border-r-4 border-[#2563EB]"
      : "text-gray-600 hover:bg-gray-100"
  }`;

  const { logout } = useAuth();
  
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-blue-100 flex flex-col justify-between">

      <div>
        <div className="flex justify-center py-8">
          <img src={logo} className="h-12 cursor-pointer" />
        </div>

        {/* Main */}
        <p className="px-6 text-xs text-black-600 mb-2">Main</p>

        <nav className="space-y-1">
          <NavLink to="/artisan" end className={navClass}>
            <img src={dashboard} className="w-4" />
            Dashboard
          </NavLink>

          <NavLink to="/artisan/jobs" className={navClass}>
            <img src={job} className="w-4" />
            Jobs
          </NavLink>

          <NavLink to="/artisan/notification" className={navClass}>
            <img src={noti} className="w-4" />
            Notification
          </NavLink>

          <NavLink to="/artisan/wallet" className={navClass}>
            <img src={wallet} className="w-4" />
            Wallet
          </NavLink>

          <NavLink to="/artisan/profile" className={navClass}>
            <img src={profile} className="w-4" />
            Profile
          </NavLink>

          <NavLink to="/artisan/verification" className={navClass}>
            <img src={veri} className="w-4" />
            Verification
          </NavLink>
        </nav>

         {/* Divider */}
        <div className="my-6 border-t border-blue-100"></div>

        {/* Support */}
        <p className="px-6 text-xs text-gray-400 mt-6 mb-2">Support</p>

        <nav className="space-y-1">
          <NavLink to="/artisan/settings" className={navClass}>
            <img src={setting} className="w-4" />
            Settings
          </NavLink>

          <NavLink to="/artisan/help" className={navClass}>
            <img src={help} className="w-4" />
            Help
          </NavLink>

          <button className="flex items-center gap-3 px-6 py-2 text-sm text-gray-600 hover:bg-gray-100 w-full">
            <img src={dark} className="w-4" />
            Dark mode
          </button>
        </nav>
      </div>

      {/* User Card */}
      <div className="px-4 py-4">
        <div className="bg-[#3E83C4] text-white rounded-lg p-3 flex items-center gap-3">
          <img src={adebayoImg} className="w-9 h-9 rounded-full" />
          <div className="text-xs">
            <p className="font-semibold">Adebayo. O</p>
            <p className="opacity-80">Active</p>
          </div>
        </div>

        <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 mt-4 px-2">
          <img src={log} className="w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default ArtisanSidebar;
