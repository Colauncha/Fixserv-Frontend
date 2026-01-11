import React, { useState } from "react";
import upload from "../../../assets/client images/client-home/referal part/upload.png";

const RequestRepair = () => {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">

      <section className="w-full flex align-center justify-center py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-xl font-semibold mb-1">Request Repair</h1>
            <p className="text-sm text-gray-500">
              Tell us what needs fixing and we’ll connect you with the right technician for the job.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl space-y-5">

            {["Device Type", "Device Brand", "Device Model", "Location", "Service Required"].map((item) => (
              <input
                key={item}
                type="text"
                placeholder={item}
                className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            ))}

            {/* Upload */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Upload image of Damaged Device
              </p>

              <label className="border-2 border-dashed border-gray-300 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition hover:border-blue-400">

                {preview ? (
                  <img src={preview} className="max-h-full object-contain" />
                ) : (
                  <>
                    <img src={upload} className="w-10 mb-3 opacity-70" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>

            {/* Issue & Notes */}
            <div className="mt-8 space-y-5 max-w-3xl">

              <textarea
                rows={5}
                placeholder="Issue Description"
                className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              <textarea
                rows={3}
                placeholder="Additional Notes"
                className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition"
                >
                  Continue
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default RequestRepair;
