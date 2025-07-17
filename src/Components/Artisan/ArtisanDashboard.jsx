import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Auth/useAuth';
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
import { Star, MapPin, Clock, Phone, Mail, Building, Edit3, Calendar, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const ModernProfile = () => {
  const [availability, setAvailability] = useState("Available");
  const [businessHoursOpen, setBusinessHoursOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigateFunc = useNavigate();
  const { state, logout } = useAuth();

  useEffect(() => {
    const storedUser = getIdentity();
    if (storedUser.role !== 'ARTISAN') {
      navigateFunc('/client/profile');
    }
    console.log('stored user', storedUser);
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://user-management-h4hg.onrender.com/api/admin/artisan/${storedUser.id || storedUser._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log(`Data`, data);
        setIdentity(data);
        setUserData(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigateFunc, state]);

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

  const navigate = (path) => {
    navigateFunc(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Artisan"
                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
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
                    {userData.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {userData.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        +{userData.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Card */}
              <div className="lg:w-80 xl:w-96">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Artisan"
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                    />
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
                    
                    {businessHoursOpen && (
                      <div className="space-y-3 pl-6">
                        {Object.entries(userData.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="capitalize text-sm text-gray-600 w-20">{day}:</span>
                            {hours.open.toLowerCase() === "closed" ? (
                              <span className="text-sm text-gray-500">Closed</span>
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
                              </div>
                            )}
                          </div>
                        ))}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About me</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Professional artisan specializing in {userData.skills.join(", ").toLowerCase()}. 
                  Based in {userData.location}, I provide high-quality services through {userData.businessName}.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {userData.skills.map((skill, index) => (
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">+234 904454667</p>
                  </div>
                </div>
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
              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
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
            <div className="text-gray-600 text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No recent bookings to display</p>
            </div>
          </div>
          <div>
            <button
              className={`flex-1 py-2 mt-6 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105`}
              onClick={() => {
                navigateFunc('/');
                setTimeout(() => {
                  logout();
                }, 500);
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;