// import React, { useState } from "react";
// import upload from "../../../assets/client images/client-home/referal part/upload.png";

// const RequestRepair = () => {
//   const [preview, setPreview] = useState(null);

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => setPreview(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const [formData, setFormData] = useState({
//   title: "",
//   description: "",
//   price: "",
//   estimatedDuration: "",
// });
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState("");

//  const handleSubmit = async () => {
//     setError("");

//     const { title, description, price, estimatedDuration } = formData;

//     if (!title || !description || !price || !estimatedDuration) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "https://dev-service-api.fixserv.co/api/service/createService",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("fixserv_token")}`,
//           },
//           body: JSON.stringify({
//             title,
//             description,
//             price: Number(price),
//             estimatedDuration,
//             rating: 0,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Failed to create service");
//       }

//       alert("Service created successfully 🎉");
//     } catch (err) {
//       setError(err?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };



//   return (
//     <div className="w-full">

//       <section className="w-full flex align-center justify-center py-14 mt-4 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-2 md:px-6">

//           {/* Header */}
//           <div className="mb-10">
//             <h1 className="text-xl font-semibold mb-1">Request Repair</h1>
//             <p className="text-sm text-gray-500">
//               Tell us what needs fixing and we’ll connect you with the right technician for the job.
//             </p>
//           </div>

//           {/* Form */}
//           <div className="max-w-3xl space-y-5">

// {/* Simple fields */}
// {["Device Type", "Location", "Service Required"].map((item) => (
//   <input
//     key={item}
//     type="text"
//     placeholder={item}
//     className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
//   />
// ))}

// {/* Controlled form inputs */}
// <input
//   name="title"
//   value={formData.title}
//   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//   placeholder="Service Title"
//   className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
// />

// <input
//   name="estimatedDuration"
//   value={formData.estimatedDuration}
//   onChange={(e) =>
//     setFormData({ ...formData, estimatedDuration: e.target.value })
//   }
//   placeholder="Estimated Duration"
//   className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
// />

// <input
//   type="number"
//   name="price"
//   value={formData.price}
//   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//   placeholder="Service Price"
//   className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
// />


//             {/* Upload */}
//             <div>
//               <p className="text-sm text-gray-500 mb-2">
//                 Upload image of Damaged Device
//               </p>

//               <label className="border-2 border-dashed border-gray-300 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition hover:border-blue-400">

//                 {preview ? (
//                   <img src={preview} className="max-h-full object-contain" />
//                 ) : (
//                   <>
//                     <img src={upload} className="w-10 mb-3 opacity-70" />
//                     <p className="text-sm text-gray-500">
//                       Click to upload or drag & drop
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       PNG, JPG, JPEG up to 5MB
//                     </p>
//                   </>
//                 )}

//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={handleUpload}
//                 />
//               </label>
//             </div>

//             {/* Issue & Notes */}
//             <div className="mt-8 space-y-5 max-w-3xl">

//               <textarea
//   rows={5}
//   name="description"
//   value={formData.description}
//   onChange={(e) =>
//     setFormData({ ...formData, description: e.target.value })
//   }
//   placeholder="Service Description"
//   className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
// />


//               <textarea
//                 rows={3}
//                 placeholder="Additional Notes"
//                 className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
//               />

//               {/* Continue Button */}
//               <div className="flex justify-center pt-4">
//                 <button
//   onClick={handleSubmit}
//   disabled={loading}
//   className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition"
// >
//   {loading ? "Creating..." : "Create Service"}
// </button>


// {error && (
//   <p className="text-red-500 text-sm text-center mt-3">
//     {error}
//   </p>
// )}

//               </div>

//             </div>

//           </div>

//         </div>
//       </section>
//     </div>
//   );
// };

// export default RequestRepair;



// new try 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import upload from "../../../assets/client images/client-home/referal part/upload.png";

const DRAFT_ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/draft";
const CONFIRM_ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/confirm";

const RequestRepair = () => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    deviceType: "",
    deviceBrand: "",
    deviceModel: "",
    serviceRequired: "",

    // ✅ REQUIRED to confirm and match artisans
    serviceId: "",

    // ✅ upload-products endpoint fields
    objectName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const safeParse = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();
    if (contentType.includes("application/json") && raw) return JSON.parse(raw);
    return { message: raw };
  };

  const uploadProduct = async ({ token, userId }) => {
    if (!file) throw new Error("Please upload an image of the damaged device.");

    const objectName =
      formData.objectName?.trim() || formData.deviceType?.trim() || "Device";
    const description =
      formData.description?.trim() ||
      formData.serviceRequired?.trim() ||
      "Device repair request";

    const fd = new FormData();
    fd.append("productImage", file);
    fd.append("objectName", objectName);
    fd.append("description", description);

    const res = await fetch(
      `https://dev-user-api.fixserv.co/api/upload/${userId}/upload-products`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );

    const data = await safeParse(res);

    if (!res.ok) {
      throw new Error(data?.message || `Upload failed (${res.status})`);
    }

    const uploadedProductId =
      data?.product?._id ||
      data?.product?.id ||
      data?.data?.product?._id ||
      data?.data?.product?.id;

    if (!uploadedProductId) {
      throw new Error("Upload succeeded but uploadedProductId was not returned.");
    }

    return uploadedProductId;
  };

  const createDraft = async ({ token, payload }) => {
    const res = await fetch(DRAFT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await safeParse(res);

    if (!res.ok) {
      throw new Error(data?.message || `Draft request failed (${res.status})`);
    }

    return data;
  };

  const confirmDraft = async ({ token, draftOrderId, serviceId }) => {
    const res = await fetch(CONFIRM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ draftOrderId, serviceId }),
    });

    const data = await safeParse(res);

    if (!res.ok) {
      throw new Error(data?.message || `Confirm failed (${res.status})`);
    }

    return data;
  };

  const handleSubmit = async () => {
    setError("");

    const token = localStorage.getItem("fixserv_token");
    if (!token) {
      setError("Unauthorized: Please login again.");
      return;
    }

    const storedUser = localStorage.getItem("fixserv_user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const userId = userObj?.id || userObj?._id;

    if (!userId) {
      setError("User not found. Please login again.");
      return;
    }

    const {
      deviceType,
      deviceBrand,
      deviceModel,
      serviceRequired,
      serviceId,
    } = formData;

    if (!deviceType || !deviceBrand || !deviceModel || !serviceRequired) {
      setError(
        "deviceType, deviceBrand, deviceModel and serviceRequired are required."
      );
      return;
    }

    if (!serviceId) {
      setError("serviceId is required to confirm and match artisans.");
      return;
    }

    try {
      setLoading(true);

      // 1) Upload product => uploadedProductId
      const uploadedProductId = await uploadProduct({ token, userId });

      // 2) Create draft
      const draftPayload = {
        uploadedProductId,
        deviceType: deviceType.trim(),
        deviceBrand: deviceBrand.trim(),
        deviceModel: deviceModel.trim(),
        serviceRequired: serviceRequired.trim(),
      };

      const draftRes = await createDraft({ token, payload: draftPayload });

      // draft example docs: { status, message, data: { orderId ... } }
      const draftData = draftRes?.data || draftRes;
      const draftOrderId =
        draftData?.orderId || draftData?.draftOrderId || draftData?.id;

      if (!draftOrderId) {
        throw new Error(
          "Draft created but draftOrderId/orderId was not returned."
        );
      }

      // 3) Confirm draft => returns matching artisans
      const confirmRes = await confirmDraft({
        token,
        draftOrderId,
        serviceId: serviceId.trim(),
      });

      const confirmData = confirmRes?.data || confirmRes;

      const artisans =
        confirmData?.artisans ||
        confirmData?.matchedArtisans ||
        confirmData?.data?.artisans ||
        confirmData?.data?.matchedArtisans ||
        [];

      // 4) Navigate to technician page with artisans
      navigate("/technician", {
        state: {
          draftOrderId,
          serviceId: serviceId.trim(),
          uploadedProductId,
          deviceType: draftData?.deviceType || deviceType,
          serviceRequired: draftData?.serviceRequired || serviceRequired,
          artisans,
          rawConfirm: confirmRes, // helps debug if UI doesn't match
        },
      });
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <section className="w-full flex align-center justify-center py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="mb-10">
            <h1 className="text-xl font-semibold mb-1">Request Repair</h1>
            <p className="text-sm text-gray-500">
              Tell us what needs fixing and we’ll connect you with the right
              technician for the job.
            </p>
          </div>

          <div className="max-w-3xl space-y-5">
            <input
              name="deviceType"
              value={formData.deviceType}
              onChange={(e) =>
                setFormData({ ...formData, deviceType: e.target.value })
              }
              placeholder="Device Type (e.g. inverter)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              name="deviceBrand"
              value={formData.deviceBrand}
              onChange={(e) =>
                setFormData({ ...formData, deviceBrand: e.target.value })
              }
              placeholder="Device Brand (e.g. LG, Sumec)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              name="deviceModel"
              value={formData.deviceModel}
              onChange={(e) =>
                setFormData({ ...formData, deviceModel: e.target.value })
              }
              placeholder="Device Model (e.g. i26)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={(e) =>
                setFormData({ ...formData, serviceRequired: e.target.value })
              }
              placeholder="Service Required (e.g. inverter repairer)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            {/* ✅ REQUIRED FOR CONFIRM */}
            <input
              name="serviceId"
              value={formData.serviceId}
              onChange={(e) =>
                setFormData({ ...formData, serviceId: e.target.value })
              }
              placeholder="Service ID (UUID) - required to match artisans"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              name="objectName"
              value={formData.objectName}
              onChange={(e) =>
                setFormData({ ...formData, objectName: e.target.value })
              }
              placeholder="Object Name (optional)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the issue (used for uploaded product description)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <div>
              <p className="text-sm text-gray-500 mb-2">
                Upload image of Damaged Device
              </p>

              <label className="border-2 border-dashed border-gray-300 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition hover:border-blue-400">
                {preview ? (
                  <img
                    src={preview}
                    className="max-h-full object-contain"
                    alt="preview"
                  />
                ) : (
                  <>
                    <img
                      src={upload}
                      className="w-10 mb-3 opacity-70"
                      alt="upload"
                    />
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

            <div className="flex justify-center pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Request"}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-3">{error}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestRepair;