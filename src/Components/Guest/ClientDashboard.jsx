import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, ExternalLink, Calendar, LogOut, Edit3Icon, Podcast } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from '../../Auth/useAuth';
import PublicBookingModal from "../Modals/PublicBookingModal";
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicBookingOpen, setPublicBookingOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/client/edit-profile");
  };

  const { state, logout } = useAuth();

  useEffect(() => {
    const storedUser = getIdentity();
    if (storedUser.role !== 'CLIENT') {
      navigate('/artisans/dashboard');
    }
    console.log('stored user', storedUser);
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://user-management-h4hg.onrender.com/api/admin/user/${storedUser.id || storedUser._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log(`Data`, data);
        setIdentity(data);
        setClient(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <p className="text-gray-600">No user data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {publicBookingOpen && (
        <PublicBookingModal closeModal={() => setPublicBookingOpen(false)} />
      )}
      <div className="min-h-screen bg-[#f4f7fe] p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="max-w-6xl mx-auto bg-white px-10 py-8 rounded-2xl shadow-xl flex items-center space-x-6 min-h-[250px]">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="profile"
              className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              {client.fullName}
            </h1>
            <div className="flex items-center gap-2 text-base text-gray-600 mt-2">
              <MapPin size={20} className="mr-2" />
              {client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}.
            </div>
            <button
              className={`flex items-center justify-between gap-2 py-2 mt-6 px-4 rounded-xl cursor-pointer text-sm font-light transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105`}
              onClick={() => setPublicBookingOpen(true)}
            >
              <Podcast className="w-5 h-5"/>
              Create Public Post
            </button>
          </div>
          <div className="flex-1 text-right">
          </div>
        </div>

        {/* About and Contact Info */}
        <div className="flex flex-col gap-5 max-w-6xl mx-auto mt-5 md:flex-row ">
          {/* Contact Info */}
          <div className="rounded-2xl bg-white shadow-xl px-10 py-10 min-h-[320px] md:w-full">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Info</h3>
            <div className="flex items-center text-base text-gray-700 mb-6">
              <Phone className="mr-3" size={20} /> {client.phone || 'Not provided'}
            </div>
            <div className="flex items-center text-base text-gray-700 mb-6">
              <Mail className="mr-3" size={20} /> {client.email}
            </div>
            <div className="flex items-center text-base text-gray-700 mb-6">
              <MapPin className="mr-3" size={20} /> {client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}.
            </div>
            <button
            onClick={handleEditProfile} 
            className="mt-6 p-3 bg-gradient-to-r from-blue-500 to-purple-500
              text-white rounded-xl text-base font-light shadow hover:opacity-90 cursor-pointer"
            >
              <Edit3Icon className="inline mr-2 w-5 h-5" />
              Edit Profile
            </button>
          </div>
          <div className="rounded-2xl bg-white shadow-xl w-full px-10 py-10 min-h-[320px]">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Service Preference</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {client.servicePreferences.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200/50 hover:shadow-md transition-shadow"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking History */}
        <div className="max-w-6xl mx-auto mt-5 bg-white px-10 py-8 rounded-2xl shadow-xl min-h-[280px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Booking History</h3>
            </div>
            <a 
              href="/client/history" 
              className="flex cursor-pointer items-center text-[14px] gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All History
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="text-gray-600 text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-base text-gray-600">No recent bookings to display.</p>
          </div>
        </div>

        <button
          className={`flex flex-row gap-2 items-center justify-between py-2 mt-6 ml-10 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105`}
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              logout();
            }, 500);
          }}
        >
          <LogOut className="w-5 h-5"/>
          Log Out
        </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
