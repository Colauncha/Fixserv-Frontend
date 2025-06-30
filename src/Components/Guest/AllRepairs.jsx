// import React, { useEffect, useState } from "react";
// import { useUser } from "../../context/UserContent";

// const AllRepairs = () => {
//   const { firstName, time, location } = useUser();

//   const userName = firstName || "Unknown User";
//   const userTime = time || "Some time ago";
//   const userLocation = location || "Some location";

//   const newRepair = {
//     name: userName,
//     time: userTime,
//     type: "Refrigerator repair",
//     location: userLocation,
//     duration: "2 weeks",
//     price: "30 thousand naira",
//     status: "Booked",
//   };

//   const [repairs, setRepairs] = useState([]);

//   useEffect(() => {
    
//     const savedRepairs = JSON.parse(localStorage.getItem("repairs")) || [];


//     const isDuplicate = savedRepairs.some(
//       (repair) =>
//         repair.name === newRepair.name &&
//         repair.time === newRepair.time &&
//         repair.location === newRepair.location
//     );

    
//     const updatedRepairs = isDuplicate
//       ? savedRepairs
//       : [newRepair, ...savedRepairs];

//     localStorage.setItem("repairs", JSON.stringify(updatedRepairs));
//     setRepairs(updatedRepairs);
//   }, [userName, userTime, userLocation]);

//   return (
//     <div className="max-w-5xl mx-auto p-2 font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <button className="bg-[#7A9DF75C] text-[#110000C2] font-medium px-4 py-1 rounded shadow-sm">
//           All Repairs
//         </button>
//         <button className="text-[#110000C2] font-medium px-4 py-1 border border-gray-300 rounded">
//           Incoming Repair
//         </button>
//       </div>

//       {repairs.map((repair, index) => (
//         <div
//           key={index}
//           className="bg-white border border-blue-100 rounded-lg p-4 mb-6"
//         >
//           <div className="flex justify-between items-start mb-2 border-b border-blue-100 pb-3">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-[#7A9DF7] text-[#110000C2] font-bold text-lg flex items-center justify-center">
//                 {repair.name.charAt(0)}
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <p className="font-semibold">{repair.name}</p>
//                 <span className="text-sm text-gray-400">{repair.time}</span>
//               </div>
//             </div>

//             <div className="text-sm font-semibold text-gray-500">
//               {repair.status}
//             </div>
//           </div>

//           <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
//             <div className="space-y-1">
//               <p>
//                 <span className="font-medium">Repair Type:</span>{" "}
//                 {repair.type}
//               </p>
//               <p>
//                 <span className="font-medium">Location:</span>{" "}
//                 {repair.location}
//               </p>
//             </div>
//             <div className="space-y-1 text-right">
//               <p>
//                 <span className="font-medium">Duration:</span>{" "}
//                 {repair.duration}
//               </p>
//               <p>
//                 <span className="font-medium">Price:</span> {repair.price}
//               </p>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AllRepairs;



import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContent";

const AllRepairs = () => {
  const { firstName, time, location } = useUser();
  const userName = firstName || "Unknown User";
  const userTime = time || "Some time ago";
  const userLocation = location || "Some location";

  const newRepair = {
    name: userName,
    time: userTime,
    type: "Refrigerator repair",
    location: userLocation,
    duration: "2 weeks",
    price: "30 thousand naira",
    status: "Booked",
  };

  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    const savedRepairs = JSON.parse(localStorage.getItem("repairs")) || [];

    const isDuplicate = savedRepairs.some(
      (repair) =>
        repair.name === newRepair.name &&
        repair.time === newRepair.time &&
        repair.location === newRepair.location
    );

    const updatedRepairs = isDuplicate
      ? savedRepairs
      : [newRepair, ...savedRepairs];

    localStorage.setItem("repairs", JSON.stringify(updatedRepairs));
    setRepairs(updatedRepairs);
  }, [userName, userTime, userLocation]);

  // 🗑️ Delete Function
  const handleDelete = (indexToRemove) => {
    const updated = repairs.filter((_, index) => index !== indexToRemove);
    setRepairs(updated);
    localStorage.setItem("repairs", JSON.stringify(updated));
  };

  return (
    <div className="max-w-5xl mx-auto p-2 font-sans">
      <div className="flex justify-between items-center mb-6">
        <button className="bg-[#7A9DF75C] text-[#110000C2] font-medium px-4 py-1 rounded shadow-sm">
          All Repairs
        </button>
        <button className="text-[#110000C2] font-medium px-4 py-1 border border-gray-300 rounded">
          Incoming Repair
        </button>
      </div>

      {repairs.map((repair, index) => (
        <div
          key={index}
          className="bg-white border border-blue-100 rounded-lg p-4 mb-6 relative"
        >
          {/* 🗑️ Delete Button */}
          <button
            onClick={() => handleDelete(index)}
            className="absolute top-3 right-3 text-red-600 bg-red-100 hover:bg-red-200 transition-colors px-3 py-1 text-xs font-semibold rounded cursor-pointer shadow-sm"
          >
            <span role="img" aria-label="trash">🗑️</span> Delete
          </button>

          {/* 🔧 Status below Delete Button */}
          <p className="absolute top-12 right-3 text-[13px] text-blue-600 font-medium">
            {repair.status || "Pending"}
          </p>

          <div className="flex justify-between items-start mb-2 border-b border-blue-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A9DF7] text-[#110000C2] font-bold text-lg flex items-center justify-center">
                {repair.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{repair.name}</p>
                <span className="text-sm text-gray-400">{repair.time}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
            <div className="space-y-1">
              <p>
                <span className="font-medium">Repair Type:</span> {repair.type}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {repair.location}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {repair.duration}
              </p>
              <p>
                <span className="font-medium">Price:</span> {repair.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRepairs;
