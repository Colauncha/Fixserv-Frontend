// import React, { useEffect, useMemo, useState } from "react";
// import ArtisanHeader from "../Artisan Pages/ArtisanHeader";
// import { useAuth } from "../../context/AuthContext";

// const STATUS_STYLES = {
//   PENDING: "bg-yellow-100 text-yellow-700",
//   APPROVED: "bg-green-100 text-green-700",
//   REJECTED: "bg-red-100 text-red-700",
// };

// const STATUS_ORDER = {
//   APPROVED: 1,
//   PENDING: 2,
//   REJECTED: 3,
// };

// const getUserFriendlyError = (err, fallback = "Something went wrong. Please try again.") => {
//   const msg = String(err?.message || "").toLowerCase();

//   if (msg.includes("failed to fetch") || msg.includes("network")) {
//     return "Network error. Please check your internet connection and try again.";
//   }

//   if (msg.includes("401") || msg.includes("unauthorized")) {
//     return "Session expired. Please login again.";
//   }

//   if (msg.includes("403")) {
//     return "You do not have permission to perform this action.";
//   }

//   if (msg.includes("404")) {
//     return "Requested certificate was not found.";
//   }

//   if (msg.includes("405")) {
//     return "This action is not allowed right now.";
//   }

//   if (msg.includes("413")) {
//     return "This file is too large.";
//   }

//   if (msg.includes("500") || msg.includes("server")) {
//     return "Server error. Please try again later.";
//   }

//   if (msg.includes("timeout")) {
//     return "The request took too long. Please try again.";
//   }

//   return fallback;
// };

// const timeAgo = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const diff = Math.floor((now - past) / 1000);

//   const units = [
//     { label: "year", secs: 31536000 },
//     { label: "month", secs: 2592000 },
//     { label: "day", secs: 86400 },
//     { label: "hour", secs: 3600 },
//     { label: "minute", secs: 60 },
//   ];

//   for (let u of units) {
//     const val = Math.floor(diff / u.secs);
//     if (val >= 1) return `${val} ${u.label}${val > 1 ? "s" : ""} ago`;
//   }

//   return "just now";
// };

// const ArtisanCertificates = () => {
//   const { user } = useAuth();

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("ALL");
//   const [preview, setPreview] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   useEffect(() => {
//     if (!user) return;

//     const fetchCertificates = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         setSuccessMsg("");

//         const token = localStorage.getItem("fixserv_token");

//         const res = await fetch(
//           `https://dev-user-api.fixserv.co/api/certificate/${user.id}/certificates`,
//           {
//             headers: token
//               ? { Authorization: `Bearer ${token}` }
//               : {},
//           }
//         );

//         let json = null;
//         try {
//           json = await res.json();
//         } catch {
//           json = null;
//         }

//         if (!res.ok) {
//           throw new Error(
//             json?.message ||
//               json?.error ||
//               `Failed to load certificates (HTTP ${res.status})`
//           );
//         }

//         if (json?.success) {
//           setData(json);
//         } else {
//           throw new Error(json?.message || "Unable to load certificates.");
//         }
//       } catch (err) {
//         console.log("CERT ERROR:", err);
//         setError(getUserFriendlyError(err, "Unable to load certificates."));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCertificates();
//   }, [user]);

//   const filteredCertificates = useMemo(() => {
//     if (!data?.certificates) return [];

//     let list = [...data.certificates];

//     if (activeTab !== "ALL") {
//       list = list.filter((c) => c.status === activeTab);
//     }

//     list.sort((a, b) => {
//       const statusDiff =
//         (STATUS_ORDER[a.status] || 99) -
//         (STATUS_ORDER[b.status] || 99);

//       if (statusDiff !== 0) return statusDiff;

//       return new Date(b.uploadedAt) - new Date(a.uploadedAt);
//     });

//     return list;
//   }, [data, activeTab]);

//   const handleDownload = async (url, name) => {
//     try {
//       setError("");
//       setSuccessMsg("");

//       const res = await fetch(url);

//       if (!res.ok) {
//         throw new Error(`Download failed (HTTP ${res.status})`);
//       }

//       const blob = await res.blob();

//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = name || "certificate";
//       link.click();

//       setSuccessMsg("Certificate downloaded successfully.");
//     } catch (err) {
//       console.log("DOWNLOAD ERROR:", err);
//       setError(getUserFriendlyError(err, "Unable to download certificate."));
//     }
//   };

//   const handleDelete = async (cert) => {
//     try {
//       setDeletingId(cert.id);
//       setError("");
//       setSuccessMsg("");

