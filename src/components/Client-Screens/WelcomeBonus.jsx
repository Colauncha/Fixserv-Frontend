
import { useNavigate } from "react-router-dom";
import welcomeImg from "../../assets/client images/bonus.png";
import React, { useEffect, useState } from "react";

const WelcomeBonus = ({ onClose }) => {
  const navigate = useNavigate();
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
  const fetchFixPoints = async () => {
    try {
      const userId = localStorage.getItem("fixserv_user_id");
      const token = localStorage.getItem("fixserv_token");

      const res = await fetch(
        `https://wallet-service-seaj.onrender.com/api/wallet/fixpoints/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Find welcome bonus entry
      const welcomeBonus = data.history?.find(
        (item) => item.reason === "Welcome Bonus"
      );

      if (welcomeBonus) {
        setBonusPoints(welcomeBonus.amount);
      }
    } catch (err) {
      console.error("Failed to load FixPoints", err);
    }
  };

  fetchFixPoints();
}, []);

  

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Confetti / Icon */}
        <div className="flex justify-center mb-6">
          <img
            src={welcomeImg}
            alt="Welcome Bonus"
            className="w-88 h-42"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-black mb-2">
          Welcome to Fixserv!
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          You’ve just earned Fixpoints for signing up!
          <br />
          Earn up to 1,000 points to gain your reward
        </p>

        {/* Points */}
        {/* <p className="text-[#3E83C4] font-semibold text-lg mb-2">
          +200 points
        </p> */}
        <p className="text-[#3E83C4] font-semibold text-lg mb-2">
  +{bonusPoints} points
</p>


        <p className="text-xs text-gray-500 mb-6">
          Every Fixpoint brings you closer to rewards and exclusive benefits
        </p>

        {/* Claim Button */}
        <button
          onClick={() => {
            onClose();
            navigate("refer-earn");
          }}
          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-lg font-medium transition cursor-pointer"
        >
          Claim
        </button>
      </div>
    </div>
  );
};

export default WelcomeBonus;
