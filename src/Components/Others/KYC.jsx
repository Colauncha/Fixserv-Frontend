import { useState, useEffect } from "react";
import { getIdentity } from "../../Auth/tokenStorage";

const KYC_Client = () => {
  const [role, setRole] = useState("CLIENT");
  const [formData, setFormData] = useState({
    documentType: "",
    documentId: "",
  });

  useEffect(() => {
    const identity = getIdentity();
    if (identity) {
      setRole(identity.role || "client");
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API request logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 md:p-16">
      <div className="rounded-lg w-full mb-10 p-8">
        {/* Lock Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-10 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m6-6V9a6 6 0 10-12 0v2m12 0H6m12 0a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h12z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-4">
          {role} KYC Verification
        </h2>
        <p className="text-gray-700 text-center text-lg mb-6">
          Enter the details below to retrieve your KYC session or check <br/> your
          verification status
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* KYC Reference ID */}
          <div className="text-gray-400">
            <label className="block text-md font-medium text-gray-900">
             Document type
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
            //   placeholder="Select KYC option"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select KYC option</option>
              <option value="KYC12345">KYC-1</option>
              <option value="KYC12345">KYC-2</option>
              <option value="KYC67890">KYC-3</option>
              <option value="KYC67890">KYC-4</option>
            </select>
          </div>
          {/* Email/Phone */}
          <div>
            <label className="block text-md font-medium text-gray-900">
              ID number
            </label>
            <input
              type="text"
              name="documentId"
              value={formData.documentId}
              onChange={handleChange}
              placeholder="Enter your registered email or phone number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-4 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center text-md">
            <button
            type="submit"
            className="w-70 items-center justify-center text-center bg-[#7A9DF7] text-white py-3 px-6 mt-10 rounded-md hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Document
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYC_Client;
