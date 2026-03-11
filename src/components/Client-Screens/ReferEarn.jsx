import React, { useEffect } from "react";
import referBg from "../../assets/client images/client-home/referal part/referbg.png";
import flash from "../../assets/client images/client-home/referal part/flash.png";
import crown from "../../assets/client images/client-home/referal part/crown.png";
import add from "../../assets/client images/client-home/referal part/add.png";
import fb from "../../assets/client images/client-home/referal part/fb.png";
import insta from "../../assets/client images/client-home/referal part/insta.png";
import linkedin from "../../assets/client images/client-home/referal part/linkedin.png";
import twitter from "../../assets/client images/client-home/referal part/x.png";
import toast from "react-hot-toast";

const ReferEarn = ({ onClose, referralCode }) => {
  const APP_URL = window.location.origin;

  const referralLink = referralCode
  ? `${APP_URL}/signup?ref=${encodeURIComponent(referralCode)}`
  : `${APP_URL}/signup`;

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

const copyText = async (text, message) => {
  if (!text) return;
  try {

await navigator.clipboard.writeText(text);
toast.success("Referral code copied!");
  } catch (e) {
    console.error("Copy failed:", e);
    alert("Copy failed. Please copy manually.");
  }
};

  const shareReferral = async () => {
    const shareData = {
      title: "Join Fixserv",
      text: "Sign up with my referral code and earn Fixpoints!",
      url: referralLink,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else copyText(referralLink, "Referral link copied!");
    } catch (err) {
      console.error("Share cancelled");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-[520px] bg-white rounded-2xl shadow-xl p-6 z-10">
        {/* Banner */}
        <div
          className="relative rounded-xl p-8 h-[210px] flex items-center mb-6 bg-cover bg-center border border-[#3E83C4]"
          style={{ backgroundImage: `url(${referBg})` }}
        >
          <button
            onClick={onClose}
            className="absolute top-1 right-4 text-gray-500 hover:text-gray-700 w-7 h-7 flex items-center justify-center"
            aria-label="Close"
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
              Invite friends to Fixserv and earn Fixpoints for every successful referral.
            </p>
          </div>
        </div>

      
        <p className="text-sm font-medium mb-3">How it works:</p>
        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-3"><img src={flash} alt="flash" className="w-5" /> Share your invite link</div>
          <div className="flex items-center gap-3"><img src={crown} alt="crown" className="w-5" /> Friends earn Fixpoints when they sign up</div>
          <div className="flex items-center gap-3"><img src={add} alt="add" className="w-5" /> You receive Fixpoints for each referral</div>
        </div>

       
        <p className="text-sm mb-2">Your referral code:</p>
        <div className="flex mb-3">
          <input value={referralCode || ""} readOnly className="flex-1 bg-gray-100 px-4 py-2 rounded-l-md text-sm" />
          <button onClick={() => copyText(referralCode, "Referral code copied!")} className="bg-blue-500 text-white px-5 rounded-r-md text-sm">Copy Code</button>
        </div>

       
        <div className="flex mb-5">
          <input value={referralLink} readOnly className="flex-1 bg-gray-100 px-4 py-2 rounded-l-md text-sm" />
          <button onClick={() => copyText(referralLink, "Referral link copied!")} className="bg-gray-800 text-white px-5 rounded-r-md text-sm">Copy Link</button>
        </div>

   
        <div className="flex items-center gap-5 justify-center">
          {[fb, insta, linkedin, twitter].map((icon, i) => (
            <img key={i} src={icon} onClick={shareReferral} className="w-6 cursor-pointer" alt="share" />
          ))}
        </div>
      </div>
    </div>
  );
};


export default ReferEarn;