//       const token = localStorage.getItem("fixserv_token");

//       const res = await fetch(
//         `https://dev-user-api.fixserv.co/api/certificate/${user.id}/certificates/${cert.id}`,
//         {
//           method: "DELETE",
//           headers: token
//             ? { Authorization: `Bearer ${token}` }
//             : {},
//         }
//       );

//       let result = null;
//       try {
//         result = await res.json();
//       } catch {
//         result = null;
//       }

//       if (!res.ok) {
//         throw new Error(
//           result?.message ||
//             result?.error ||
//             `Delete failed (HTTP ${res.status})`
//         );
//       }

//       if (result?.success) {
//         setData((prev) => {
//           const updatedCertificates = prev.certificates.filter(
//             (c) => c.id !== cert.id
//           );

//           return {
//             ...prev,
//             certificates: updatedCertificates,
//             totalCertificates: updatedCertificates.length,
//             pendingCount: updatedCertificates.filter((c) => c.status === "PENDING").length,
//             approvedCount: updatedCertificates.filter((c) => c.status === "APPROVED").length,
//             rejectedCount: updatedCertificates.filter((c) => c.status === "REJECTED").length,
//           };
//         });

//         setSuccessMsg("Certificate deleted successfully.");
//       } else {
//         throw new Error(result?.message || "Unable to delete certificate.");
//       }
//     } catch (err) {
//       console.log("DELETE ERROR:", err);
//       setError(getUserFriendlyError(err, "Unable to delete certificate."));
//     } finally {
//       setDeletingId(null);
//       setConfirmDelete(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 space-y-4 animate-pulse">
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-24 bg-gray-200 rounded-xl" />
//           ))}
//         </div>

//         <div className="space-y-3 mt-6">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="h-20 bg-gray-200 rounded-xl" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
//       <ArtisanHeader title="Certificates" />

//       {error ? (
//         <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
//           {error}
//         </div>
//       ) : null}

//       {successMsg ? (
//         <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 text-sm">
//           {successMsg}
//         </div>
//       ) : null}

//       <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         <div
//           onClick={() => setActiveTab("ALL")}
//           className={`cursor-pointer rounded-xl p-4 transition ${
//             activeTab === "ALL"
//               ? "bg-blue-600 text-white scale-105"
//               : "bg-blue-500 text-white hover:scale-101 shadow-lg"
//           }`}
//         >
//           <p>Total</p>
//           <h2 className="text-2xl">{data?.totalCertificates || 0}</h2>
//         </div>

//         <div
//           onClick={() => setActiveTab("PENDING")}
//           className={`cursor-pointer rounded-xl p-5 transition ${
//             activeTab === "PENDING"
//               ? "bg-yellow-500 text-white scale-105"
//               : "bg-yellow-400 text-white hover:scale-101 shadow-lg"
//           }`}
//         >
//           <p>Pending</p>
//           <h2 className="text-2xl">{data?.pendingCount || 0}</h2>
//         </div>

//         <div
//           onClick={() => setActiveTab("APPROVED")}
//           className={`cursor-pointer rounded-xl p-5 transition ${
//             activeTab === "APPROVED"
//               ? "bg-green-700 text-white scale-105"
//               : "bg-green-600 text-white hover:scale-101 shadow-lg"
//           }`}
//         >
//           <p>Approved</p>
//           <h2 className="text-2xl">{data?.approvedCount || 0}</h2>
//         </div>

//         <div
//           onClick={() => setActiveTab("REJECTED")}
//           className={`cursor-pointer rounded-xl p-5 transition ${
//             activeTab === "REJECTED"
//               ? "bg-red-600 text-white scale-105"
//               : "bg-red-500 text-white hover:scale-101 shadow-lg"
//           }`}
//         >
//           <p>Rejected</p>
//           <h2 className="text-2xl">{data?.rejectedCount || 0}</h2>
//         </div>
//       </div>

//       <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
//         {filteredCertificates.length === 0 ? (
//           <p className="text-gray-400">No certificates found.</p>
//         ) : (
//           <div className="grid gap-4 transition-all duration-300">
//             {filteredCertificates.map((cert) => (
//               <div
//                 key={cert.id}
//                 className="flex flex-col md:flex-row justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
//               >
//                 <div className="flex gap-4 items-center">
//                   {cert.fileType === "IMAGE" ? (
//                     <img
//                       src={cert.fileUrl}
//                       alt=""
//                       onClick={() => setPreview(cert)}
//                       className="w-16 h-16 object-cover rounded-lg cursor-pointer"
//                     />
//                   ) : (
//                     <div
//                       onClick={() => setPreview(cert)}
//                       className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer"
//                     >
//                       PDF
//                     </div>
//                   )}

