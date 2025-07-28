import { useState, useRef } from 'react';
import { getIdentity } from '../../Auth/tokenStorage';
import { PackagePlus, PlusIcon, ExternalLink } from "lucide-react";
import useAuth from '../../Auth/useAuth';

const AddItemModal = ({ closeModal }) => {
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const { state } = useAuth();
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('productImage', productImage);

    const user = getIdentity();

    console.log(formData);

    try {
      const response = await fetch(`https://user-management-h4hg.onrender.com/api/upload/${user._id || user.id}/upload-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
        },
        body: formData,
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
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 opacity-80"
        onClick={closeModal}
      ></div>

      <div className="relative z-10 bg-white w-[90vw] max-w-2xl h-[80vh] rounded-xl shadow-lg flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b-1 border-gray-200">
          <PackagePlus className='w-5 h-5'/>
          <h2 className="text-lg font-semibold text-gray-800">Add Repair Item</h2>
          <button
            onClick={closeModal}
            className="text-2xl text-gray-600 hover:text-gray-800 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          {/* Item Name */}
          <div>
            <label htmlFor="itemName" className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
            <input
              type="text"
              name="itemName"
              id="itemName"
              className="w-full p-2 border border-gray-300 text-sm shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter item name"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 text-sm shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter item description"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label htmlFor="productImage" className="block mb-2 text-sm font-medium text-gray-700">Photo</label>
            <div
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
              onClick={handleImageClick}
            >
              {productImage ? (
                <div className="w-full h-full relative">
                  <img
                    src={URL.createObjectURL(productImage)}
                    alt="Product"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <span
                    onClick={() => setProductImage(null)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition"
                    title="Remove Image"
                  >
                    &times;
                  </span>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    name="productImage"
                    id="productImage"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    onDrop={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <PlusIcon className="w-6 h-6" />
                    <span className="text-xs">Click to upload image</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-xl text-sm font-medium transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:shadow-xl hover:scale-[1.02]"
            >
              <ExternalLink className="w-5 h-5" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
