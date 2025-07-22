import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Phone, Mail, Building, ChartNoAxesCombined, ChevronDown, ChevronUp } from 'lucide-react';

const ClientSelection = () => {
  const [artisan, setArtisan] = useState(null);
  const [availability, setAvailability] = useState("Available");
  const [businessHoursOpen, setBusinessHoursOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigateFunc = useNavigate();
  const artisanId = new URLSearchParams(location.search).get("artisanId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://user-management-h4hg.onrender.com/api/admin/artisan/${artisanId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        console.log(`Data`, data);
        setArtisan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    }, [artisanId]);

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
  
    if (!artisan) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header with subtle background pattern */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>

    {/* <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 border p-4 rounded-md">
          <div className="flex items-center gap-4">
            <img
              src={artisan?.profileImage}
              alt={artisan?.fullName}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{artisan?.fullName}</h2>
              <p className="text-[#110000C2]">★ {artisan?.rating} ({artisan?.reviewsCount})</p>
              <p className="text-sm text-[#110000C2]">{artisan?.location}</p>
              <button className="mt-2 px-4 py-1 bg-[#7A9DF7] text-[#110000C2] rounded hover:bg-blue-700">
                Book Me
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">About me</h3>
            <p className="text-[#110000C2] mt-1">{artisan?.about}</p>
            <h4 className="mt-2 font-semibold">Skills</h4>
            <p className="text-sm text-blue-600">
              {artisan?.skills.join(", ")}
            </p>
          </div>
        </div>

        <div className="w-full md:w-64 border shadow-md p-4 rounded-md">
          <div className="flex items-center gap-3">
            <img
              src={artisan?.profileImage}
              alt={artisan?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{artisan?.name}</p>
              <span className="text-[#110000C2] text-sm">
                {artisan?.available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          <img src={contactIcon} alt="Contact" className="inline-block w-5 h-5 mr-2" />
          <button className="mt-4 w-full bg-[#7A9DF7] text-white py-2 rounded hover:bg-blue-700">
            <img  />
            Contact me
          </button>
        </div>
      </div> */}
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

                <div className="flex-1 relative text-center lg:text-left">
                  <div className="mb-4">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                      {artisan.fullName}
                    </h1>
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-lg">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold text-gray-900">{artisan.rating}</span>
                        <span className="text-gray-500">(0 reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span>{artisan.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {artisan.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200/50"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {artisan.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        +{artisan.skills.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="absolute hidden lg:block lg:-bottom-30 lg:-left-40 ">
                    <button
                      className={`flex-1 py-2 mt-5 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                      Book Me
                    </button>
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
                      <p className="font-semibold text-gray-900">{artisan.fullName}</p>
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
                    >
                      Unavailable
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        availability === "Available"
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
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
                        {Object.entries(artisan.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center">
                            <span className="capitalize text-sm text-gray-600 w-20">{day}:</span>
                            {hours.open.toLowerCase() === "closed" ? (
                              <span className="text-sm text-gray-500">Closed</span>
                            ) : (
                              <div className="flex gap-1">
                                <input
                                  type="time"
                                  value={hours.open}
                                  readOnly
                                  className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                />
                                <input
                                  type="time"
                                  value={hours.close}
                                  readOnly
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
                  Professional artisan specializing in {artisan.skills.join(", ").toLowerCase()}. 
                  Based in {artisan.location}, I provide high-quality services through {artisan.businessName}.
                </p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {artisan.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-200/50 hover:shadow-md transition-shadow"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
                <div>
                  <button
                    className={`flex-1 py-2 mt-6 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    Book Me
                  </button>
                </div>
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
                    <p className="text-gray-600">{artisan.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{artisan.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Business</p>
                    <p className="text-gray-600">{artisan.businessName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartNoAxesCombined className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
              </div>
            </div>
            <div className="text-gray-600 text-center py-8">
              <ChartNoAxesCombined className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No reviews to display</p>
            </div>
          </div>

      {/* <div className="mt-6">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="space-y-4 mt-2">
          {artisan?.reviews.map((review, index) => (
            <div key={index} className="border p-3 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  <span className="text-sm text-gray-500">
                    {review.country} • {review.time}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[#110000C2]">{"★".repeat(review.rating)}</p>
              <p className="text-[#110000C2] mt-1">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                Helpful? {review.helpful ? "Yes" : "No"} •{" "}
              </p>
            </div>
          ))}
        </div>
      </div> */}
      </div>
      </div>
    </div>
  );
};

export default ClientSelection;

