import useAuth from '../../Auth/useAuth';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicBookingModal from "../Modals/PublicBookingModal";
import AddItemModal from '../Modals/AddItemModal';
import FundWalletModal from '../Modals/FundWalletModal';
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
import Fetch from '../../util/Fetch'
import { 
  Calendar, 
  Edit3Icon, 
  ExternalLink, 
  LogOut, 
  Mail, 
  MapPin, 
  Phone, 
  Podcast, 
  Wallet2, 
  HelpCircle, 
  Edit2, 
  Trash2, 
  Plus,
  Package,
  History,
  Star
} from "lucide-react";
import CharProfilePic from '../CharProfilePic';

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [publicBookingOpen, setPublicBookingOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [fundWalletModalOpen, setFundWalletModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [uploadedProducts, setUploadedProducts] = useState(null);
  const [loading, setLoading] = useState({
    user: true,
    wallet: true,
  });
  const [wallet, setWallet] = useState({
    balance: 0,
    lockedBalance: 0,
  })
  const update = useRef(false);
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
    const fetchUserData = async () => {
      try {
        setLoading({
          user: true,
          wallet: true,
        });
        const { data, error, success } = await Fetch({
          url: `${import.meta.env.VITE_API_URL}/api/admin/user/${storedUser.id || storedUser._id}`
        });
        if (!success) {
          throw new Error(error);
        }
        console.log(`Data`, data);
        setIdentity(data);
        setClient(data);
        setProfileImage(data.profilePicture || "");
        setUploadedProducts(data.uploadedProducts || null);
        setLoading(prev => ({...prev,
          user: false,
        }));

        const {data: walletResp} = await Fetch({
          url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/get-balance/${storedUser.id || storedUser._id}`,
        });

        setWallet(walletResp.data);
        setLoading(prev => ({...prev,
          wallet: false,
        }));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading({
          user: false,
          wallet: false,
        });
      }
    };
    fetchUserData();
    if (update.current) {
      update.current = false;
      fetchUserData();
    }
  }, [navigate, state, update]);

  if (loading.user) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col gap-3 items-center justify-center">
        <p className="text-gray-600">No user data available</p>
        <button
          onClick={() => navigate('/welcome')}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {publicBookingOpen && (
        <PublicBookingModal closeModal={() => setPublicBookingOpen(false)} />
      )}
      {addItemModalOpen && (
        <AddItemModal
          closeModal={() => setAddItemModalOpen(false)}
          updateParent={setUploadedProducts}
        />
      )}
      {fundWalletModalOpen && (
        <FundWalletModal
          closeModal={() => setFundWalletModalOpen(false)}
        />
      )}
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          
          {/* Profile Header Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 mb-6">
            
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* Profile Image */}
              <div className="relative group flex-shrink-0">
                <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur ${profileImage ? 'opacity-25 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-15' }  transition duration-300`}></div>
                {profileImage ? <img
                  src={profileImage}
                  alt="Artisan"
                  className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                /> : 
                <CharProfilePic size={'32'} username={client.fullName} otherStyles='!text-4xl' />
              }
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent mb-3">
                  {client.fullName}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base text-gray-600 mb-4">
                  <MapPin size={18} className="flex-shrink-0" />
                  <span>{client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}</span>
                </div>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:opacity-90 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => setPublicBookingOpen(true)}
                >
                  <Podcast className="w-5 h-5"/>
                  Create Public Post
                </button>
              </div>

              {/* Wallet Section */}
              <div className="w-full lg:w-80 xl:w-96">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Wallet2 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Wallet</h3>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Balance</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        {wallet?.balance ? `₦${wallet?.balance.toFixed(2)}` : '₦0.00'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">Locked Balance</span>
                      <span className="text-md sm:text-lg font-bold text-gray-900">
                        {wallet?.lockedBalance ? `₦${wallet?.lockedBalance.toFixed(2)}` : '₦0.00'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                      Withdraw
                    </button>
                    <button 
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      onClick={() => setFundWalletModalOpen(true)}
                    >
                      Fund
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <span className="flex items-center gap-2 mb-4">
                  <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                    <Phone className="w-5 h-5 text-blue-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Info</h3>
                </span>
              
              <div className="space-y-4">

                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="break-all">{client.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{client.deliveryAddress.country}, {client.deliveryAddress.state}, {client.deliveryAddress.city}</span>
                </div>
                <div className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="break-all">{client.phoneNumber || 'Not provided'}</span>
                </div>
              </div>
              
              <button
                onClick={handleEditProfile}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:opacity-90 hover:shadow-xl transition-all duration-200"
              >
                <Edit3Icon className="w-5 h-5" />
                Edit Profile
              </button>
            </div>

            {/* Items Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 mb-4">
                    <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Repair Items</h3>
                    <div className="relative group">
                      <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                      <div className="absolute left-0 top-6 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        These are the devices, gadgets, appliances, or items you need repaired.
                      </div>
                    </div>
                  </span>
                </div>
              </div>

              {uploadedProducts?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {uploadedProducts.map((item, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all duration-300 cursor-pointer h-36 flex flex-col">
                        <div className="flex-1 flex items-center justify-center mb-2">
                          <img
                            src={item.imageUrl}
                            alt="Uploaded Item"
                            className="max-w-full max-h-20 object-cover rounded"
                          />
                        </div>
                        
                        <div className="text-xs text-gray-600 text-center">
                          <p className="font-medium truncate">{item.objectName || 'Unnamed Item'}</p>
                          <p className="text-gray-500">{new Date(item.uploadedAt).toLocaleDateString()}</p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col">
                          <div className="text-xs text-gray-500 mb-2">
                            Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                          </div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            {item.objectName || 'Unnamed Item'}
                          </h4>
                          <p className="text-xs text-gray-700 flex-1 overflow-hidden">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Icons */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit item
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit item"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete item
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Item Card */}
                  <div className="relative group">
                    <div
                      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-3 hover:border-blue-300 transition-colors cursor-pointer h-36 flex flex-col items-center justify-center"
                      onClick={() => setAddItemModalOpen(true)}
                    >
                      <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-2">
                        <Plus className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Add Item</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-gray-600 py-12">
                  <Package className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-base mb-6">No items uploaded yet.</p>
                  <button
                    onClick={() => setAddItemModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:opacity-90 hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Upload Item
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Service Preferences */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <span className="flex items-center gap-2 mb-4">
              <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                <Star className="w-5 h-5 text-blue-600"/>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Service Preferences</h3>
            </span>
            <div className="flex flex-wrap gap-3">
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

          {/* Booking History */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <span className="flex items-center gap-2 mb-4">
              <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                <History className="w-5 h-5 text-blue-600"/>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Booking History</h3>
            </span>
              <a 
                href="/client/history" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm sm:text-base"
              >
                View All History
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No recent bookings to display.</p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-start">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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