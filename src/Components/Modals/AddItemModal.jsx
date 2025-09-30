// import { useState, useRef } from 'react';
// import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
// import { PackagePlus, PlusIcon, ExternalLink } from "lucide-react";
// import useAuth from '../../Auth/useAuth';

// const AddItemModal = ({ closeModal, updateRef }) => {
//   const [description, setDescription] = useState("");
//   const [productImage, setProductImage] = useState(null);
//   const { state } = useAuth();
//   const fileInputRef = useRef(null);

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProductImage(file);
//     }
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append('description', description);
//     formData.append('productImage', productImage);

//     const user = getIdentity();

//     console.log(formData);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/${user._id || user.id}/upload-products`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to submit repair request');
//       }

//       const data = await response.json();
//       console.log('Repair request submitted successfully:', data);
//       setIdentity(data.user)
//       closeModal();
//       updateRef.current = true;
//     } catch (error) {
//       console.error('Error submitting repair request:', error);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//         onClick={closeModal}
//       ></div>

//       <div className="relative z-10 bg-white w-[90vw] max-w-2xl h-[80vh] rounded-xl shadow-lg flex flex-col">
//         <div className="flex justify-between items-center px-6 py-4 border-b-1 border-gray-200">
//           <PackagePlus className='w-5 h-5'/>
//           <h2 className="text-lg font-semibold text-gray-800">Add Repair Item</h2>
//           <button
//             onClick={closeModal}
//             className="text-2xl text-gray-600 hover:text-gray-800 transition"
//           >
//             &times;
//           </button>
//         </div>

//         <div className="p-6 overflow-y-auto flex flex-col gap-4">
//           {/* Item Name */}
//           <div>
//             <label htmlFor="itemName" className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
//             <input
//               type="text"
//               name="itemName"
//               id="itemName"
//               className="w-full p-2 border border-gray-300 text-sm shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//               placeholder="Enter item name"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
//             <textarea
//               name="description"
//               id="description"
//               rows={5}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-2 border border-gray-300 text-sm shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
//               placeholder="Enter item description"
//             />
//           </div>

//           {/* Photo Upload */}
//           <div>
//             <label htmlFor="productImage" className="block mb-2 text-sm font-medium text-gray-700">Photo</label>
//             <div
//               className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
//               onClick={handleImageClick}
//             >
//               {productImage ? (
//                 <div className="w-full h-full relative">
//                   <img
//                     src={URL.createObjectURL(productImage)}
//                     alt="Product"
//                     className="w-full h-full object-contain rounded-lg"
//                   />
//                   <span
//                     onClick={() => setProductImage(null)}
//                     className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
//                     title="Remove Image"
//                   >
//                     &times;
//                   </span>
//                 </div>
//               ) : (
//                 <>
//                   <input
//                     type="file"
//                     name="productImage"
//                     id="productImage"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     onDrop={handleImageChange}
//                     accept="image/*"
//                     className="hidden"
//                   />
//                   <div className="flex flex-col items-center gap-1 text-gray-500">
//                     <PlusIcon className="w-6 h-6" />
//                     <span className="text-xs">Click to upload image</span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end mt-6">
//             <button
//               onClick={handleSubmit}
//               className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-xl text-sm font-medium transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-[1.02]"
//             >
//               <ExternalLink className="w-5 h-5" />
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddItemModal;

import { useState, useRef } from 'react';
import { getIdentity, setIdentity } from '../../Auth/tokenStorage';
import { PackagePlus, Plus, ExternalLink, X, Tag, FileText, Camera, Upload, Trash2 } from "lucide-react";
import useAuth from '../../Auth/useAuth';

const AddItemModal = ({ closeModal, updateParent }) => {
  const [itemData, setItemData] = useState({
    itemName: '',
    description: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const { state } = useAuth();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setProductImage(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!itemData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    
    if (!itemData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!productImage) {
      newErrors.image = 'Please upload an image of the item';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
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
      setIdentity(data.user);
      closeModal();
      updateParent(prev => (
        [...prev, data.product]
      ));
    } catch (error) {
      console.error('Error uploading item:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to upload item. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setProductImage(null);
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const isFormValid = itemData.itemName && itemData.description && productImage;

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
            <div className="p-2 bg-purple-100 rounded-lg">
              <PackagePlus className='w-5 h-5 text-purple-600'/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Repair Item</h2>
              <p className="text-sm text-gray-600">Upload an item that needs repair</p>
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
                onChange={handleChange}
                className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.itemName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="e.g., iPhone 12, Samsung TV, MacBook Pro"
              />
              {errors.itemName && (
                <p className="mt-2 text-sm text-red-600">{errors.itemName}</p>
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
                onChange={handleChange}
                className={`w-full p-4 border rounded-xl text-sm shadow-sm transition-all resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Describe the issue with your item. What's broken? What needs to be fixed?"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
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
                    : errors.image 
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
                          {dragActive ? 'Drop image here' : 'Click to upload or drag & drop'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Item Preview */}
            {isFormValid && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Item Preview</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={URL.createObjectURL(productImage)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">{itemData.itemName}</h5>
                      <p className="text-sm text-gray-600 line-clamp-2">{itemData.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isFormValid ? (
                <span className="text-green-600 font-medium">✓ Ready to upload item</span>
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
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
  );
};

export default AddItemModal;