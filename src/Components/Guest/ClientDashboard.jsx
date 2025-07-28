import useAuth from '../../Auth/useAuth';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicBookingModal from "../Modals/PublicBookingModal";
import AddItemModal from '../Modals/AddItemModal';
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
import { Calendar, Edit3Icon, ExternalLink, LogOut, Mail, MapPin, Phone, Podcast, Wallet2, HelpCircle, PlusIcon } from "lucide-react";

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publicBookingOpen, setPublicBookingOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [uploadedProducts, setUploadedProducts] = useState(null);
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
        setClient(data);
        setProfileImage(data.profilePicture || "");
        setUploadedProducts(data.uploadedProducts || null);
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
        <PublicBookingModal closeModal={() => setPublicBookingOpen(false)} uploadedProducts={uploadedProducts} />
      )}
      {addItemModalOpen && (
        <AddItemModal
          closeModal={() => setAddItemModalOpen(false)}
        />
      )}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Profile Header */}
          <div className="max-w-6xl mx-auto bg-white px-10 py-8 backdrop-blur-sm  rounded-2xl shadow-xl flex flex-col md:flex-row justify-center items-center space-x-6 min-h-[250px]">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={profileImage || "https://via.placeholder.com/150"}
                alt="profile"
                className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            { /* Profile Details */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-6 md:mt-0">
              <h1 className="text-2xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent mb-2">
                {client.fullName}
              </h1>
              <div className="flex items-center gap-2 text-xs md:text-base text-gray-600 mt-2">
                <MapPin size={20} className="mr-2" />
                {client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}.
              </div>
              <button
                className={`flex items-center justify-between gap-2 py-2 mt-6 px-4 rounded-xl cursor-pointer text-sm font-light transition-all ease-linear bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:opacity-80 hover:shadow-xl hover:scale-102`}
                onClick={() => setPublicBookingOpen(true)}
              >
                <Podcast className="w-5 h-5"/>
                Create Public Post
              </button>
            </div>

            { /* Spacer for Flex Layout */ }
            <div className="flex-1 text-right">
            </div>
            
            { /* Wallet Section */}
            <div className="w-100 md:w-60 xl:w-80">
                <div className="flex flex-col mt-3 md:mt-0 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <span className="flex justify-between items-center mb-6">
                    <Wallet2 className="w-6 h-6" />
                    <h3 className="text-xl font-normal text-gray-800">Wallet</h3>
                  </span>

                  <div className="flex items-center justify-between mb-4 rounded-xl bg-gray-50 p-4 shadow-sm">
                    <span className="text-sm text-gray-600">Balance</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {client.walletBalance ? `$${client.walletBalance.toFixed(2)}` : 'N0.00'}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <button
                      className={`flex-1 py-2 px-4 rounded-xl cursor-pointer hover:scale-105 text-sm font-medium transition-all bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-xl hover:from-blue-600 hover:to-blue-400 hover:shadow-md`}
                      onClick={() => {}}
                    >
                      Withdraw
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-xl cursor-pointer hover:scale-105 text-sm font-medium transition-all bg-gradient-to-r from-green-400 to-green-600 text-white shadow-xl hover:from-green-600 hover:to-green-400 hover:shadow-md`}
                      onClick={() => {}}
                    >
                      Fund
                    </button>
                  </div>
                </div>
            </div>
          </div>

          {/* About and Contact Info */}
          <div className="flex flex-col md:flex-row gap-5 backdrop-blur-sm max-w-6xl mx-auto mt-6">
            {/* Contact Info */}
            <div className="rounded-2xl bg-white shadow-xl px-8 py-8 min-h-[320px] w-full md:w-1/3">
              <h3 className="text-md md:text-xl font-semibold text-gray-800 mb-6">Contact Info</h3>
              <div className="flex items-center text-sm md:text-base text-gray-700 mb-4">
                <Phone className="mr-3 text-blue-600" size={20} />
                {client.phone || 'Not provided'}
              </div>
              <div className="flex items-center text-sm md:text-base text-gray-700 mb-4">
                <Mail className="mr-3 text-blue-600" size={20} />
                {client.email}
              </div>
              <div className="flex items-center text-sm md:text-base text-gray-700 mb-4">
                <MapPin className="mr-3 text-blue-600" size={20} />
                {client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}.
              </div>
              <button
                onClick={handleEditProfile}
                className="flex items-center justify-center mt-6 py-2 px-4 gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200"
              >
                <Edit3Icon className="w-5 h-5" />
                Edit Profile
              </button>
            </div>

            {/* Device section */}
            <div className="rounded-2xl flex flex-col md:flex-row bg-white shadow-xl w-full md:w-2/3 p-6 min-h-[320px] gap-6">
              {/* Items Section */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-sm md:text-md font-semibold text-gray-800">Items</h3>
                  <span className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-600 cursor-context-menu" />
                    <span className="absolute left-0 top-6 w-64 bg-gray-100 text-gray-700 text-xs rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      These are the devices, gadgets, appliances, or items you need repaired.
                    </span>
                  </span>
                </div>

                {uploadedProducts?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedProducts.map((item, index) => (
                      <div key={index} className="p-1 relative group">
                        <div className="bg-white w-full h-[120px] rounded-xl shadow-md p-2 hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
                          <img
                            src={item.imageUrl}
                            alt="Uploaded Item"
                            className="w-16 h-16 object-cover rounded mb-1"
                          />
                          <div className="absolute w-44 top-[110px] left-0 bg-gray-100 text-gray-700 text-xs rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <p className="text-xs font-extralight text-gray-400">
                              Uploaded on: {new Date(item.uploadedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-600 whitespace-pre-wrap">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Add Item */}
                    <div className="w-20 h-[96px] p-1 relative group cursor-pointer">
                      <div
                        className="bg-gradient-to-br from-white to-purple-50 w-full h-full rounded-xl shadow-md p-2 hover:shadow-lg transition-all duration-300 hover:from-purple-50 hover:to-white ease-in-out flex items-center justify-center"
                        onClick={() => setAddItemModalOpen(true)}
                      >
                        <PlusIcon className="text-gray-500 w-6 h-6" />
                      </div>
                      <div className="absolute w-32 top-24 left-0 bg-gray-100 text-gray-700 text-xs rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <p className="text-sm text-gray-600">Add Item</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center text-gray-600 py-8">
                    <Podcast className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm mb-4">No items uploaded yet.</p>
                    <button
                      onClick={() => setAddItemModalOpen(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-xl shadow-lg hover:opacity-80 hover:shadow-xl hover:scale-105 transition-transform"
                    >
                      <PlusIcon className="inline mr-2 w-5 h-5" />
                      Upload Item
                    </button>
                  </div>
                )}
              </div>

              {/* Service Preferences */}
              <div className="w-full md:w-1/4">
                <h3 className="text-sm md:text-md font-semibold text-gray-800 mb-4">Service Preference</h3>
                <div className="flex flex-wrap gap-2">
                  {client.servicePreferences.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-200/50 hover:shadow-md transition-shadow"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="max-w-6xl mx-auto backdrop-blur-sm  mt-5 bg-white px-10 py-8 rounded-2xl shadow-xl min-h-[280px]">
            <div className="flex gap-2 md:gap-0 md:items-center md:justify-between flex-col md:flex-row justify-start items-start mb-4">
              <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text:md md:text-xl font-bold text-gray-900">Booking History</h3>
              </div>
              <a 
                href="/client/history" 
                className="flex cursor-pointer items-center text-xs md:text-[14px] gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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

          <div>
            <button
              className={`flex flex-row gap-2 items-center justify-between py-2 mt-6 xl:ml-10 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105`}
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
    </div>
  );
};

export default ClientDashboard;
