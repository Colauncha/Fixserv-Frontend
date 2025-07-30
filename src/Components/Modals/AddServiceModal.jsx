import { useState } from 'react';
import { Cog, ExternalLink, X, DollarSign, Clock, FileText, Tag } from "lucide-react";
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import Loader from '../../assets/Loaders/Loader';

const AddServiceModal = ({ closeModal, updateParent }) => {
  const [serviceData, setServiceData] = useState({
    title: '',
    description: '',
    price: 0,
    estimatedDuration: '',
    rating: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { state } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!serviceData.title.trim()) {
      newErrors.title = 'Service title is required';
    }
    
    if (!serviceData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!serviceData.price || serviceData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!serviceData.estimatedDuration.trim()) {
      newErrors.estimatedDuration = 'Estimated duration is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, success } = await Fetch({
        url: `${import.meta.env.VITE_API_SERVICE_URL}/service/createService`,
        requestData: serviceData,
        token: state.token,
        method: 'POST',
      });

      console.log('success?' + success, data);
      if (success) {
        updateParent(prev => (
          [...prev, data]
        ));
        closeModal();
      }
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = serviceData.title && serviceData.description && serviceData.price > 0 && serviceData.estimatedDuration;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="relative z-10 bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cog className='w-5 h-5 text-blue-600'/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Service</h2>
              <p className="text-sm text-gray-600">Create a new service offering</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Service Title */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                <Tag className="w-4 h-4 text-blue-600" />
                Service Title
              </label>
              <input
                type="text"
                name="title"
                value={serviceData.title}
                onChange={handleChange}
                className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="e.g., Phone Screen Repair, AC Installation"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Price and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Price (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    name="price"
                    value={serviceData.price || ''}
                    onChange={handleChange}
                    className={`w-full p-4 pl-8 border rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Estimated Duration
                </label>
                <input
                  type="text"
                  name="estimatedDuration"
                  value={serviceData.estimatedDuration}
                  onChange={handleChange}
                  className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.estimatedDuration ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="e.g., 2-3 hours, 1 day"
                />
                {errors.estimatedDuration && (
                  <p className="mt-2 text-sm text-red-600">{errors.estimatedDuration}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 text-purple-600" />
                Service Description
              </label>
              <textarea
                name="description"
                value={serviceData.description}
                rows={4}
                onChange={handleChange}
                className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Describe your service in detail. What do you offer? What makes it special?"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                {serviceData.description.length}/500 characters
              </p>
            </div>

            {/* Service Preview */}
            {isFormValid && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Service Preview</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h5 className="font-semibold text-gray-900 mb-1">{serviceData.title}</h5>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{serviceData.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration: {serviceData.estimatedDuration}</span>
                    <span className="text-blue-600 font-bold">₦{Number(serviceData.price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isFormValid ? (
                <span className="text-green-600 font-medium">✓ Ready to create service</span>
              ) : (
                <span>Please fill in all required fields</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader otherStyles={'text-white'} size={'4'} />
                    Creating...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Create Service
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;