import { MapPin, Star, ChevronLeft, ChevronRight, Award, Users, Calendar, Cog, Edit2, Trash2 } from "lucide-react"; 
import { useEffect, useState, useCallback } from "react";
import CharProfilePic from "../CharProfilePic";
import { useNavigate } from "react-router-dom";
import Fetch from "../../util/Fetch";

const ClientHome = () => {
  const [artisans, setArtisans] = useState([]);
  const [bookedArtisans, setBookedArtisans] = useState([]);
  const [topArtisans, setTopArtisans] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('top');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultType, setResultType] = useState('artisan'); // 'artisan' or 'service'

  const tabs = [
    { id: 'top', label: 'Top Artisans', icon: Award, color: 'text-yellow-600' },
    { id: 'available', label: 'Available', icon: Users, color: 'text-green-600' },
    { id: 'booked', label: 'Booked', icon: Calendar, color: 'text-blue-600' },
    { id: 'services', label: 'Services', icon: Cog, color: 'text-stone-600' }
  ];

  const fetchArtisans = useCallback(async () => {
    setLoading(true);
    const endpoint = `${import.meta.env.VITE_API_URL}/api/admin/getAll?role=ARTISAN&page=${currentPage}&limit=${perPage}`;
    
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const data = await response.json();
      
      // Simulate different data for different tabs
      switch (activeTab) {
        case 'top':
          setTopArtisans(data.users || []);
          break;
        case 'available':
          setArtisans(data.users || []);
          break;
        case 'booked':
          setBookedArtisans(data.users || []);
          break;
      }
      
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, perPage]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const endpoint = `${import.meta.env.VITE_API_SERVICE_URL}/service/services?page=${currentPage}&limit=${perPage}`;
    try {
      const {data, success} = await Fetch({
        url: endpoint,
        method: 'GET',
        contentType: 'application/json',
      })
      if (!success) {
        throw new Error(data.message || 'Failed to fetch services');
      }
      setServices(data || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotal(data.length || 0);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage]);

  useEffect(() => {
    if (activeTab !== 'services') {
      fetchArtisans();
      setResultType('artisan');
    }
    else {
      fetchServices();
      setResultType('services'); // Fixed: changed from 'services' to 'service'
    }
  }, [activeTab, currentPage, perPage, fetchArtisans, fetchServices]);

  const getCurrentArtisans = () => {
    switch (activeTab) {
      case 'top':
        return topArtisans;
      case 'available':
        return artisans;
      case 'booked':
        return bookedArtisans;
      default:
        return [];
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getButtonText = (tab) => {
    switch (tab) {
      case 'top':
        return 'Book Now';
      case 'available':
        return 'Book Artisan';
      case 'booked':
        return 'View Booking';
      default:
        return 'Book Artisan';
    }
  };

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Artisans/Services</h1>
        <p className="text-gray-600">Discover and book skilled professionals and services for your needs</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {resultType === 'artisan' ? getCurrentArtisans().length : services.length} of {total} {resultType === 'artisan' ? 'artisans' : 'services'} found
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Artisans/services Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resultType === 'artisan'
            ? getCurrentArtisans().map((artisan) => (
                <div
                  key={artisan.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {/* Card Header */}
                  <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="relative inline-block mb-4">
                      {artisan.profilePicture ? (
                        <img
                          src={artisan.profilePicture}
                          alt={artisan.fullName}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <CharProfilePic username={artisan.fullName} size={'20'} />
                      )}
                      {activeTab === 'top' && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                          <Award className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {artisan.fullName}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {artisan.rating || '4.5'}
                      </span>
                      <span className="text-xs text-gray-500">(24 reviews)</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{artisan.location || 'Lagos, Nigeria'}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 pt-4">
                    {activeTab === 'top' && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 text-center">
                          ⭐ Top rated professional
                        </p>
                      </div>
                    )}

                    {activeTab === 'booked' && (
                      <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700 text-center font-medium">
                          Booking confirmed for Dec 15, 2024
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (activeTab !== 'booked') {
                          navigate(`/client/selection?artisanId=${artisan.id}`);
                        }
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                        activeTab === 'booked'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {getButtonText(activeTab)}
                    </button>
                  </div>
                </div>
              ))
            : services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  {/* Header with Actions */}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-semibold text-gray-900 flex-1 pr-2">
                      {service.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Service Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="text-gray-700 font-medium">
                        {service.estimatedDuration}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm items-center">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                          service.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rating:</span>
                      <span className="text-gray-700 font-medium">
                        {service.rating ?? 0}/5
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-blue-600 font-bold text-lg mb-3">
                    ₦{Number(service.price).toLocaleString()}
                  </div>

                  {/* Book Service Button */}
                  <button
                    onClick={() => {
                      // Navigate to service booking page
                      navigate(`/client/book-service?serviceId=${service.id}`);
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Book Service
                  </button>
                </div>
              ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && (
        (resultType === 'artisan' && getCurrentArtisans().length === 0) ||
        (resultType === 'service' && services.length === 0)
        ) && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {resultType === 'artisan' ? <Users className="w-16 h-16 mx-auto" /> : <Cog className="w-16 h-16 mx-auto" />}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {resultType === 'artisan' ? 'No artisans found' : 'No services available'}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'booked' 
              ? "You haven't booked any artisans yet."
              : "No artisans/services available at the moment."}
          </p>
        </div>
      )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex gap-3 text-sm text-gray-700">
              <label htmlFor="perPage">Per Page</label>
              <select
                name="perPage"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when perPage changes
                }}
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
                <option value={18}>18</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ClientHome;