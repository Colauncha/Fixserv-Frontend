import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../assets/Artisan Images/Vector.png";
import doc from "../../assets/Artisan Images/doc.png";
import cancel from "../../assets/Artisan Images/cancel.png";
import check from "../../assets/Artisan Images/check.png";
import pending from "../../assets/Artisan Images/pending.png";

const Verification = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("upload"); // upload | received
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      {/* ===================== UPLOAD SCREEN ===================== */}
      {screen === "upload" && (
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8">

          <span className="text-lg text-[#3E83C4] font-medium">
            Skill Certificate
          </span>

          <h2 className="text-3xl font-bold mt-4 mb-2">
            Upload Your Skill Certificate
          </h2>

          <p className="text-gray-600 mb-10">
            Please upload a clear copy of your official skill certificate or
            license to complete your profile verification
          </p>

          <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <img src={upload} className="w-9 h-8" />
              </div>
            </div>

            <h4 className="text-lg font-medium mb-1">
              Drag or drop your file here
            </h4>
            <p className="text-sm text-gray-500 mb-6">or click to browse</p>

            <button
              onClick={handleBrowseClick}
              className="bg-[#3E83C4] text-white px-6 py-3 rounded-lg font-medium"
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

          <p className="text-xs text-center text-gray-500 mt-4">
            Accepted formats: PDF, JPG, PNG, Max size: 5MB.
          </p>

          <div className="mt-10 space-y-5">
            {files.map((file, index) => (
              <div
                key={index}
                className="border rounded-lg p-5 flex items-start justify-between"
              >
                <div className="flex gap-4 w-full">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <img src={file.uploading ? doc : check} className="w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{file.name}</p>
                      <img src={cancel} className="w-4 cursor-pointer" />
                    </div>

                    {file.uploading ? (
                      <>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading...
                          <span className="float-right font-medium">
                            {file.progress}%
                          </span>
                        </p>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                          <div
                            className="bg-[#3E83C4] h-2 rounded-full"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">{file.size}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-6 mt-12">
            <button className="font-medium">Save & Exit</button>
            <button
              onClick={() => setScreen("received")}
              className="bg-[#3E83C4] text-white px-8 py-3 rounded-lg"
            >
              Submit & Continue
            </button>
          </div>
        </div>
      )}

      {/* ===================== RECEIVED / PENDING SCREEN ===================== */}
      {screen === "received" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">

            <div className="flex justify-center mb-6">
              <img src={pending} className="w-20 h-20" />
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              We've Received Your Certificate
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-8">
              Your skill certificate is currently being reviewed by our team to
              ensure it meets our quality standards.
              <br /><br />
              <span className="font-medium text-gray-700">
                Estimated review time:
              </span>{" "}
              24 – 48 hours.
            </p>

            <button
              onClick={() => navigate("/artisan")}
              className="w-full bg-[#3E83C4] text-white py-3 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Verification;
