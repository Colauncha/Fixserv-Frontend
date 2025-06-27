import React, { useEffect, useState } from 'react';
import AllRepairs from './AllRepairs'; 

function ArtisanHome() {
  const [artisan, setArtisan] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("artisanData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setArtisan(parsedData);
      } catch (error) {
        console.error("Failed to parse artisan data:", error);
      }
    } else {
      console.warn("No artisanData found in localStorage");
    }
  }, []);

  // if (!artisan) {
  //   return (
  //     <div className="text-center text-gray-500 mt-10">
  //       No artisan data found. Please log in.
  //     </div>
  //   );
  // }

  if (!artisan) {
    return (
       <div className="text-center text-gray-500 mt-10">
        <AllRepairs />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Welcome to Fixserv</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Available works"
            className="px-3 py-1 border rounded-lg focus:outline-none"
          />
          <button className="bg-blue-500 text-white px-3 py-1 rounded">🔍</button>
          <span>🔔</span>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {artisan.businessName?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {['Television', 'Refrigerator', 'Gadgets', 'Game Gadgets'].map((item) => (
          <button
            key={item}
            className="border px-4 py-1 rounded-full hover:bg-gray-100">
            {item} ⌄
          </button>
        ))}
      </div>

      {/* Section Headings */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium bg-blue-100 px-2 py-1 rounded">All Repairs</h2>
        <h2 className="text-md font-medium bg-gray-100 px-2 py-1 rounded">Incoming Repair</h2>
      </div>


      {/* Artisan's Own Repair Info */}
      <div className="space-y-4">
        <div className="p-4 border rounded-md shadow-sm bg-gray-50">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
              {artisan.businessName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold">{artisan.businessName}</h3>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
            <span className="ml-auto text-sm font-semibold text-green-600">
              Available
            </span>
          </div>
          <p className="text-sm">
            <strong>Repair Type:</strong> {artisan.skillSet}
          </p>
          <p className="text-sm">
            <strong>Location:</strong> {artisan.location}
          </p>
          <p className="text-sm mt-1">
            <strong>Duration:</strong> {artisan.businessHours}
          </p>
          <p className="text-sm">
            <strong>Price:</strong> {artisan.rating} {/* Use this field for pricing */}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtisanHome;




// import React, { useEffect, useState } from 'react';


// function ArtisanHome() {
//   const [artisan, setArtisan] = useState(null);

//   useEffect(() => {
//     const storedData = localStorage.getItem("artisanData");
//     if (storedData) {
//       setArtisan(JSON.parse(storedData));
//     }
//   }, []);

//   // useEffect(() => {
//   //   const storedData = localStorage.getItem("artisanData");
//   //   if (storedData) {
//   //     try {
//   //       const parsedData = JSON.parse(storedData);
//   //       setArtisan(parsedData);
//   //     } catch (error) {
//   //       console.error("Failed to parse artisan data:", error);
//   //     }
//   //   } else {
//   //     console.warn("No artisanData found in localStorage");
//   //   }
//   // }, []);

//   if (!artisan) return <div>Loading...</div>;

//   // if (!artisan) {
//   //   return (
//   //      <div className="text-center text-gray-500 mt-10">
//   //       <AllRepairs />
//   //     </div>
//   //   );
//   // }


//   return (
//     <div className="min-h-screen bg-white p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-2xl font-semibold">Welcome to Fixserv</h3>
//         <div className="flex items-center space-x-4">
//           <input
//             type="text"
//             placeholder="Available works"
//             className="px-3 py-1 border rounded-lg focus:outline-none"
//           />
//           <button className="bg-blue-500 text-white px-3 py-1 rounded">🔍</button>
//           <span>🔔</span>
//           <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
//             {artisan.businessName?.charAt(0) || 'A'}
//           </div>
//         </div>
//       </div>

//       {/* Filter Buttons */}
//       <div className="flex gap-4 mb-6">
//         {['Television', 'Refrigerator', 'Gadgets', 'Game Gadgets'].map((item) => (
//           <button
//             key={item}
//             className="border px-4 py-1 rounded-full hover:bg-gray-100">
//             {item} ⌄
//           </button>
//         ))}
//       </div>

//       {/* Section Headings */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-medium bg-blue-100 px-2 py-1 rounded">All Repairs</h2>
//         <h2 className="text-md font-medium bg-gray-100 px-2 py-1 rounded">Incoming Repair</h2>
//       </div>

//       {/* Repairs Section */}
//       <div className="space-y-4">
//         <div className="p-4 border rounded-md shadow-sm bg-gray-50">
//           <div className="flex items-center mb-2">
//             <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
//               {artisan.businessName?.charAt(0)}
//             </div>
//             <div>
//               <h3 className="font-semibold">{artisan.businessName}</h3>
//               <p className="text-xs text-gray-500">Just now</p>
//             </div>
//             <span className="ml-auto text-sm font-semibold text-green-600">
//               Available
//             </span>
//           </div>
//           <p className="text-sm">
//             <strong>Repair Type:</strong> {artisan.skillSet}
//           </p>
//           <p className="text-sm">
//             <strong>Location:</strong> {artisan.location}
//           </p>
//           <p className="text-sm mt-1">
//             <strong>Duration:</strong> {artisan.businessHours}
//           </p>
//           <p className="text-sm">
//             <strong>Price:</strong> {artisan.rating} (e.g. use this field for price)
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default ArtisanHome;

