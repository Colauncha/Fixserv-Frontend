// import React, {useEffect} from "react";
import { MapPin, Star } from "lucide-react"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const art = [
  {
    id: 1,
    name: "Abbas Akande",
    rating: 5.0,
    location: "Ikeja, Lagos State",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    API_URL: ""
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
  const [artisans, setArtisans] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(1)


  useEffect(() =>{
   const fetchArtisans = async () => { 
    const endpoint = import.meta.env.VITE_API_URL + "/api/admin/getAll?role=ARTISAN"
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        "content-Type": "application/json",
      })
      if(!response.ok){
        throw new Error(response.text)
      }
      const data = await response.json()
      setArtisans(data.users)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
      setPerPage(data.results)
      setTotal(data.total)
      console.log(data)
      
    } catch (error) {
      console.error(error)
      
    } 
  }
  fetchArtisans()
  },[])

  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
     <div>
       <h2 className="text-xl font-semibold mb-6">Top Artisans</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artisans?.map((artisan) => (
          <div key={artisan.id}>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.fullName}
              className="w-20 h-20 rounded-full object-cover mb-3"                    
            />
            <h3 className="text-lg font-medium mb-4">{artisan.fullName}</h3>
            <button 
                            // key={index}
            onClick={() => navigate("/client/profile")}
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
        {artisans?.map((artisan) => (
          <div>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.fullName}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-medium mb-4">{artisan.fullName}</h3>
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
        {artisans?.map((artisan) => (
          <div>
            <div
            key={artisan.id}
            className="bg-blue-50 rounded-xl p-8 flex flex-col items-center shadow-sm "
          >
            <img
              src={artisan.image}
              alt={artisan.fullName}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-medium mb-4">{artisan.fullName}</h3>
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






// import React from 'react';
// import ArtisanCard from './ArtisanCard';
// import axios from 'axios';

// const ClientHome = ({ artisans, currentUser, refreshArtisans }) => {
//   const handleToggleStatus = async (artisan) => {
//     const newStatus = artisan.status === 'available' ? 'booked' : 'available';
//     try {
//       await axios.patch(
//         `https://user-management-h4hg.onrender.com/api/admin/${artisan._id}`,
//         { status: newStatus }
//       );
//       refreshArtisans(); // Re-fetch artisan list
//     } catch (err) {
//       console.error('Failed to update status:', err);
//     }
//   };

//   const renderSection = (title, list) => (
//     <div className="mb-10">
//       <h2 className="text-xl font-bold mb-4">{title}</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {list.map((artisan) => (
//           <ArtisanCard
//             key={artisan._id}
//             artisan={artisan}
//             isSelf={currentUser?._id === artisan._id}
//             onToggleStatus={handleToggleStatus}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   const topArtisans = artisans.filter(a => a.artisanData?.rating >= 4.5);
//   const availableArtisans = artisans.filter(a => a.status === 'available');
//   const bookedArtisans = artisans.filter(a => a.status === 'booked');

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* <div className="mb-6">
//         <input
//           type="text"
//           placeholder="Service, Artisans or Location"
//           className="w-full p-3 border border-gray-300 rounded-lg"
//         />
//       </div> */}
//       {renderSection('Top Artisans', topArtisans)}
//       {renderSection('Available Artisans', availableArtisans)}
//       {renderSection('Booked Artisans', bookedArtisans)}
//     </div>
//   );
// };

// export default ClientHome;
