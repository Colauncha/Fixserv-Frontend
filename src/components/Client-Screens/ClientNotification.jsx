// import React, { useEffect, useState } from "react";
// // import settings from "../../assets/client images/settings.png";
// import cancel from "../../assets/client images/cancel--v3.png";


// const data = {
//   All: [
//     { title: "Your service request has been received.", desc: "We will notify you once your request has been accepted", unread: true },
//     { title: "Payment successful.", desc: "₦12,000 has been charged for your phone repair service.", unread: true },
//     { title: "New update available.", desc: "Enjoy faster bookings and improved tracking performance.", unread: true },
//     { title: "Get 10% off your next service.", desc: "Use code FIX10 on any home repair this month.", unread: true },
//     { title: "Pro Tip: Book early to avoid surge pricing", desc: "Evening slots fill up fast", unread: false },
//     { title: "Your service request has been received.", desc: "We will notify you once your request has been accepted", unread: false },
//   ],
//   Bookings: [{ title: "Booking confirmed.", desc: "Your technician will arrive soon.", unread: false }],
//   Payments: [{ title: "Payment successful.", desc: "₦12,000 charged successfully.", unread: false }],
//   System: [{ title: "System maintenance scheduled.", desc: "Expect brief downtime tomorrow.", unread: false }],
// };

// const ClientNotification = ({ onClose }) => {
//   const [activeTab, setActiveTab] = useState("All");
//   const [showNotifications, setShowNotifications] = useState(false);

// {showNotifications && (
//   <ClientNotification onClose={() => setShowNotifications(false)} />
// )}


// // Close on ESC
// useEffect(() => {
//   const handler = (e) => {
//     if (e.key === "Escape") {
//       onClose();
//     }
//   };

//   window.addEventListener("keydown", handler);
//   return () => window.removeEventListener("keydown", handler);
// }, [onClose]);


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">

//       {/* Overlay */}
//       <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

//       {/* Modal */}
//       <div className="relative w-[360px] bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">

//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-3 border-blue-200 border-b">
//           <h3 className="text-sm font-semibold">Notifications</h3>
//           <img src={cancel} className="w-4 h-4 cursor-pointer" />
//           {/* <img src={settings} className="w-4 h-4 cursor-pointer" /> */}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 px-4 py-2 text-sm border-blue-200 border-b">
//           {["All", "Bookings", "Payments", "System"].map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex cursor-pointer items-center gap-1 pb-1 transition ${
//                 activeTab === tab ? "text-blue-600 font-medium border-b-2 border-blue-600" : "text-gray-500"
//               }`}
//             >
//               {tab}
//               {tab === "All" && <span className="bg-blue-100 text-blue-600 text-xs px-1.5 rounded">12</span>}
//               {tab === "Bookings" && <span className="bg-gray-100 text-gray-600 text-xs px-1.5 rounded">2</span>}
//             </button>
//           ))}
//         </div>

//         {/* List */}
//         <div className="max-h-[420px] overflow-y-auto">
//           {data[activeTab].map((item, i) => (
//             <div key={i} className="px-4 py-3 border-blue-200 border-b last:border-b-0 hover:bg-gray-50 transition">

//               <div className="flex justify-between gap-2">
//                 <div>
//                   <p className="text-sm font-medium flex items-center gap-1">
//                     {item.title}
//                     {item.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
//                   </p>
//                   <p className="text-xs text-gray-500 mt-1 leading-relaxed">
//                     {item.desc}
//                   </p>
//                 </div>

//                 <span className="text-xs text-gray-400 whitespace-nowrap">7:25 AM</span>
//               </div>

//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ClientNotification;



import React, { useEffect, useState } from "react";

import cancel from "../../assets/client images/cancel--v3.png";
import { useNavigate } from "react-router-dom";







const ClientNotification = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("All");

  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();




const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");


// Close on ESC
useEffect(() => {
  const handler = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [onClose]);

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("fixserv_token"); // if required

      const res = await fetch(
        "https://notifications-service-9dn1.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`, // remove if not required
          },
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Failed to fetch notifications");
      }

      setNotifications(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchNotifications();
}, []);

const filteredNotifications =
  activeTab === "All"
    ? notifications
    : notifications.filter((n) => n.type === activeTab.toUpperCase());

const unreadCount = notifications.filter(n => !n.readAt).length;

useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative w-[360px] bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-blue-200 border-b">
          <h3 className="text-sm font-semibold">Notifications</h3>
     <img
  src={cancel}
  onClick={() => navigate(-1)}
  className="w-4 h-4 cursor-pointer"
/>



          {/* <img src={settings} className="w-4 h-4 cursor-pointer" /> */}
        </div>

        {/* Tabs */}
      <div className="flex gap-4 px-4 py-2 text-sm border-blue-200 border-b">
  {["All", "Bookings", "Payments", "System"].map((tab) => {
    const count =
      tab === "All"
        ? notifications.length
        : notifications.filter(
            (n) => n.type === tab.toUpperCase()
          ).length;

    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex cursor-pointer items-center gap-1 pb-1 transition ${
          activeTab === tab
            ? "text-blue-600 font-medium border-b-2 border-blue-600"
            : "text-gray-500"
        }`}
      >
        {tab}
        {count > 0 && (
          <span className="bg-blue-100 text-blue-600 text-xs px-1.5 rounded">
            {count}
          </span>
        )}
      </button>
    );
  })}
</div>

        {/* List */}
        <div className="max-h-[420px] overflow-y-auto">
  {loading ? (
    <p className="p-4 text-sm text-gray-500">Loading...</p>
  ) : error ? (
    <p className="p-4 text-sm text-red-500">{error}</p>
  ) : filteredNotifications.length === 0 ? (
    <p className="p-4 text-sm text-gray-500">No notifications</p>
  ) : (
    filteredNotifications.map((item) => (
      <div
        key={item.id || item._id}
        className="px-4 py-3 border-blue-200 border-b last:border-b-0 hover:bg-gray-50 transition"
      >
        <div className="flex justify-between gap-2">
          <div>
            <p className="text-sm font-medium flex items-center gap-1">
              {item.title}
              {!item.readAt && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {item.message}
            </p>
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString()
              : ""}
          </span>
        </div>
      </div>
    ))
  )}
</div>


      </div>
    </div>
  );
};

export default ClientNotification;
