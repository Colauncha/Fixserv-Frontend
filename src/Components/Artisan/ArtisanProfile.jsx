// import React from 'react';

// const ArtisanProfile = ({ artisan }) => {
//   return (
//     <div className="flex flex-col w-full lg:flex-row justify-center items-start max-w-6xl mx-auto bg-gray-50">
      
//       {/* Profile Section */}
//       <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-md p-6">
//         <img
//           src={artisan?.photo}
//           alt={artisan?.name}
//           className="w-32 h-32 rounded-full object-cover mx-auto"
//         />
//         <h2 className="text-2xl font-semibold text-center mt-4">{artisan?.name}</h2>
//         <p className="text-center text-[#110000C2]">{artisan?.location}</p>
//         <p className="text-center mt-2 text-[#110000C2]">⭐ {artisan?.rating} ({artisan?.reviews} reviews)</p>

//         {/* Availability toggle */}
//         <div className="mt-4 flex justify-center">
//           <span className={`px-4 py-1 rounded-full text-white ${artisan?.available ? 'bg-[#ECF1FC]' : 'bg-[#A1B7F2]'}`}>
//             {artisan?.available ? 'Available' : 'Unavailable'}
//           </span>
//         </div>

//       {/* Details Section */}
//       <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md p-6">
//         <h3 className="text-xl font-semibold mb-2">About Me</h3>
//         <p className="text-gray-600 mb-4">{artisan?.about}</p>

//         {/* Skills */}
//         <div className="mt-6">
//           <h4 className="font-bold text-gray-700">Skills</h4>
//           <p className="text-gray-600">{artisan?.skills.join(', ')}</p>
//         </div>
//         <button className="mt-6 w-full bg-[#7A9DF7] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
//           <span className="text-#110000C2 hover:underline mt-4 block text-center">Edit Profile</span>
//         </button>
//       </div>

//         <h3 className="text-xl font-semibold mb-2 text-[#110000C2]">Contact Info</h3>
//         <div className='text-[#000000]'> 
//         <p><strong>Phone:</strong> {artisan?.phone}</p>
//         <p><strong>Email:</strong> {artisan?.email}</p>
//         <p><strong>Address:</strong> {artisan?.address}</p>
//         <p><strong>Available Work Locations:</strong> {artisan?.availableLocations}</p>
//         </div>

//             <h3 className="text-xl font-semibold mt-6 mb-2 text-[#000000]">Works</h3>
//         <div className="space-y-4">
//           {artisan?.works.map((work, idx) => (
//             <div key={idx} className="border border-[#7A9DF75C] rounded-lg p-4">
//               <p><strong>Client:</strong> {work?.client}</p>
//               <p><strong>Repair Type:</strong> {work?.repairType}</p>
//               <p><strong>Location:</strong> {work?.location}</p>
//               <p><strong>Duration:</strong> {work?.duration}</p>
//               <p><strong>Price:</strong> {work?.price}</p>
//               <p className="text-sm italic text-[#11000080]">{work?.status}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArtisanProfile;


import React from 'react';

const ArtisanProfile = ({ artisan }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-100 p-6 lg:p-10 gap-8 justify-center">
      
      {/* Profile Section (Left Panel) */}
      <div className="w-full lg:w-[30%] bg-white shadow-md rounded-xl p-6 space-y-4">
        <img
          src={artisan?.photo}
          alt={artisan?.name}
          className="w-32 h-32 rounded-full object-cover mx-auto"
        />
        <h2 className="text-2xl font-semibold text-center">{artisan?.name}</h2>
        <p className="text-center text-[#110000C2]">{artisan?.location}</p>
        <p className="text-center mt-2 text-[#110000C2]">
          ⭐ {artisan?.rating} ({artisan?.reviews} reviews)
        </p>

        {/* Availability Toggle */}
        <div className="flex justify-center mt-4">
          <span className={`px-4 py-1 rounded-full text-white ${artisan?.available ? 'bg-blue-500' : 'bg-gray-400'}`}>
            {artisan?.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Details Section (Right Panel) */}
      <div className="w-full lg:w-[65%] bg-white shadow-md rounded-xl p-6 space-y-6">
        
        {/* About Me */}
        <div>
          <h3 className="text-xl font-semibold mb-1 text-[#110000C2]">About Me</h3>
          <p className="text-gray-700">{artisan?.about}</p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-xl font-semibold mb-1 text-[#110000C2]">Skills</h3>
          <p className="text-gray-700">{artisan?.skills.join(', ')}</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-1 text-[#110000C2]">Contact Info</h3>
          <div className="text-gray-800 space-y-1">
            <p><strong>Phone:</strong> {artisan?.phone}</p>
            <p><strong>Email:</strong> {artisan?.email}</p>
            <p><strong>Address:</strong> {artisan?.address}</p>
            <p><strong>Available Work Locations:</strong> {artisan?.availableLocations}</p>
          </div>
        </div>

        {/* Works */}
        <div>
          <h3 className="text-xl font-semibold mb-1 text-[#110000C2]">Works</h3>
          <div className="space-y-4">
            {artisan?.works.map((work, idx) => (
              <div key={idx} className="border border-[#7A9DF75C] rounded-lg p-4 bg-gray-50">
                <p><strong>Client:</strong> {work.client}</p>
                <p><strong>Repair Type:</strong> {work.repairType}</p>
                <p><strong>Location:</strong> {work.location}</p>
                <p><strong>Duration:</strong> {work.duration}</p>
                <p><strong>Price:</strong> {work.price}</p>
                <p className="text-sm italic text-[#11000080]">{work.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="pt-2">
          <button className=" bg-[#7A9DF7] text-black py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfile;

