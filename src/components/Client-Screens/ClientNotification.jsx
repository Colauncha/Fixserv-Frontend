import React from "react";
import settings from "../../assets/client images/settings.png";

const ClientNotification = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BLUR OVERLAY */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* MODAL */}
      <div className="relative w-[360px] bg-white rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            Notifications
          </h3>
          <img src={settings} alt="settings" className="w-4 h-4 cursor-pointer" />
        </div>

        {/* TABS */}
        <div className="flex gap-4 px-4 py-2 text-sm border-b">
          <span className="font-medium text-blue-600 cursor-pointer">
            All <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded ml-1">12</span>
          </span>
          <span className="text-gray-500 cursor-pointer">
            Bookings <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded ml-1">2</span>
          </span>
          <span className="text-gray-500 cursor-pointer">Payments</span>
          <span className="text-gray-500 cursor-pointer">System</span>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="max-h-[420px] overflow-y-auto">

          {[
            {
              title: "Your service request has been received.",
              desc: "We will notify you once your request has been accepted",
            },
            {
              title: "Payment successful.",
              desc: "₦12,000 has been charged for your phone repair service.",
            },
            {
              title: "New update available.",
              desc: "Enjoy faster bookings and improved tracking performance.",
            },
            {
              title: "Get 10% off your next service.",
              desc: "Use code FIX10 on any home repair this month.",
            },
            {
              title: "Pro Tip: Book early to avoid surge pricing",
              desc: "Evening slots fill up fast",
            },
            {
              title: "Your service request has been received.",
              desc: "We will notify you once your request has been accepted",
            },
          ].map((item, index) => (
            <div key={index} className="px-4 py-3 border-b last:border-b-0">
              
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    {item.title}
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.desc}
                  </p>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  7:25 AM
                </span>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default ClientNotification;
