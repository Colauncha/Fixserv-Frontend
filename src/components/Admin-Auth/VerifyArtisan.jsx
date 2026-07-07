import React, { useEffect, useState } from "react";
import exportImg from "../../assets/Admin Images/export.png";
import mark from "../../assets/Admin Images/mark.png";
import eye from "../../assets/Admin Images/preview.png";
import request from "../../assets/Admin Images/request.png";
import { getAuthToken } from "../../utils/auth";

const VerifyArtisan = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingCertificates = async () => {
    try {
      setLoading(true);

      const token = getAuthToken();

      const BASE_URL = 'https://user-api.fixserv.co'

      const response = await fetch(
  `${BASE_URL}/api/certificate/admin/certificates/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {
        setArtisans(data.artisans || []);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCertificates();
  }, []);

  const handleReviewCertificate = async (
    artisanId,
    certificateId,
    status
  ) => {
    try {
      const token = getAuthToken();

      let payload = {
        status,
      };

      // REJECTION REASON
      if (status === "REJECTED") {
        const reason = prompt("Enter rejection reason");

        if (!reason) return;

        payload.rejectionReason = reason;
      }

      const BASE_URL = 'https://user-api.fixserv.co'

      const response = await fetch(
  `${BASE_URL}/api/certificate/admin/artisan/${artisanId}/certificates/${certificateId}/review`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }
);

      const data = await response.json();

      console.log(data);

      if (data.success) {
        alert(
          status === "APPROVED"
            ? "Certificate approved successfully"
            : "Certificate rejected successfully"
        );

        fetchPendingCertificates();
      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full bg-white">
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Verify Artisans
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Review and approve artisan applications
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* <select className="border border-gray-300 text-sm px-3 py-2 bg-white rounded-md">
                <option>Sort by</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select> */}

              {/* <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm rounded-md">
                <img
                  src={exportImg}
                  alt="export"
                  className="w-4 h-4"
                />
                Export
              </button> */}
            </div>
          </div>

          {/* Search */}
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search artisans..."
              className="border border-blue-300 focus:border-blue-500 outline-none px-4 py-2 text-sm w-full sm:w-72 rounded-lg"
            />
          </div>

          {/* Table */}
         {/* Table */}
<div className="border border-gray-200 rounded-xl overflow-x-auto">

  {/* Header */}
  <div className="min-w-[1100px]">

    <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-medium">
      <div className="col-span-3">
        Artisan
      </div>

      <div className="col-span-3">
        Email
      </div>

      <div className="col-span-1">
        Certificate
      </div>

      <div className="col-span-1">
        Type
      </div>

      <div className="col-span-1">
        Uploaded
      </div>

      <div className="col-span-1 text-center">
        Actions
      </div>
    </div>

    {/* Loading */}
    {loading && (
      <div className="p-6 text-sm text-gray-500">
        Loading pending certificates...
      </div>
    )}

    {/* Empty */}
    {!loading && artisans.length === 0 && (
      <div className="p-6 text-sm text-gray-500">
        No pending certificates found
      </div>
    )}

    {/* Rows */}
    {!loading &&
      artisans.map((artisan) =>
        artisan.pendingCertificates?.map((certificate) => (
          <div
            key={certificate.id}
            className="grid grid-cols-12 px-5 py-4 border-b border-gray-100 text-sm items-center min-w-[1100px]"
          >

            {/* Artisan */}
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center flex-shrink-0">
                {artisan.artisanName?.slice(0, 2).toUpperCase()}
              </div>

              <span className="text-gray-900 font-medium truncate">
                {artisan.artisanName}
              </span>
            </div>

            {/* Email */}
            <div className="col-span-3 text-gray-600 text-xs break-words pr-2">
              {artisan.artisanEmail}
            </div>

            {/* Certificate */}
            <div className="col-span-1 text-gray-700 break-words">
              {certificate.name}
            </div>

            {/* File Type */}
            <div className="col-span-1">
              <span className="text-xs px-2 py-1 border border-gray-300 rounded-md whitespace-nowrap">
                {certificate.fileType}
              </span>
            </div>

            {/* Upload Date */}
            <div className="col-span-1 text-xs text-gray-500 whitespace-nowrap">
              {new Date(
                certificate.uploadedAt
              ).toLocaleDateString()}
            </div>

            {/* Actions */}
            <div className="col-span-3 flex flex-wrap justify-center gap-2">

              {/* Preview */}
              <a
                href={certificate.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs border border-gray-300 px-3 py-2 rounded-md whitespace-nowrap hover:bg-gray-50"
              >
                <img
                  src={eye}
                  alt="preview"
                  className="w-3 h-3"
                />
                Preview
              </a>

              {/* Approve */}
              <button
                onClick={() =>
                  handleReviewCertificate(
                    artisan.artisanId,
                    certificate.id,
                    "APPROVED"
                  )
                }
                className="flex items-center gap-1 text-xs bg-[#3E83C4] text-white px-3 py-2 rounded-md whitespace-nowrap cursor-pointer"
              >
                <img
                  src={mark}
                  alt="approve"
                  className="w-3 h-3"
                />
                Approve
              </button>

              {/* Reject */}
              <button
                onClick={() =>
                  handleReviewCertificate(
                    artisan.artisanId,
                    certificate.id,
                    "REJECTED"
                  )
                }
                className="flex items-center gap-1 text-xs bg-red-500 text-white px-3 py-2 rounded-md whitespace-nowrap cursor-pointer"
              >
                <img
                  src={request}
                  alt="reject"
                  className="w-3 h-3"
                />
                Reject
              </button>

            </div>
          </div>
        ))
      )}
  </div>
</div>

        </div>
      </section>
    </div>
  );
};

export default VerifyArtisan;