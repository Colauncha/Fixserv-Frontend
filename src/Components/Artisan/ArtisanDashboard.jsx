import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
import AddServiceModal from '../Modals/AddServiceModal';
import { Star, User, Users, MapPin, Clock, Phone, Mail, Building, Edit3, Calendar, ExternalLink, ChevronDown, ChevronUp, LogOutIcon, Cog, Plus, Edit2, Trash2, ShoppingBagIcon, CheckCircle, AlertCircle, XCircle, Eye, Package } from 'lucide-react';
import CharProfilePic from '../CharProfilePic';
import Loader from '../../assets/Loaders/Loader';
import { toast } from 'react-toastify';

const ModernProfile = () => {
  const [availability, setAvailability] = useState("Available");
  const [businessHoursOpen, setBusinessHoursOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    orders: true,
    services: true,
    businessHours: false,
  });
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  
  const navigateFunc = useNavigate();
  const { state, logout } = useAuth();

  useEffect(() => {
    const storedUser = getIdentity();
    if (!storedUser) {
      navigateFunc('/welcome');
    } else if (storedUser && storedUser.role !== 'ARTISAN') {
      navigateFunc('/client/dashboard');
    }
    console.log('stored user', storedUser);
  
    const fetchAllData = async () => {
      try {
        setLoading({
          user: true,
          orders: true,
          services: true,
          businessHours: false,
        });
  
        // fetch user data using Fetch utility
        const { data: userData, error: userError } = await Fetch({
          url: `${import.meta.env.VITE_API_URL}/api/admin/user/${storedUser.id || storedUser._id}`,
          token: state.token,
        });
  
        if (userError) {
          throw new Error(`Failed to fetch user data: ${userError.message}`);
        }
        console.log('User Data:', userData);
        setIdentity(userData);
        setUserData(userData);
        setLoading(prev => ({...prev,
          user: false,
        }));
  
        // fetch artisan services
        const { data: servicesData, error: servicesError } = await Fetch({
          url: `${import.meta.env.VITE_API_SERVICE_URL}/service/artisan/${storedUser?.id || storedUser?._id}`,
          token: state.token,
        });
  
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
        } else {
          console.log('Services:', servicesData);
          setServices(servicesData || []);
          setLoading(prev => ({...prev,
            services: false,
          }));
        }

        // fetch artisan orders
        const { data: orderData, error: orderError } = await Fetch({
          url: `${import.meta.env.VITE_API_ORDER_URL}/orders/public`,
        });
  
        if (orderError) {
          console.error('Error fetching order:', orderError);
          throw new Error(orderError);
        } else {
          console.log('Orders:', orderData);
          setOrders(orderData || []);
          setLoading(prev => ({...prev,
            orders: false,
          }));
        }
  
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error(`Error: ${err.message}`)
      } finally {
        setLoading({
          user: false,
          orders: false,
          services: false,
          businessHours: false,
        });
      }
    };
  
    fetchAllData();
  }, [navigateFunc, state]);
  

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

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <p className="text-gray-600">No user data available</p>
      </div>
    );
  }

  const toggleAvailability = (status) => {
    setAvailability(status);
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      'COMPLETED': {
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Completed'
      },
      'PENDING': {
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Pending'
      },
      'IN_PROGRESS': {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <Clock className="w-4 h-4" />,
        text: 'In Progress'
      },
      'CANCELLED': {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Cancelled'
      }
    };

    return statusConfig[status] || statusConfig['PENDING'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Fixed filtering logic - ensure orders is an array and filter properly
  const filteredOrders = Array.isArray(orders) ? orders.filter(order => order.artisanId === userData.id) : [];

  const handleHourChange = (day, type, value) => {
    setUserData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [type]: value
        }
      }
    }));
  };

  const updateBusinessHours = async () => {
    try {
      setLoading(prev => ({...prev, businessHours: true}));
      const { data, error } = await Fetch({
        url: `${import.meta.env.VITE_API_URL}/api/admin/${userData.id}`,
        method: 'PATCH',
        token: state.token,
        requestData: {
          businessHours: userData.businessHours
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Business hours updated successfully');
      setUserData(prev => ({
        ...prev,
        businessHours: data.businessHours
      }));
      setIdentity(data);
    } catch (err) {
      console.error('Error updating business hours:', err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(prev => ({...prev, businessHours: false}));
    }
  };

  const handleServiceUpdate = (service) => {
    console.log('Update service:', service);
  };

  const handleServiceDelete = (id) => {
    console.log('Delete service:', id);
  };

  const navigate = (path) => {
    navigateFunc(path);
  };

  const handleOpenServiceModal = () => {
    setServiceModalOpen(true);
  }

  const handleAcceptOrder = (orderId) => {
    console.log('Accepting order:', orderId);
  };

  const handleViewOrderDetails = (orderId) => {
    console.log('Viewing order details:', orderId);
    navigate(`/artisans/job/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {serviceModalOpen && (
        <AddServiceModal
          closeModal={() => setServiceModalOpen(false)}
          updateParent={setServices}
        />
      )}
      {/* Header with subtle background pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          
          {/* Main Profile Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Profile Image & Info */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 flex-1">
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur ${userData.profilePicture ? 'opacity-25 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-15' }  transition duration-300`}></div>
                  {userData.profilePicture ? <img
                    src={userData.profilePicture}
                    alt="Artisan"
                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  /> : 
                  <CharProfilePic size={'32'} username={userData.fullName} otherStyles='!text-4xl' />
                  }
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="mb-4">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      {userData.fullName}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-lg">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold text-gray-900">{userData.rating}</span>
                        <span className="text-gray-500">(0 reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>{userData.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {userData.skillSet?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {userData.skillSet?.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        +{userData.skillSet.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Card */}
              <div className="lg:w-80 xl:w-96">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    {userData.profilePicture ? <img
                      src={userData.profilePicture}
                      alt="Artisan"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    /> : 
                    <CharProfilePic size={'12'} username={userData.fullName} />
                    }
                    <div>
                      <p className="font-semibold text-gray-900">{userData.fullName}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${availability === "Available" ? "bg-green-500" : "bg-gray-400"}`}></div>
                        <span className="text-gray-600">{availability}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <button
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        availability === "Unavailable"
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => toggleAvailability("Unavailable")}
                    >
                      Unavailable
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        availability === "Available"
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => toggleAvailability("Available")}
                    >
                      Available
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => setBusinessHoursOpen(!businessHoursOpen)}
                      className="flex items-center justify-between w-full mb-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <h4 className="font-semibold text-gray-900">Business Hours</h4>
                      </div>
                      {businessHoursOpen ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {businessHoursOpen && userData.businessHours && (
                      <div className="space-y-3 pl-6">
                        {Object.entries(userData.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="capitalize text-sm text-gray-600 w-20">{day}:</span>
                            {hours.open.toLowerCase() === "closed" ? (
                              <div className="flex gap-1">
                                <input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) => handleHourChange(day, "open", e.target.value)}
                                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) => handleHourChange(day, "close", e.target.value)}
                                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                              </div>
                            ) : (
                              <div className="flex gap-1">
                                <input
                                  type="time"
                                  value={hours.open}
                                  onChange={(e) => handleHourChange(day, "open", e.target.value)}
                                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <input
                                  type="time"
                                  value={hours.close}
                                  onChange={(e) => handleHourChange(day, "close", e.target.value)}
                                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <span className="px-2 py-1">
                                  <XCircle 
                                    className="w-4 h-4 text-red-500 cursor-pointer" 
                                    onClick={() => {
                                      handleHourChange(day, "open", "closed")
                                      handleHourChange(day, "close", "closed")
                                    }}
                                  />
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          className='mt-2 py-1.5 px-3 bg-gradient-to-r from-green-500 rounded-xl to-green-600 text-white text-center shadow-lg hover:opacity-90 transition-opacity text-sm font-medium'
                          onClick={updateBusinessHours}
                        >
                          {loading.businessHours ? <Loader size={'5'} otherStyles={'text-white'} /> : 'Update'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About & Skills Section */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <span className="flex items-center gap-2 mb-4">
                  <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                    <User className="w-5 h-5 text-blue-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">About me</h3>
                </span>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Professional artisan specializing in {userData.skillSet?.join(", ").toLowerCase()}. 
                  Based in {userData.location}, I provide high-quality services through {userData.businessName}.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {userData.skillSet?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200/50 hover:shadow-md transition-shadow"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/artisans/edit-profile")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <span className="flex items-center gap-2 mb-4">
                  <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                    <Phone className="w-5 h-5 text-blue-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Info</h3>
                </span>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{userData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{userData.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Business</p>
                    <p className="text-gray-600">{userData.businessName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">{userData.phoneNumber || '+234 904454667'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border mb-8 border-white/20 p-6">
            <span className="flex items-center gap-2 mb-4">
              <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                <Cog className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">My Services</h3>
            </span>

            {/* Scrollable Grid */}
            {loading.services ? 
            (
              <div className='flex flex-col gap-3 items-center justify-center h-64'>
                <Loader size={'10'} otherStyles={'text-center'}/>
                <span className='font-light text-md text-gray-600'>Loading Services...</span>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-flow-col my-4 auto-cols-[280px] gap-4 min-w-full">
                {services?.length > 0 && services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header with Actions */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-base font-semibold text-gray-900 flex-1 pr-2">{service.title}</h4>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleServiceUpdate(service)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Update service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleServiceDelete(service.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

                    {/* Service Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-700 font-medium">{service.estimatedDuration}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500">Status:</span>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-gray-700 font-medium">{service.rating ?? 0}/5</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-blue-600 font-bold text-lg">
                      ₦{Number(service.price).toLocaleString()}
                    </div>
                  </div>
                ))}

                {/* Add Service Card */}
                <div 
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-200 p-4 hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={handleOpenServiceModal}
                >
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-3">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-base font-semibold text-gray-700 mb-1">Add New Service</h4>
                    <p className="text-sm text-gray-500">Create a new service offering</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Incoming Orders Section - FIXED */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border mb-8 border-white/20 p-6">
            <span className="flex items-center gap-2 mb-6">
              <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Incoming Orders</h3>
            </span>

            {/* Check if there are filtered orders */}
            {loading.orders ? 
              (
                <div className='flex flex-col gap-3 items-center justify-center h-64'>
                  <Loader size={'10'} otherStyles={'text-center'}/>
                  <span className='font-light text-md text-gray-600'>Loading Orders...</span>
                </div>
              ) : (
              filteredOrders && filteredOrders.length > 0 ? (
              <div className="grid gap-6">
                {filteredOrders.map((order) => {
                  const statusDisplay = getStatusDisplay(order.status);
                  
                  return (
                    <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        
                        {/* Order Images */}
                        <div className="flex-shrink-0">
                          {order.uploadedProducts?.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                              {order.uploadedProducts.slice(0, 3).map((product, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={product.imageUrl}
                                    alt={product.description || 'Order item'}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                                  />
                                  {idx === 2 && order.uploadedProducts.length > 3 && (
                                    <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                      <span className="text-white font-semibold text-sm">
                                        +{order.uploadedProducts.length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
  
                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Order #{order.id.toString().slice(0, 8)}...
                                </h3>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color}`}>
                                  {statusDisplay.icon}
                                  {statusDisplay.text}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600 mb-1">
                                {formatPrice(order.price)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Escrow: {order.escrowStatus?.replace('_', ' ') || 'N/A'}
                              </div>
                            </div>
                          </div>
  
                          {/* Problem Description */}
                          {order.uploadedProducts?.length > 0 && order.uploadedProducts[0].description && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Problem Description:</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {order.uploadedProducts[0].description}
                              </p>
                            </div>
                          )}
  
                          {/* Location & Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {order.clientAddress?.city}, {order.clientAddress?.state}, {order.clientAddress?.country}
                              </span>
                            </div>
                            
                            <div className="flex gap-3">
                              <button 
                                onClick={() => handleViewOrderDetails(order.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {order.status === 'PENDING' && (
                                <button 
                                  onClick={() => handleAcceptOrder(order.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                                >
                                  Accept Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
                ) : (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 py-12 px-4 bg-white/70 rounded-2xl">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 shadow-md mb-4">
                    <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">No Recent Orders</h4>
                  <p className="text-sm text-gray-500">
                    You haven't received any orders yet. When you do, they'll show up here.
                  </p>
                </div>
              )
            )}
          </div>

          {/* History Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className='p-2 rounded-lg bg-gradient-to-tr from-purple-100 to-blue-100'>
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Booking History</h3>
              </div>
              <a 
                href="/artisans/history" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View All History
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-col items-center justify-center text-center text-gray-600 py-12 px-4 bg-white/70 rounded-2xl">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 shadow-md mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-1">No recent bookings to display</h4>
              <p className="text-sm text-gray-500">
                You haven't received any orders yet. When you do, they'll show up here.
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div>
            <button
              className="flex-1 py-2 mt-6 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              onClick={() => {
                navigateFunc('/');
                setTimeout(() => {
                  logout();
                }, 500);
              }}
            >
              <LogOutIcon className="inline mr-2 w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;