//                   <div>
//                     <p className="font-medium">{cert.name}</p>
//                     <p className="text-xs text-gray-400">{cert.fileType}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {timeAgo(cert.uploadedAt)}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
//                   <span
//                     className={`text-xs px-3 py-1 rounded-full ${
//                       STATUS_STYLES[cert.status]
//                     }`}
//                   >
//                     {cert.status}
//                   </span>

//                   <div className="flex gap-3 text-sm">
//                     <button
//                       onClick={() => setPreview(cert)}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Preview
//                     </button>

//                     <button
//                       onClick={() => handleDownload(cert.fileUrl, cert.name)}
//                       className="text-green-600 hover:underline"
//                     >
//                       Download
//                     </button>

//                     {cert.status === "PENDING" && (
//                       <button
//                         onClick={() => setConfirmDelete(cert)}
//                         className="text-red-600 hover:underline"
//                       >
//                         {deletingId === cert.id ? "Deleting..." : "Delete"}
//                       </button>
//                     )}
//                   </div>

//                   {cert.status === "REJECTED" && cert.rejectionReason && (
//                     <p className="text-xs text-red-500 max-w-xs">
//                       {cert.rejectionReason}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {preview && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-3xl w-full p-4 relative animate-fadeIn">
//             <button
//               onClick={() => setPreview(null)}
//               className="absolute top-2 right-3 text-gray-500 text-lg"
//             >
//               ✕
//             </button>

//             {preview.fileType === "IMAGE" ? (
//               <img
//                 src={preview.fileUrl}
//                 alt=""
//                 className="w-full max-h-[80vh] object-contain rounded-lg"
//               />
//             ) : (
//               <iframe
//                 src={preview.fileUrl}
//                 title="preview"
//                 className="w-full h-[80vh] rounded-lg"
//               />
//             )}
//           </div>
//         </div>
//       )}

//       {confirmDelete && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Delete Certificate
//             </h3>

//             <p className="text-sm text-gray-500 mt-2">
//               Are you sure you want to delete{" "}
//               <span className="font-medium text-gray-700">
//                 {confirmDelete.name}
//               </span>
//               ? This action cannot be undone.
//             </p>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={() => handleDelete(confirmDelete)}
//                 className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
//               >
//                 Confirm Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtisanCertificates;


import React, { useEffect, useMemo, useState } from "react";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";
import { useAuth } from "../../context/AuthContext";
import {
  deleteCertificate,
  fetchCertificates,
  getCertificateFriendlyError,
} from "../../api/certificate.api";

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_ORDER = {
  APPROVED: 1,
  PENDING: 2,
  REJECTED: 3,
};

const timeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now - past) / 1000);

  const units = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];

  for (const u of units) {
    const val = Math.floor(diff / u.secs);
    if (val >= 1) return `${val} ${u.label}${val > 1 ? "s" : ""} ago`;
  }

  return "just now";
};

const resolveUserId = (user) => user?.id || user?._id || user?.artisanId || "";

