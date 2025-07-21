import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/client/edit-profile");
  };

  const client = {
    name: "New Client",
    location: "Surulere, Lagos",
    phone: "+234 904454667",
    email: "clientregistra@gmail.com",
    business: "Updated Business Name",
    about: "Client user looking to hire artisans for repair work. Based in Surulere, Lagos.",
  };


  return (
    <div className="min-h-screen bg-[#f4f7fe] p-8">
      {/* Profile Header */}
      <div className="max-w-6xl mx-auto bg-white px-10 py-8 rounded-2xl shadow-md flex items-center space-x-6 min-h-[300px]">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="profile"
          className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      {client.name}
          </h1>
          <div className="flex items-center gap-2 text-base text-gray-600 mt-2">
            <MapPin size={20} className="mr-2" />
            {client.location}
          </div>
        </div>
      </div>

      {/* About and Contact Info */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div className="bg-white px-10 py-8 rounded-2xl shadow-md md:col-span-2 min-h-[320px]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">About me</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-6">{client.about}</p>
          <button
           onClick={handleEditProfile} 
           className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600
             text-white rounded-lg text-base font-medium shadow hover:opacity-90 cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-white px-10 py-12 rounded-2xl shadow-md min-h-[320px]">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Info</h3>
          <div className="flex items-center text-base text-gray-700 mb-6">
            <Phone className="mr-3" size={20} /> {client.phone}
          </div>
          <div className="flex items-center text-base text-gray-700 mb-6">
            <Mail className="mr-3" size={20} /> {client.email}
          </div>
          <div className="flex items-center text-base text-gray-700 mb-6">
            <MapPin className="mr-3" size={20} /> {client.location}
          </div>
        </div>
      </div>

      {/* Booking History */}
      <div className="max-w-6xl mx-auto mt-10 bg-white px-10 py-8 rounded-2xl shadow-md min-h-[280px]">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking History</h3>
        <p className="text-base text-gray-600">No bookings yet.</p>
        <div className="text-right mt-4">
          <button className="text-blue-600 text-base hover:underline cursor-pointer">View All History</button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
