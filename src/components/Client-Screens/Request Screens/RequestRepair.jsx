import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import upload from "../../../assets/client images/client-home/referal part/upload.png";

const DRAFT_ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/draft";
// const CONFIRM_ENDPOINT = "https://dev-order-api.fixserv.co/api/orders/confirm";

    const getUserFriendlyError = (err, fallback = "Something went wrong. Please try again.") => {
  const msg = String(err?.message || "").toLowerCase();

  if (msg.includes("timed out") || msg.includes("timeout")) {
    return "We could not complete this step right now. Please try again.";
  }

  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (msg.includes("401") || msg.includes("unauthorized")) {
    return "Session expired. Please login again.";
  }

  if (msg.includes("400")) {
    return "We could not process your request. Please check your details and try again.";
  }

  if (msg.includes("500") || msg.includes("server")) {
    return "Server error. Please try again later.";
  }

  return fallback;
};

const RequestRepair = () => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    deviceType: "",
    deviceBrand: "",
    deviceModel: "",
    serviceRequired: "",
    objectName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const safeParse = async (res) => {
    const contentType = res.headers.get("content-type") || "";
    const raw = await res.text();

    let json = null;
    if (contentType.includes("application/json") && raw) {
      try {
        json = JSON.parse(raw);
      } catch (e) {
        json = null;
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      contentType,
      raw,
      json,
    };
  };

  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const uploadProduct = async ({ token, userId }) => {
    if (!file) throw new Error("Please upload an image of the damaged device.");

    const objectName =
      formData.objectName?.trim() || formData.deviceType?.trim() || "Device";
    const description =
      formData.description?.trim() || "Device repair request";

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

    const parsed = await safeParse(res);

    console.log("UPLOAD META =>", {
      status: parsed.status,
      raw: parsed.raw,
      json: parsed.json,
    });

    if (!parsed.ok) {
      const msg =
        parsed?.json?.message ||
        parsed?.json?.error ||
        parsed?.raw ||
        `Upload failed (${parsed.status})`;
      throw new Error(msg);
    }

    const data = parsed.json || {};
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

    const parsed = await safeParse(res);

    console.log("DRAFT META =>", {
      status: parsed.status,
      raw: parsed.raw,
      json: parsed.json,
    });

    if (!parsed.ok) {
      const msg =
        parsed?.json?.message ||
        parsed?.json?.error ||
        parsed?.raw ||
        `Draft request failed (${parsed.status})`;
      throw new Error(msg);
    }

    return parsed.json ?? {};
  };

// const confirmDraft = async ({ token, draftOrderId }) => {
//   const payload = {
//     draftOrderId,
//     orderId: draftOrderId,
//   };

//   console.log("CONFIRM PAYLOAD =>", payload);

//   const res = await fetch(CONFIRM_ENDPOINT, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(payload),
//   });

//   const parsed = await safeParse(res);

//   console.log("CONFIRM RESPONSE META =>", {
//     status: parsed.status,
//     contentType: parsed.contentType,
//     raw: parsed.raw,
//     json: parsed.json,
//   });

//   if (!parsed.ok) {
//     const msg =
//       parsed?.json?.message ||
//       parsed?.json?.error ||
//       parsed?.raw ||
//       `Confirm failed (${parsed.status})`;
//     throw new Error(msg);
//   }

//   return parsed.json ?? {};
// };

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
    objectName,
    description,
  } = formData;

  if (!deviceType || !deviceBrand || !deviceModel) {
    setError("Device type, device brand, and device model are required.");
    return;
  }

  if (!serviceRequired.trim()) {
    setError("Please enter the service you want.");
    return;
  }

  try {
    setLoading(true);

    const uploadedProductId = await uploadProduct({ token, userId });

    const draftPayload = {
      uploadedProductId,
      deviceType: deviceType.trim(),
      deviceBrand: deviceBrand.trim(),
      deviceModel: deviceModel.trim(),
      serviceRequired: serviceRequired.trim(),
    };

    const draftRes = await createDraft({ token, payload: draftPayload });
    console.log("DRAFT RESPONSE JSON =>", draftRes);

    const draftData = draftRes?.data || draftRes;
    const draftOrderId =
      draftData?.orderId || draftData?.draftOrderId || draftData?.id;

    console.log("DRAFT ID USED =>", draftOrderId);

    if (!draftOrderId) {
      throw new Error("Draft created but draftOrderId/orderId was not returned.");
    }

    const draftOrderIdStr = String(draftOrderId || "").trim();

    if (!draftOrderIdStr) {
      throw new Error("draftOrderId missing after draft creation.");
    }

    const confirmRes = null;
    const artisans = [];

    navigate("/client/technician", {
      state: {
        draftOrderId: draftOrderIdStr,
        uploadedProductId,
        deviceType: draftData?.deviceType || deviceType,
        deviceBrand: deviceBrand.trim(),
        deviceModel: deviceModel.trim(),
        serviceRequired: serviceRequired.trim(),
        description: description.trim(),
        objectName: objectName.trim(),
        artisans,
        rawConfirm: confirmRes,
      },
    });
  } catch (err) {
    setError(getUserFriendlyError(err, "Unable to create request. Please try again."));
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
              Tell us what needs fixing and we’ll connect you with the right technician for the job.
            </p>
          </div>

          <div className="max-w-3xl space-y-5">
            <input
              value={formData.deviceType}
              onChange={(e) =>
                setFormData({ ...formData, deviceType: e.target.value })
              }
              placeholder="Device Type (e.g. inverter)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              value={formData.deviceBrand}
              onChange={(e) =>
                setFormData({ ...formData, deviceBrand: e.target.value })
              }
              placeholder="Device Brand (e.g. LG, Sumec)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              value={formData.deviceModel}
              onChange={(e) =>
                setFormData({ ...formData, deviceModel: e.target.value })
              }
              placeholder="Device Model (e.g. i26)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              value={formData.serviceRequired}
              onChange={(e) =>
                setFormData({ ...formData, serviceRequired: e.target.value })
              }
              placeholder="Service Required (e.g. inverter repair)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <input
              value={formData.objectName}
              onChange={(e) =>
                setFormData({ ...formData, objectName: e.target.value })
              }
              placeholder="Object Name (optional)"
              className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
            />

            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the issue"
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
                className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition disabled:opacity-60 cursor-pointer"
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