import React, { useRef, useState } from "react";
import upload from "../../assets/Artisan Images/Vector.png";
import doc from "../../assets/Artisan Images/doc.png";
import cancel from "../../assets/Artisan Images/cancel.png";
import check from "../../assets/Artisan Images/check.png";
import { useNavigate } from "react-router-dom";

const UploadCertificate = () => {

    const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([
    {
      name: "Artisan - Certificate - 2025.pdf",
      size: null,
      progress: 70,
      uploading: true,
    },
    {
      name: "Official - License - Scan.jpg",
      size: "2.8mb",
      progress: 100,
      uploading: false,
    },
  ]);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-8">

        {/* Section label */}
        <span className="text-lg text-[#3E83C4] font-medium">
          Skill Certificate
        </span>

        {/* Title */}
        <h2 className="text-3xl font-bold text-black mt-4 mb-2">
          Upload Your Skill Certificate
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-10 max-w-2xl">
          Please upload a clear copy of your official skill certificate or
          license to complete your profile verification
        </p>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <img src={upload} alt="Upload" className="w-9 h-8" />
            </div>
          </div>

          <h4 className="text-lg font-medium text-black mb-1">
            Drag or drop your file here
          </h4>
          <p className="text-sm text-gray-500 mb-6">
            or click to browse
          </p>

          <button
            onClick={handleBrowseClick}
            className="bg-[#3E83C4] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Browse Files
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>

        {/* Accepted formats */}
        <p className="text-xs text-center text-gray-500 mt-4">
          Accepted formats: PDF, JPG, PNG, Max size: 5MB.
        </p>

        {/* Uploaded Files */}
        <div className="mt-10 space-y-5">
          {files.map((file, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-5 flex items-start justify-between"
            >
              <div className="flex items-start gap-4 w-full">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <img
                    src={file.uploading ? doc : check}
                    alt=""
                    className="w-5"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-black">
                      {file.name}
                    </p>
                    <img
                      src={cancel}
                      alt="remove"
                      className="w-4 cursor-pointer"
                    />
                  </div>

                  {file.uploading ? (
                    <>
                      <p className="text-sm text-gray-500 mt-1">
                        Uploading...
                        <span className="float-right text-black font-medium">
                          {file.progress}%
                        </span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-[#3E83C4] h-2 rounded-full"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {file.size}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-6 mt-12">
          <button className="text-black cursor-pointer font-medium">
            Save & Exit
          </button>
          <button onClick={() => navigate("/certificate-received")} className="bg-[#3E83C4] hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium cursor-pointer transition">
            Submit & Continue
          </button>
        </div>

        {/* Help */}
        <a href="" className="text-center text-sm text-gray-600 mt-16">
          Need Help?
        </a>
      </div>
    </div>
  );
};

export default UploadCertificate;
