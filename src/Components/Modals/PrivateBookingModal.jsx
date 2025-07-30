import { useState, useEffect} from 'react';
import { getIdentity } from '../../Auth/tokenStorage';
import { ExternalLink, GitPullRequestCreateArrow, Plus, X, Cog, Package, Check, Edit2, Trash2 } from "lucide-react";
import useAuth from '../../Auth/useAuth';
import { useNavigate } from 'react-router-dom';

const PrivateBookingModal = ({ closeModal, artisanId }) => {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitData, setSubmitData] = useState({
    serviceId: "",
    itemId: ""
  });
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = getIdentity();
        console.log('Stored User:', storedUser);
        if (storedUser) {
          setItems(storedUser.uploadedProducts || []);
        } else {
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`https://service-management-1tz6.onrender.com/api/service/artisan/${artisanId}`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [artisanId, state]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSubmitData({ ...submitData, serviceId: service.id });
  };

  const handleItemSelect = (item, index) => {
    setSelectedItem(index);
    setSubmitData({ ...submitData, itemId: item.id });
  };

  const handleSubmit = async () => {
    if (!submitData.serviceId || !submitData.itemId) {
      alert('Please select both a service and an item');
      return;
    }

    try {
      const response = await fetch(`https://order-management-hm08.onrender.com/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit repair request');
      }

      const data = await response.json();
      console.log('Repair request submitted successfully:', data);
      closeModal();
    } catch (error) {
      console.error('Error submitting repair request:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative z-10 bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GitPullRequestCreateArrow className='w-5 h-5 text-blue-600'/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Repair Request</h2>
              <p className="text-sm text-gray-600">Select a service and item to get started</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Services Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Cog className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Available Services</h3>
            </div>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`relative bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all cursor-pointer ${
                      selectedService?.id === service.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Selection Indicator */}
                    {selectedService?.id === service.id && (
                      <div className="absolute top-3 right-3 p-1 bg-blue-500 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div className="mb-3">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">{service.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                    </div>

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
                          {service.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-gray-700 font-medium">{service.rating ?? 4.5}/5</span>
                      </div>
                    </div>

                    <div className="text-blue-600 font-bold text-lg">
                      ₦{Number(service.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Cog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No services available from this artisan.</p>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Select Item to Repair</h3>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemSelect(item, index)}
                    className={`relative group cursor-pointer ${
                      selectedItem === index ? 'ring-2 ring-purple-500 ring-offset-2' : ''
                    }`}
                  >
                    <div className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all duration-300 h-[140px] flex flex-col ${
                      selectedItem === index ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}>
                      {/* Selection Indicator */}
                      {selectedItem === index && (
                        <div className="absolute top-2 right-2 p-1 bg-purple-500 rounded-full z-10">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}

                      {/* Image Container */}
                      <div className="flex-1 flex items-center justify-center mb-2">
                        <img
                          src={item.imageUrl}
                          alt="Item to repair"
                          className="max-w-full max-h-20 object-cover rounded"
                        />
                      </div>
                      
                      {/* Upload Date */}
                      <div className="text-xs text-gray-500 text-center">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center">
                        <div className="text-xs text-gray-500 mb-2">
                          Uploaded: {new Date(item.uploadedAt).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-4">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Item Card */}
                <div className="relative group">
                  <div
                    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border-2 border-dashed border-purple-200 p-3 hover:border-purple-300 transition-colors cursor-pointer h-[140px] flex flex-col items-center justify-center"
                    onClick={() => navigate("/client/dashboard")}
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-2">
                      <Plus className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">Add Item</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No items uploaded yet.</p>
                <button
                  onClick={() => navigate("/client/dashboard")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-xl shadow-lg hover:opacity-80 hover:shadow-xl hover:scale-105 transition-transform"
                >
                  <Plus className="inline mr-2 w-4 h-4" />
                  Upload Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedService && selectedItem !== null ? (
                <span className="text-green-600 font-medium">✓ Ready to submit</span>
              ) : (
                <span>Please select a service and item</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedService || selectedItem === null}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ExternalLink className="w-4 h-4" />
              Submit Repair Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateBookingModal;