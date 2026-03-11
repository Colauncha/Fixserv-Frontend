import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import people from "../../../assets/client images/client-home/referal part/people.png";
import mark from "../../../assets/client images/client-home/referal part/mark.png";
import bitcoin from "../../../assets/client images/client-home/referal part/bitcoin.png";
import star from "../../../assets/client images/client-home/referal part/star.png";

import referBg from "../../../assets/client images/client-home/referal part/referbg.png";
import flash from "../../../assets/client images/client-home/referal part/flash.png";
import crown from "../../../assets/client images/client-home/referal part/crown.png";
import add from "../../../assets/client images/client-home/referal part/add.png";
import fb from "../../../assets/client images/client-home/referal part/fb.png";
import insta from "../../../assets/client images/client-home/referal part/insta.png";
import linkedin from "../../../assets/client images/client-home/referal part/linkedin.png";
import twitter from "../../../assets/client images/client-home/referal part/x.png";

const Task = ({ referralCode }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

  const referralLink = referralCode
    ? `${APP_URL}/signup?ref=${encodeURIComponent(referralCode)}`
    : `${APP_URL}/signup`;

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Fixserv Referral",
          text: `Use my Fixserv referral code: ${referralCode}`,
          url: referralLink,
        });
      } else {
        await handleCopy(referralLink);
      }
    } catch (e) {
      await handleCopy(referralLink);
    }
  };

  const tasks = [
    { icon: people, title: "Invite 1 Friend", points: "+150 pts", action: "refer", label: "Refer Now" },
    { icon: mark, title: "Complete Your Profile", points: "+100 pts", action: "settings", label: "Complete Now" },
    { icon: bitcoin, title: "Book a Repair", points: "+100 pts", action: "repair", label: "Book Repair" },
    { icon: star, title: "Give Feedback", points: "+50 pts", action: "feedback", label: "Give Feedback" },
  ];

  const handleAction = (action) => {
    switch (action) {
      case "refer":
        setShowModal(true);
        break;

      case "settings":
        navigate("/client/settings");
        break;

      case "repair":
        navigate("/client/request-repair");
        break;

      case "feedback":
        navigate("/client/feedback");
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
          Earn More Fixpoints
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          Complete simple tasks to boost your Fixpoints and unlock exclusive bonuses.
        </p>

        {/* Desktop Table */}
        <div className="border border-blue-100 rounded-xl overflow-hidden hidden md:block">
          <div className="grid grid-cols-[40px_1fr_120px_150px] bg-blue-50 px-5 py-3 text-sm text-gray-600">
            <span></span>
            <span>Task</span>
            <span>Points</span>
            <span>Badge</span>
          </div>

          {tasks.map((task, i) => (
            <div
              key={i}
              className="grid grid-cols-[40px_1fr_120px_150px] px-5 py-4 text-sm border-t border-blue-100 items-center"
            >
              <img src={task.icon} className="w-5" alt="" />

              <span className="text-gray-700 break-words">{task.title}</span>

              <span className="text-gray-700">{task.points}</span>

              <span>
                <button
                  onClick={() => handleAction(task.action)}
                  className="bg-[#3E83C4] text-white px-6 py-1.5 rounded-full text-xs hover:bg-[#2A6BA0] transition cursor-pointer"
                >
                  {task.label}
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
  {tasks.map((task, i) => (
    <div key={i} className="border border-blue-100 rounded-xl p-4">
      
      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <img src={task.icon} className="w-5 h-5 mt-0.5 shrink-0" alt="" />
          <p className="text-sm font-medium text-gray-800">
            {task.title}
          </p>
        </div>

        <span className="text-sm text-gray-500 shrink-0">
          {task.points}
        </span>
      </div>

      {/* Button */}
      <button
        onClick={() => handleAction(task.action)}
        className="mt-3 bg-[#3E83C4] text-white px-4 py-2 rounded-full text-xs hover:bg-[#2A6BA0] transition cursor-pointer w-full"
      >
        {task.label}
      </button>

    </div>
  ))}
</div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="md:hidden space-y-4">
  {tasks.map((task, i) => (
    <div key={i} className="border border-blue-100 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <img src={task.icon} className="w-5 h-5 mt-0.5 shrink-0" alt="" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-gray-800 break-words">
              {task.title}
            </p>

            <span className="text-sm text-gray-500 shrink-0">
              {task.points}
            </span>
          </div>

          <button
            onClick={() => handleAction(task.action)}
            className="mt-3 bg-[#3E83C4] text-white px-4 py-2 rounded-full text-xs hover:bg-[#2A6BA0] transition cursor-pointer w-full sm:w-auto"
          >
            {task.label}
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
      )}
    </>
  );
};

export default Task;