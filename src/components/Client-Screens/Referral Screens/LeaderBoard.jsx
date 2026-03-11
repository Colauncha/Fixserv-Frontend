import React from "react";

import FirstPlace from "../../../assets/client images/client-home/referal part/1stplace.png";
import SecondPlace from "../../../assets/client images/client-home/referal part/2ndplace.png";
import ThirdPlace from "../../../assets/client images/client-home/referal part/3rdplace.png";

const data = [
  { rank: 1, name: "Ufoma Napoleon", referrals: 24, points: 2400, badge: "Top Referrer" },
  { rank: 2, name: "Lawal Hassan", referrals: 20, points: 2000, badge: "Consistent" },
  { rank: 3, name: "Praise Azobu", referrals: 16, points: 1800, badge: "Consistent", highlight: true },
  { rank: 4, name: "Tunde Hassan", referrals: 13, points: 1500, badge: "Rising star" },
  { rank: 5, name: "Shola Johnson", referrals: 12, points: 1200, badge: "Rising Star" },
  { rank: 6, name: "Janet Smith", referrals: 9, points: 700, badge: "Rising Star" },
];

const getBadgeStyle = (badge) => {
  if (badge === "Top Referrer") return "bg-blue-100 text-blue-600";
  if (badge === "Consistent") return "bg-indigo-100 text-indigo-600";
  return "bg-sky-100 text-sky-600";
};

const getMedal = (rank) => {
  if (rank === 1) return <img src={FirstPlace} className="w-4" alt="" />;
  if (rank === 2) return <img src={SecondPlace} className="w-4" alt="" />;
  if (rank === 3) return <img src={ThirdPlace} className="w-4" alt="" />;
  return null;
};

const LeaderBoard = () => {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
        Leader board
      </h3>
      <p className="text-sm text-gray-500">
        See who is topping Fixpoints this month
      </p>
      <p className="text-sm text-gray-500 mb-5">
        The more you refer, the higher you climb. Top users earn special bonuses
      </p>

      {/* Desktop Table */}
      <div className="border border-blue-100 rounded-xl overflow-hidden hidden md:block">
        <div className="grid grid-cols-5 bg-blue-50 px-5 py-3 text-sm text-gray-600">
          <span>Date</span>
          <span>Name</span>
          <span>Referrals</span>
          <span>Points</span>
          <span>Badge</span>
        </div>

        {data.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-5 px-5 py-4 text-sm border-t border-blue-100 items-center ${
              row.highlight ? "bg-[#3E83C4] text-white" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {getMedal(row.rank)}
              <span>{row.rank}</span>
            </div>

            <span className={row.highlight ? "font-semibold break-words" : "text-gray-700 break-words"}>
              {row.name}
            </span>

            <span>{row.referrals}</span>
            <span>{row.points.toLocaleString()}</span>

            <span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  row.highlight
                    ? "bg-white text-[#3E83C4]"
                    : getBadgeStyle(row.badge)
                }`}
              >
                {row.badge}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, i) => (
          <div
            key={i}
            className={`border rounded-xl p-4 ${
              row.highlight
                ? "bg-[#3E83C4] text-white border-[#3E83C4]"
                : "border-blue-100 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                {getMedal(row.rank)}
                <span className="text-sm font-medium">#{row.rank}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                  row.highlight
                    ? "bg-white text-[#3E83C4]"
                    : getBadgeStyle(row.badge)
                }`}
              >
                {row.badge}
              </span>
            </div>

            <p className={`font-semibold break-words ${row.highlight ? "text-white" : "text-gray-800"}`}>
              {row.name}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div>
                <p className={row.highlight ? "text-white/70 text-xs mb-1" : "text-gray-400 text-xs mb-1"}>
                  Referrals
                </p>
                <p>{row.referrals}</p>
              </div>

              <div>
                <p className={row.highlight ? "text-white/70 text-xs mb-1" : "text-gray-400 text-xs mb-1"}>
                  Points
                </p>
                <p>{row.points.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;