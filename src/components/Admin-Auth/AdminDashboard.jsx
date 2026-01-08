import React from "react";
import exportImg from "../../assets/Admin Images/export.png";
import annouce from "../../assets/Admin Images/annouce.png";
import people from "../../assets/Admin Images/people.png";

const AdminDashboard = () => {
  return (
    <div className="w-full">

      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex justify-between items-start mb-8">

            <div>
              <h1 className="text-2xl font-semibold text-black">
                Dashboard
              </h1>
              <p className="text-sm text-[#6B6B6B] mt-1">
                Overview of marketplace performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-300 text-sm px-4 py-2 rounded-md hover:bg-gray-50">
                <img src={exportImg} className="w-4 h-4" />
                Export CSV
              </button>

              <button className="flex items-center gap-2 bg-[#3E83C4] text-white text-sm px-4 py-2 rounded-md hover:opacity-90">
                <img src={annouce} className="w-4 h-4" />
                Create Announcement
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

            {[
              { title: "Total Users", value: "12,543", note: "+12% from last month" },
              { title: "Active Artisans", value: "1,247", note: "+8% from last month" },
              { title: "New Signups (7d)", value: "89", note: "+24% from prev week" },
              { title: "GMV (30d)", value: "₦24,700", note: "+15% from last month" },
              { title: "Transactions Today", value: "342", note: "-3% from yesterday", danger: true },
              { title: "Open Disputes", value: "12", note: "2 new today" },
            ].map((card, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 bg-white"
              >

                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-[#6B6B6B]">{card.title}</p>
                  <img src={people} className="w-6 h-6" />
                </div>

                <p className="text-lg font-semibold text-black mb-1">
                  {card.value}
                </p>

                <p className={`text-xs ${card.danger ? "text-red-500" : "text-[#3E83C4]"}`}>
                  {card.note}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

            <section className="w-full py-10">
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

<div className="bg-white border border-gray-200 rounded-xl p-6">
  <h3 className="text-sm font-medium text-black mb-4">
    Revenue Trend (30 days)
  </h3>

  <div className="flex h-[220px]">

    {/* Y Axis */}
    <div className="flex flex-col justify-between text-xs text-gray-400 pr-4">
      <span>6000</span>
      <span>4500</span>
      <span>3000</span>
      <span>1500</span>
      <span>0</span>
    </div>

    {/* Chart Area */}
    <div className="flex-1 flex flex-col justify-between">
      {/* Empty graph space */}
      <div className="flex-1 border-l border-b border-gray-200"></div>

      {/* X Axis */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Day 1</span>
        <span>Day 7</span>
        <span>Day 14</span>
        <span>Day 21</span>
        <span>Day 30</span>
      </div>
    </div>

  </div>
</div>

<div className="bg-white border border-gray-200 rounded-xl p-6">
  <h3 className="text-sm font-medium text-black mb-4">
    Transaction Volume (7 days)
  </h3>

  <div className="flex h-[220px]">

    {/* Y Axis */}
    <div className="flex flex-col justify-between text-xs text-gray-400 pr-4">
      <span>120</span>
      <span>90</span>
      <span>60</span>
      <span>30</span>
      <span>0</span>
    </div>

    {/* Chart Area */}
    <div className="flex-1 flex flex-col justify-between">

      {/* Bars Row */}
      <div className="flex-1 flex items-end justify-between gap-5 border-l border-b border-gray-200 px-2">

        {[
          { day: "Mon", value: 60 },
          { day: "Tue", value: 80 },
          { day: "Wed", value: 95 },
          { day: "Thu", value: 75 },
          { day: "Fri", value: 130 },
          { day: "Sat", value: 120 },
          { day: "Sun", value: 100 },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center flex-1">

            {/* Bar */}
            <div className="relative h-[180px] w-8 flex items-end">
              <div className="absolute bottom-0 w-full h-full bg-gray-200 rounded-md"></div>

              <div
                className="relative w-full bg-[#3E83C4] rounded-md"
                style={{ height: `${item.value}px` }}
              ></div>
            </div>

          </div>
        ))}
      </div>

      {/* X Axis */}
      <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
          <span key={d}>{d}</span>
        ))}
      </div>

    </div>
  </div>
</div>




    </div>

  </div>
</section>

<section className="w-full py-10">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT: Top 10 Artisans */}
      <div className="lg:col-span-2 bg-white border border-gray-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">
            Top 10 Artisans by Sales
          </h3>
        </div>

        {/* Rows */}
        {[
          { name: "Sarah Moses", role: "Pottery", amount: "₦12,450", rating: "4.9" },
          { name: "Marcus Ike", role: "Woodwork", amount: "₦10,230", rating: "4.8" },
          { name: "Amara Okafor", role: "Textiles", amount: "₦9,870", rating: "4.7" },
          { name: "Elena Udoh", role: "Jewelry", amount: "₦8,650", rating: "4.6" },
          { name: "Biliki Kareem", role: "Ceramics", amount: "₦7,920", rating: "3.9" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                {i + 1}
              </span>

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.role}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {item.amount}
              </p>
              <p className="text-xs text-gray-400">
                ★ {item.rating}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Recent Activity */}
      <div className="bg-white border border-gray-200">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">
            Recent Activity
          </h3>
        </div>

        {/* Rows */}
        {[
          { name: "John Doe", action: "Purchased handmade vase", time: "2 min ago", amount: "₦85,000" },
          { name: "Jane Smith", action: "Left 5-star review", time: "5 min ago" },
          { name: "Mike Johnson", action: "New artisan signup", time: "12 min ago" },
          { name: "Emily Brown", action: "Dispute opened", time: "18 min ago", amount: "₦60,000" },
          { name: "David James", action: "Purchased custom furniture", time: "25 min ago", amount: "₦60,000" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex justify-between px-6 py-4 border-b border-gray-200 last:border-b-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.action}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {item.time}
              </p>
            </div>

            {item.amount && (
              <p className="text-sm font-medium text-gray-900">
                {item.amount}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  </div>
</section>





    </div>
  );
};

export default AdminDashboard;
