// import React from "react";
// import Footer from "../Footer"; 
// import AllRepairs from "./AllRepairs"; 



// const ArtisanCard = ({ artisan }) => {
//   return (
//     <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center space-y-2 w-full sm:w-64">

//       <div className="flex items-center justify-between w-full mb-2">
//       <h2 className="text-xl font-bold mb-2">Top Artisan</h2>
//       <img
//         src={artisan.image}
//         alt={artisan.name}
//         className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
//       />
//       <h3 className="text-lg font-semibold">{artisan.name}</h3>
//       <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
//         Book Artisan
//       </button>
//       <div className="text-sm text-gray-500 flex items-center space-x-1">
//         <span>⭐ {artisan.rating}</span>
//         <span>Artisan is highly rated</span>
//       </div>
//       <p className="text-xs text-gray-400">📍 {artisan.location}</p>
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold mb-2">Available Artisan</h2>
//         <img
//         src={artisan.image}
//         alt={artisan.name}
//         className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
//       />
//       <h3 className="text-lg font-semibold">{artisan.name}</h3>
//   <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
//         Book Artisan
//       </button>
//       <div className="text-sm text-gray-500 flex items-center space-x-1">
//         <span>⭐ {artisan.rating}</span>
//         <span>Artisan is highly rated</span>
//       </div>
//       <p className="text-xs text-gray-400">📍 {artisan.location}</p>
//       </div>

//        <div>
//         <h2 className="text-xl font-semibold mb-2">Booked Artisan</h2>
//         <img
//         src={artisan.image}
//         alt={artisan.name}
//         className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
//       />
//       <h3 className="text-lg font-semibold">{artisan.name}</h3>
//       <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
//         Book Artisan
//       </button>
//       <div className="text-sm text-gray-500 flex items-center space-x-1">
//         <span>⭐ {artisan.rating}</span>
//         <span>Artisan is highly rated</span>
//       </div>
//       <p className="text-xs text-gray-400">📍 {artisan.location}</p>
//       </div>

//       <div>
//         <Footer />
//       </div>
//     </div>    
//   );
// };

// const ClientHome = ({ artisans }) => {
//   if (!artisans || artisans.length === 0) {
//     return (   
//       <p className="text-center text-gray-500 mt-10">
//         <AllRepairs />
//       </p>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//       {artisans.map((artisan, index) => (
//         <ArtisanCard key={index} artisan={artisan} />
//       ))}
//     </div>
//   );
// };

// export default ClientHome;


import React from "react";
import { MapPin, Star } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const artisans = [
  {
    id: 1,
    name: "Abbas Akande",
    rating: 5.0,
    location: "Ikeja, Lagos State",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Abbas Akande",
    rating: 4.5,
    location: "Ikeja, Lagos State",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Abbas Akande",
    rating: 4.0,
    location: "Ikeja, Lagos State",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const ClientHome = () => {

  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
     <div>
       <h2 className="text-xl font-semibold mb-6">Top Artisans</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <div>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-20 h-20 rounded-full object-cover mb-3"                    
            />
            <h3 className="text-lg font-medium mb-4">{artisan.name}</h3>
            <button 
                            // key={index}
            onClick={() => navigate("/client-profile")}
            className="bg-blue-400 hover:bg-blue-500 text-white px-12 py-2 rounded-lg mt-6 transition cursor-pointer">
              Book Artisan
            </button>

            
          </div>
          <div className="p-2">
            <div className="flex items-center space-x-1 text-sm text-gray-700">
              <Star size={16} fill="#000" className="text-black" />
              <span>{artisan.rating}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Artisan is highly rated</p>
            <div className="flex items-center text-sm text-gray-700 mt-1">
              <MapPin size={14} className="mr-1 text-gray-600" />
              <span className="font-medium">{artisan.location}</span>
            </div>
          </div>
          </div>
        ))}
      </div>
     </div>

     <div  className="mt-18 mb-18">
       <h2 className="text-xl font-semibold mb-6">Available Artisans</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <div>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-medium mb-4">{artisan.name}</h3>
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-12 py-2 rounded-lg mt-6 transition cursor-pointer">
              Book Artisan
            </button>

            
          </div>
          <div className="p-2">
            <div className="flex items-center space-x-1 text-sm text-gray-700">
              <Star size={16} fill="#000" className="text-black" />
              <span>{artisan.rating}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Artisan is highly rated</p>
            <div className="flex items-center text-sm text-gray-700 mt-1">
              <MapPin size={14} className="mr-1 text-gray-600" />
              <span className="font-medium">{artisan.location}</span>
            </div>
          </div>
          </div>
        ))}
      </div>
     </div>
     <div>
       <h2 className="text-xl font-semibold mb-6">Booked Artisans</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artisans.map((artisan) => (
          <div>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-medium mb-4">{artisan.name}</h3>
            <button className="bg-blue-400 hover:bg-blue-500 text-white px-12 py-2 rounded-lg mt-6 transition cursor-pointer">
              Book Artisan
            </button>

            
          </div>
          <div className="p-2">
            <div className="flex items-center space-x-1 text-sm text-gray-700">
              <Star size={16} fill="#000" className="text-black" />
              <span>{artisan.rating}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Artisan is highly rated</p>
            <div className="flex items-center text-sm text-gray-700 mt-1">
              <MapPin size={14} className="mr-1 text-gray-600" />
              <span className="font-medium">{artisan.location}</span>
            </div>
          </div>
          </div>
        ))}
      </div>
     </div>
    </div>
  );
};

export default ClientHome;
