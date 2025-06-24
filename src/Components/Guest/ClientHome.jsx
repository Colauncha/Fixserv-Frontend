import React from "react";
import Footer from "../Footer"; 
import AllRepairs from "./AllRepairs"; 



const ArtisanCard = ({ artisan }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center space-y-2 w-full sm:w-64">

      <div className="flex items-center justify-between w-full mb-2">
      <h2 className="text-xl font-bold mb-2">Top Artisan</h2>
      <img
        src={artisan.image}
        alt={artisan.name}
        className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
      />
      <h3 className="text-lg font-semibold">{artisan.name}</h3>
      <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
        Book Artisan
      </button>
      <div className="text-sm text-gray-500 flex items-center space-x-1">
        <span>⭐ {artisan.rating}</span>
        <span>Artisan is highly rated</span>
      </div>
      <p className="text-xs text-gray-400">📍 {artisan.location}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Available Artisan</h2>
        <img
        src={artisan.image}
        alt={artisan.name}
        className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
      />
      <h3 className="text-lg font-semibold">{artisan.name}</h3>
  <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
        Book Artisan
      </button>
      <div className="text-sm text-gray-500 flex items-center space-x-1">
        <span>⭐ {artisan.rating}</span>
        <span>Artisan is highly rated</span>
      </div>
      <p className="text-xs text-gray-400">📍 {artisan.location}</p>
      </div>

       <div>
        <h2 className="text-xl font-semibold mb-2">Booked Artisan</h2>
        <img
        src={artisan.image}
        alt={artisan.name}
        className="w-20 h-20 bg-[#ECF1FC] rounded-sm object-cover"
      />
      <h3 className="text-lg font-semibold">{artisan.name}</h3>
      <button className="bg-[#7A9DF7] text-white px-4 py-1 rounded-md hover:bg-blue-600">
        Book Artisan
      </button>
      <div className="text-sm text-gray-500 flex items-center space-x-1">
        <span>⭐ {artisan.rating}</span>
        <span>Artisan is highly rated</span>
      </div>
      <p className="text-xs text-gray-400">📍 {artisan.location}</p>
      </div>

      <div>
        <Footer />
      </div>

    </div>    
  );
};

const ClientHome = ({ artisans }) => {
  if (!artisans || artisans.length === 0) {
    return (   
      <p className="text-center text-gray-500 mt-10">
        <AllRepairs />
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {artisans.map((artisan, index) => (
        <ArtisanCard key={index} artisan={artisan} />
      ))}
    </div>
  );
};

export default ClientHome;



