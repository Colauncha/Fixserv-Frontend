import React, { useState } from "react";

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

const Task = () => {
  const [showModal, setShowModal] = useState(false);

  const tasks = [
    { icon: people, title: "Invite 1 Friend", points: "+150 pts", action: "Refer Now" },
    { icon: mark, title: "Complete Your Profile", points: "+100 pts", action: "Complete" },
    { icon: bitcoin, title: "Book a Repair", points: "+100 pts", action: "Book Repair" },
    { icon: star, title: "Give Feedback", points: "+50 pts", action: "Give feedback" },
  ];

  return (
    <>
      <div className="flex-1">

        <h3 className="text-xl font-semibold text-gray-900 mb-1">Earn More Fixpoints</h3>
        <p className="text-sm text-gray-500 mb-5">
          Complete simple tasks to boost your Fixpoints and unlock exclusive bonuses.
        </p>

        <div className="border border-blue-100 rounded-xl overflow-hidden">

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
              <img src={task.icon} className="w-5" />

              <span className="text-gray-700">{task.title}</span>

              <span className="text-gray-700">{task.points}</span>

              <span>
                <button
                  onClick={() => task.action === "Refer Now" && setShowModal(true)}
                  className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-xs hover:bg-blue-600 transition"
                >
                  {task.action}
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Blur Background */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-[520px] bg-white rounded-2xl shadow-xl p-6 z-10">

<div
  className="relative rounded-xl p-8 h-[210px] flex items-center mb-6 bg-cover bg-center border border-[#3E83C4]"
  style={{ backgroundImage: `url(${referBg})` }}
>

  {/* Close Button */}
  <button
    onClick={() => setShowModal(false)}
    className="absolute top-0.5 right-4 text-gray-500 hover:text-gray-700 w-7 h-7 flex items-center justify-center cursor-pointer"
  >
    ✕
  </button>

  {/* Content */}
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
  </div>

</div>



            <p className="text-sm font-medium mb-3">How it works:</p>

            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-3"><img src={flash} className="w-5" /> Share your invite link</div>
              <div className="flex items-center gap-3"><img src={crown} className="w-5" /> Your friends get 200 fixpoints when they signup</div>
              <div className="flex items-center gap-3"><img src={add} className="w-5" /> You receive 150 fixpoints for each referral</div>
            </div>

            <p className="text-sm mb-2">Your referral code:</p>

            <div className="flex mb-4">
              <input value="FX-PRAISE123" readOnly className="flex-1 bg-gray-100 px-4 py-2 rounded-l-md text-sm" />
              <button className="bg-blue-500 text-white px-5 rounded-r-md text-sm">Copy Code</button>
            </div>

            <div className="flex items-center gap-4 justify-center">
              <img src={fb} className="w-6" />
              <img src={insta} className="w-6" />
              <img src={linkedin} className="w-6" />
              <img src={twitter} className="w-6" />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Task;
