import { useState, useEffect, useRef } from 'react';
import { getIdentity } from '../../Auth/tokenStorage';
import {
  ExternalLink,
  GitPullRequestCreateArrow,
  Plus,
  X,
  Cog,
  Package,
  Check,
  Tag,
  FileText,
  Camera,
  Upload,
  Trash2,
  Wallet2,
} from 'lucide-react';
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import Loader from '../../assets/Loaders/Loader';
import { toast } from 'react-toastify';

const PrivateBookingModal = ({
  closeModal,
  artisanId,
  rootPageSelectedService,
}) => {
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitData, setSubmitData] = useState({
    serviceId: '',
    uploadedProductId: '',
  });

  // Item related
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemErrors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [itemLoading, setItemLoading] = useState(false);
  const [itemData, setItemData] = useState({
    itemName: '',
    description: '',
  });
  const fileInputRef = useRef(null);

  // Wallet
  const [wallet, setWallet] = useState({
    balance: 0,
    lockedBalance: 0,
  });

  // Misc
  const [loading, setLoading] = useState(false);
  const { state } = useAuth();

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
        const response = await fetch(
          `${
            import.meta.env.VITE_API_SERVICE_URL
          }/service/artisan/${artisanId}`,
          {
            method: 'GET',
            headers: {
              'content-type': 'application/json',
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchWalletBalance = async () => {
      // Fetch wallet balance
      const user = getIdentity();
      const { data: walletResp, error: walletErr } = await Fetch({
        url: `${import.meta.env.VITE_API_WALLET_URL}/wallet/get-balance/${
          user.id || user._id
        }`,
      });

      if (walletErr) throw new Error(walletErr);

      setWallet(walletResp.data);
    };

    fetchServices();
    fetchWalletBalance();
  }, [artisanId, state]);

  useEffect(() => {
    console.log(rootPageSelectedService);
    if (rootPageSelectedService) {
      setSelectedService(rootPageSelectedService);
      return;
    }
  }, [rootPageSelectedService]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setSubmitData({ ...submitData, serviceId: service.id });
  };

  // Items
  const handleItemSelect = (item, index) => {
    setSelectedItem(index);
    setSubmitData({ ...submitData, uploadedProductId: item.id });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (itemErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const showAddItemForm = () => {
    setShowItemForm(true);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setProductImage(null);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  // Images
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'Please select a valid image file',
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 5MB',
        }));
        return;
      }

      setProductImage(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageChange({ target: { files: [file] } });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!submitData.serviceId || !submitData.uploadedProductId) {
      toast.warn('Please select both a service and an item');
      return;
    }

    try {
      const { data, success } = await Fetch({
        url: `${import.meta.env.VITE_API_ORDER_URL}/orders/create`,
        method: 'POST',
        token: state.token,
        requestData: submitData,
      });

      if (!success) {
        throw new Error(data.error || 'Failed to submit repair request');
      }

      console.log('Repair request submitted successfully:', data);
      toast.success('Repair request submitted successfully');
      closeModal();
    } catch (error) {
      toast.error(`${error}`);
      console.error('Error submitting repair request:', error);
    } finally {
      setLoading(false);
    }
  };

  const closeItemsForm = () => {
    setShowItemForm(false);
    setItemData({
      itemName: '',
      description: '',
    });
    setProductImage(null);
    setErrors({});
  };

  const handleItemSubmit = async () => {
    setItemLoading(true);
    const formData = new FormData();
    formData.append('description', itemData.description);
    formData.append('productImage', productImage);
    formData.append('objectName', itemData.itemName);

    const user = getIdentity();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload/${
          user._id || user.id
        }/upload-products`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload item');
      }

      const data = await response.json();
      console.log('Item uploaded successfully:', data);
      toast.success('Item uploaded successfully');
      closeItemsForm();
      setItems(data.user.uploadedProducts || []);
    } catch (error) {
      console.error('Error uploading item:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to upload item. Please try again.',
      }));
    } finally {
      setItemLoading(false);
    }
  };

  const isFormValid = itemData.itemName && itemData.description && productImage;

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
              <GitPullRequestCreateArrow className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Create Request
              </h2>
              <p className="text-sm text-gray-600">
                Select a service and item to get started
              </p>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-2">
              <Wallet2 className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Wallet balance:
              </h3>
              <span>{formatPrice(wallet.balance)}</span>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Cog className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Available Services
              </h3>
            </div>

            {services.length > 0 ? (
              <div className="max-h-80 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {service.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    </div>

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
                          {service.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-gray-700 font-medium">
                          {service.rating ?? 4.5}/5
                        </span>
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
                <p className="text-gray-600">
                  No services available from this artisan.
                </p>
              </div>
            )}
          </div>

          {/* Items Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-2 md:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Select Item</h3>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemSelect(item, index)}
                    className={`relative group cursor-pointer ${
                      selectedItem === index
                        ? 'ring-2 ring-purple-500 ring-offset-2'
                        : ''
                    }`}
                  >
                    <div
                      className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all duration-300 h-[140px] flex flex-col ${
                        selectedItem === index
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200'
                      }`}
                    >
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
                          Uploaded:{' '}
                          {new Date(item.uploadedAt).toLocaleDateString()}
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
                    onClick={showAddItemForm}
                  >
                    <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-2">
                      <Plus className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      Add Item
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No items uploaded yet.</p>
                <button
                  onClick={showAddItemForm}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-xl shadow-lg hover:opacity-80 hover:shadow-xl hover:scale-105 transition-transform"
                >
                  <Plus className="inline mr-2 w-4 h-4" />
                  Upload Item
                </button>
              </div>
            )}
            {/* add items */}
            <div
              className={`px-2 py-6 md:p-6 overflow-y-auto flex-1 ${
                showItemForm ? '' : 'hidden'
              }`}
            >
              <div className="space-y-6">
                {/* Item Name */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={itemData.itemName}
                    onChange={handleItemChange}
                    className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      itemErrors.itemName
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="e.g., iPhone 12, Samsung TV, MacBook Pro"
                  />
                  {itemErrors.itemName && (
                    <p className="mt-2 text-sm text-red-600">
                      {itemErrors.itemName}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-green-600" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={itemData.description}
                    rows={4}
                    onChange={handleItemChange}
                    className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      itemErrors.description
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Describe the issue with your item. What's broken? What needs to be fixed?"
                  />
                  {itemErrors.description && (
                    <p className="mt-2 text-sm text-red-600">
                      {itemErrors.description}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    {itemData.description.length}/500 characters
                  </p>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                    <Camera className="w-4 h-4 text-orange-600" />
                    Item Photo
                  </label>
                  <div
                    className={`relative flex items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : itemErrors.image
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onClick={handleImageClick}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {productImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(productImage)}
                          alt="Product preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {(productImage.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Upload className="w-8 h-8" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {dragActive
                                ? 'Drop image here'
                                : 'Click to upload or drag & drop'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, JPEG up to 5MB
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {itemErrors.image && (
                    <p className="mt-2 text-sm text-red-600">
                      {itemErrors.image}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {itemErrors.submit && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600">{itemErrors.submit}</p>
                  </div>
                )}

                {/* Items Footer */}
                <div className="px-2 md:px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="hidden md:block text-sm text-gray-600">
                      {isFormValid ? (
                        <span className="text-green-600 font-medium">
                          ✓ Ready to upload item
                        </span>
                      ) : (
                        <span>Please fill in all required fields</span>
                      )}
                    </div>
                    <div className="flex w-full justify-between md:w-2/3 md:justify-end gap-3 text-xs md:text-md">
                      <button
                        onClick={closeItemsForm}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleItemSubmit}
                        disabled={!isFormValid || loading}
                        className="flex items-center gap-1 md:gap-2 px-2 md:px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-xs md:text-md text-white rounded-2xl md:rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {itemLoading ? (
                          <Loader otherStyles={'text-white'} size={'7'} />
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            Upload Item
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs md:text-md text-wrap text-gray-600">
              {selectedService && selectedItem !== null ? (
                <span className="text-green-600 font-medium">
                  ✓ Ready to submit
                </span>
              ) : (
                <span>Please select a service and item</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedService || selectedItem === null}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs md:text-md rounded-2xl md:rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <Loader otherStyles={'text-white'} size={'7'} />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateBookingModal;
