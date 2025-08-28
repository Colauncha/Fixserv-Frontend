import { useState, useEffect } from "react";
import { getIdentity } from "../../Auth/tokenStorage";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Auth/useAuth";
import { ShieldUser } from "lucide-react";
import "./css/SlideAnimations.css";

const AdminDashboard = () => {
  const [showButton, setShowButton] = useState(false);
  const identity = getIdentity();
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (
        state.isAuthenticated &&
        window.scrollY > window.innerHeight &&
        identity.role === "ADMIN"
      ) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [identity, state]);

  return (
    <button
      onClick={() => navigate("/admin/dashboard")}
      aria-label="Admin button"
      className={`
        fixed bottom-20 right-6 z-40
        flex items-center justify-center
        w-12 h-12 rounded-full
        bg-gradient-to-br from-[#7A9DF7] to-[#7A9Dd7]
        border-2 border-gray-300
        text-gray-200 shadow-2xl
        hover:scale-110 hover:shadow-lg
        transition-all
        ${showButton ? "slide-up-delayed" : "slide-down-hastened"}
      `}
      title="Admin Dashboard"
    >
      <ShieldUser className="w-8 h-8" />
    </button>
  );
};

export default AdminDashboard;