const ArtisanCertificates = () => {
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [preview, setPreview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const userId = resolveUserId(user);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("Missing user id. Please login again.");
      return;
    }

    const controller = new AbortController();

    const loadCertificates = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMsg("");

        const json = await fetchCertificates(userId, controller.signal);
        setData(json);
      } catch (err) {
        if (err?.name === "AbortError") return;
        console.log("CERT ERROR:", err);
        setError(
          getCertificateFriendlyError(err, "Unable to load certificates.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();

    return () => controller.abort();
  }, [userId]);

  const filteredCertificates = useMemo(() => {
    if (!data?.certificates) return [];

    let list = [...data.certificates];

    if (activeTab !== "ALL") {
      list = list.filter((c) => c.status === activeTab);
    }

    list.sort((a, b) => {
      const statusDiff =
        (STATUS_ORDER[a.status] || 99) -
        (STATUS_ORDER[b.status] || 99);

      if (statusDiff !== 0) return statusDiff;

      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    });

    return list;
  }, [data, activeTab]);

  const handleDownload = async (url, name) => {
    try {
      setError("");
      setSuccessMsg("");

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Download failed (HTTP ${res.status})`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = name || "certificate";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      setSuccessMsg("Certificate downloaded successfully.");
    } catch (err) {
      console.log("DOWNLOAD ERROR:", err);
      setError(
        getCertificateFriendlyError(err, "Unable to download certificate.")
      );
    }
  };

  const handleDelete = async (cert) => {
    try {
      setDeletingId(cert.id);
      setError("");
      setSuccessMsg("");

      const result = await deleteCertificate(userId, cert.id);

      if (result?.success) {
        setData((prev) => {
          const current = prev?.certificates || [];
          const updatedCertificates = current.filter((c) => c.id !== cert.id);

          return {
            ...prev,
            certificates: updatedCertificates,
            totalCertificates: updatedCertificates.length,
            pendingCount: updatedCertificates.filter((c) => c.status === "PENDING").length,
            approvedCount: updatedCertificates.filter((c) => c.status === "APPROVED").length,
            rejectedCount: updatedCertificates.filter((c) => c.status === "REJECTED").length,
          };
        });

        if (preview?.id === cert.id) {
          setPreview(null);
        }

        setSuccessMsg("Certificate deleted successfully.");
      } else {
        throw new Error(result?.message || "Unable to delete certificate.");
      }
    } catch (err) {
      console.log("DELETE ERROR:", err);
      setError(
        getCertificateFriendlyError(err, "Unable to delete certificate.")
      );
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>

        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <ArtisanHeader title="Certificates" />

      {error ? (
        <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      {successMsg ? (
        <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 text-sm">
          {successMsg}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab("ALL")}
          className={`cursor-pointer rounded-xl p-4 transition ${
            activeTab === "ALL"
              ? "bg-blue-600 text-white scale-105"
              : "bg-blue-500 text-white shadow-lg"
          }`}
        >
          <p>Total</p>
          <h2 className="text-2xl">{data?.totalCertificates || 0}</h2>
        </div>

        <div
          onClick={() => setActiveTab("PENDING")}
          className={`cursor-pointer rounded-xl p-5 transition ${
            activeTab === "PENDING"
              ? "bg-yellow-500 text-white scale-105"
              : "bg-yellow-400 text-white shadow-lg"
          }`}
        >
          <p>Pending</p>
          <h2 className="text-2xl">{data?.pendingCount || 0}</h2>
        </div>

        <div
          onClick={() => setActiveTab("APPROVED")}
          className={`cursor-pointer rounded-xl p-5 transition ${
            activeTab === "APPROVED"
              ? "bg-green-700 text-white scale-105"
              : "bg-green-600 text-white shadow-lg"
          }`}
        >
          <p>Approved</p>
          <h2 className="text-2xl">{data?.approvedCount || 0}</h2>
        </div>

        <div
          onClick={() => setActiveTab("REJECTED")}
          className={`cursor-pointer rounded-xl p-5 transition ${
            activeTab === "REJECTED"
              ? "bg-red-600 text-white scale-105"
              : "bg-red-500 text-white shadow-lg"
          }`}
        >
          <p>Rejected</p>
          <h2 className="text-2xl">{data?.rejectedCount || 0}</h2>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        {filteredCertificates.length === 0 ? (
          <p className="text-gray-400">No certificates found.</p>
        ) : (
          <div className="grid gap-4 transition-all duration-300">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col md:flex-row justify-between border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-4 items-center">
                  {cert.fileType === "IMAGE" ? (
                    <img
                      src={cert.fileUrl}
                      alt={cert.name}
                      onClick={() => setPreview(cert)}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                    />
                  ) : (
                    <div
                      onClick={() => setPreview(cert)}
                      className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg cursor-pointer"
                    >
                      FILE
                    </div>
                  )}

                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-xs text-gray-400">{cert.fileType}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {timeAgo(cert.uploadedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      STATUS_STYLES[cert.status]
                    }`}
                  >
                    {cert.status}
                  </span>

                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setPreview(cert)}
                      className="text-blue-600 hover:underline"
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(cert.fileUrl, cert.name)}
                      className="text-green-600 hover:underline"
                    >
                      Download
                    </button>

                    {cert.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(cert)}
                        className="text-red-600 hover:underline"
                      >
                        {deletingId === cert.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>

                  {cert.status === "REJECTED" && cert.rejectionReason && (
                    <p className="text-xs text-red-500 max-w-xs">
                      {cert.rejectionReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-4 relative animate-fadeIn">
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-2 right-3 text-gray-500 text-lg"
            >
              ✕
            </button>

            {preview.fileType === "IMAGE" ? (
              <img
                src={preview.fileUrl}
                alt={preview.name}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <iframe
                src={preview.fileUrl}
                title="preview"
                className="w-full h-[80vh] rounded-lg"
              />
            )}
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Certificate
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">
                {confirmDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                disabled={deletingId === confirmDelete.id}
              >
                {deletingId === confirmDelete.id ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanCertificates;