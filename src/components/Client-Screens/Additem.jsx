import React from "react";
import addrepair from "../../assets/client images/addrepair.png";
import item from "../../assets/client images/item.png";
import description from "../../assets/client images/description.png";
import itemphoto from "../../assets/client images/itemphoto.png";
import upload from "../../assets/client images/upload.png";

const Additem = () => {
  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={addrepair} alt="add" className="w-6 h-6" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Add Repair Item
                </h3>
                <p className="text-xs text-gray-500">
                  Upload an item that needs repair
                </p>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600 text-lg">
              ×
            </button>
          </div>

          {/* Item Name */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
              <img src={item} alt="item" className="w-4 h-4" />
              Item Name
            </label>
            <input
              type="text"
              placeholder="e.g., iPhone 12, Samsung TV, MacBook Pro"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-1">
              <img src={description} alt="description" className="w-4 h-4" />
              Description
            </label>
            <textarea
              rows="4"
              placeholder="Describe the issue with your item. What's broken? What needs to be fixed?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">0/500 characters</p>
          </div>

          {/* Item Photo */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-xs text-gray-700 mb-2">
              <img src={itemphoto} alt="photo" className="w-4 h-4" />
              Item Photo
            </label>

            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <img src={upload} alt="upload" className="w-8 h-8 opacity-60" />
                <p className="text-xs text-gray-500">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mb-4">
            Please fill in all required fields
          </p>

          <button className="w-full bg-[#3E83C4] hover:bg-blue-600 text-white text-sm py-2 rounded-md mb-3 transition">
            Upload Item
          </button>

          <button className="w-full text-xs text-blue-500 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Additem;
