import React, { useEffect, useState } from "react";
import referBg from "../../assets/client images/client-home/referal part/referbg.png";
import flash from "../../assets/client images/client-home/referal part/flash.png";
import crown from "../../assets/client images/client-home/referal part/crown.png";
import add from "../../assets/client images/client-home/referal part/add.png";
import fb from "../../assets/client images/client-home/referal part/fb.png";
import insta from "../../assets/client images/client-home/referal part/insta.png";
import linkedin from "../../assets/client images/client-home/referal part/linkedin.png";
import twitter from "../../assets/client images/client-home/referal part/x.png";
import walletIcon from "../../assets/client images/client-home/wallet.png";
import coin from "../../assets/client images/client-home/coin.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const fetchUserData = async (userId) => {
 
  const res = await fetch(`/api/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user data");
  return res.json();
};

const Dashboard = ({ onClose }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (authUser?.id) {
          const latestUser = await fetchUserData(authUser.id);
          setUser(latestUser);
        }
      } catch (err) {
        console.error("Failed to update user data:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [authUser]);

  const fixpoints = user?.fixpoints || 0;
  const wallet = user?.wallet || { balance: 0, lockedBalance: 0 };


  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="flex flex-col items-center gap-6">

      <div className="bg-[#F6FBFF] border border-[#3e83c4] rounded-xl p-5 w-[320px]">
        <div className="flex items-center gap-2 mb-4">
          <img src={walletIcon} alt="" className="w-5 h-5" />
          <h3 className="font-semibold text-sm text-black">Wallet</h3>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 space-y-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#535353]">Balance</span>
              <span className="font-medium text-black">
                ₦{Number(wallet.balance).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#535353]">Locked Balance</span>
              <span className="font-medium text-black">
                ₦{Number(wallet.lockedBalance).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-[#535353] flex items-center gap-1">
              <img src={coin} alt="" className="w-4 h-4" />
              Fixpoints
            </span>

            <div className="text-right">
              <p className="font-medium text-black">{fixpoints} pts</p>
              <p className="text-xs text-[#535353]">
                ₦{(fixpoints * 2).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="fixed inset-0 z-50 flex items-center justify-center">

        
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

      
        <div className="relative w-[520px] bg-white rounded-2xl shadow-xl p-6 z-10 animate-fadeIn">

          
          <div
            className="relative rounded-xl p-8 h-[210px] flex items-center mb-6 bg-cover bg-center border border-[#3E83C4]"
            style={{ backgroundImage: `url(${referBg})` }}
          >

           
            <button
              onClick={onClose}
              className="absolute top-1 right-4 text-gray-500 hover:text-gray-700 w-7 h-7 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div>
              <p className="text-xs bg-white/90 inline-block px-3 py-1 rounded-full mb-2">
                Earn 150+ fixpoints
              </p>

              <h3 className="text-xl font-semibold text-gray-900">
                Share & Earn Fixpoints
              </h3>

              <p className="text-sm text-gray-600 max-w-[300px] mt-2">
                Invite your friends to join Fixserv and earn 150 Fixpoints for each successful referral.
              </p>

              <p className="text-sm mt-2 font-medium">
                Current Fixpoints: {fixpoints} pts
              </p>
            </div>
          </div>

          <p className="text-sm font-medium mb-3">How it works:</p>

          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-3">
              <img src={flash} className="w-5" />
              Share your invite link
            </div>
            <div className="flex items-center gap-3">
              <img src={crown} className="w-5" />
              Your friends get 200 fixpoints when they signup
            </div>
            <div className="flex items-center gap-3">
              <img src={add} className="w-5" />
              You receive 150 fixpoints for each referral
            </div>
          </div>

          <p className="text-sm mb-2">Your referral code:</p>

          <div className="flex mb-4">
            <input
              value={user?.referralCode || ""}
              readOnly
              className="flex-1 bg-gray-100 px-4 py-2 rounded-l-md text-sm"
            />
            <button
              onClick={() => {
                if (!user?.referralCode) return;
                navigator.clipboard.writeText(user.referralCode);
                alert("Referral code copied!");
              }}
              className="bg-blue-500 text-white px-5 rounded-r-md text-sm"
            >
              Copy Code
            </button>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <img src={fb} className="w-6 cursor-pointer" />
            <img src={insta} className="w-6 cursor-pointer" />
            <img src={linkedin} className="w-6 cursor-pointer" />
            <img src={twitter} className="w-6 cursor-pointer" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
