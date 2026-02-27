import React, { useEffect, useState, useRef } from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import mark from "../../assets/client images/client-home/mark.png";
import star from "../../assets/client images/client-home/star.png";
import upload from "../../assets/client images/client-home/upload.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ClientBooking = () => {
  const navigate = useNavigate();
  const { artisanId } = useParams();
  const location = useLocation();

  // ✅ artisan passed from ClientArtisanProfile
  const artisanFromState = location.state?.artisan;

  const [artisanData, setArtisanData] = useState(artisanFromState || null);
  const [loading, setLoading] = useState(!artisanFromState);

const [bookingData, setBookingData] = useState({
  deviceType: "",
  brand: "",
  model: "",
  location: "",
  serviceRequired: "",
  issueDescription: "",
  additionalNotes: "",
  imageFile: null, // ✅ required now
});

const [errors, setErrors] = useState({});

const fileRef = useRef(null);

const handlePickFile = () => fileRef.current?.click();

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setErrors((prev) => ({ ...prev, imageFile: "Please upload an image file." }));
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setErrors((prev) => ({ ...prev, imageFile: "Image must be 5MB or less." }));
    return;
  }

  setBookingData((prev) => ({ ...prev, imageFile: file }));
  setErrors((prev) => ({ ...prev, imageFile: "" }));
};

const validateBooking = () => {
  const nextErrors = {};

  if (!bookingData.deviceType) nextErrors.deviceType = "Device type is required";
  if (!bookingData.brand.trim()) nextErrors.brand = "Device brand is required";
  if (!bookingData.model.trim()) nextErrors.model = "Device model is required";
  if (!bookingData.location.trim()) nextErrors.location = "Location is required";
  if (!bookingData.serviceRequired) nextErrors.serviceRequired = "Service is required";
  if (!bookingData.issueDescription.trim())
    nextErrors.issueDescription = "Issue description is required";

  if (!bookingData.imageFile)
    nextErrors.imageFile = "Please upload an image of the damaged device";

  setErrors(nextErrors);

  // ✅ scroll to first error
  const firstKey = Object.keys(nextErrors)[0];
  if (firstKey) {
    const el = document.querySelector(`[data-field="${firstKey}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return Object.keys(nextErrors).length === 0;
};
  // ✅ Only fetch if user refreshed page / opened booking directly
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("fixserv_token");

        // ✅ FIX: use new endpoint
        const res = await fetch(
          `https://dev-user-api.fixserv.co/api/admin/user/${artisanId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load artisan");
        }

        // ✅ FIX: normalize response shape
        const payload = json?.data || json?.user || json;
        setArtisanData(payload);
      } catch (err) {
        console.error("Failed to load artisan", err);
        setArtisanData(null);
      } finally {
        setLoading(false);
      }
    };

    if (!artisanFromState && artisanId) fetchArtisan();
  }, [artisanFromState, artisanId]);

  // ✅ if state artisan changes (rare), sync it
  useEffect(() => {
    if (artisanFromState) {
      setArtisanData(artisanFromState);
      setLoading(false);
    }
  }, [artisanFromState]);

  if (loading || !artisanData) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  const displayName =
    artisanData.fullName || artisanData.businessName || "Unnamed Artisan";

  return (
    <div className="w-full">
      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          {/* ✅ Back */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#3E83C4] mb-6 flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="grid md:grid-cols-[1.6fr_1fr] gap-6">
            {/* LEFT – FORM */}
            <div>
              <h2 className="text-lg font-semibold text-black mb-6">
                Tell Us About The Issue
              </h2>

              <div className="space-y-6">
  {/* Device Type */}
  <div data-field="deviceType">
    <select
      value={bookingData.deviceType}
      onChange={(e) => {
        setBookingData({ ...bookingData, deviceType: e.target.value });
        setErrors((prev) => ({ ...prev, deviceType: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]
        ${errors.deviceType ? "border-red-400" : "border-[#5F8EBA]"}`}
    >
      <option value="">Device Type</option>
      <option value="Phone">Phone</option>
      <option value="Tablet">Tablet</option>
      <option value="Laptop">Laptop</option>
    </select>
    {errors.deviceType && (
      <p className="text-xs text-red-500 mt-2">{errors.deviceType}</p>
    )}
  </div>

  {/* Brand */}
  <div data-field="brand">
    <input
      type="text"
      placeholder="Device Brand"
      value={bookingData.brand}
      onChange={(e) => {
        setBookingData({ ...bookingData, brand: e.target.value });
        setErrors((prev) => ({ ...prev, brand: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]
        ${errors.brand ? "border-red-400" : "border-[#5F8EBA]"}`}
    />
    {errors.brand && (
      <p className="text-xs text-red-500 mt-2">{errors.brand}</p>
    )}
  </div>

  {/* Model */}
  <div data-field="model">
    <input
      type="text"
      placeholder="Device Model"
      value={bookingData.model}
      onChange={(e) => {
        setBookingData({ ...bookingData, model: e.target.value });
        setErrors((prev) => ({ ...prev, model: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]
        ${errors.model ? "border-red-400" : "border-[#5F8EBA]"}`}
    />
    {errors.model && (
      <p className="text-xs text-red-500 mt-2">{errors.model}</p>
    )}
  </div>

  {/* Location */}
  <div data-field="location">
    <input
      type="text"
      placeholder="Location"
      value={bookingData.location}
      onChange={(e) => {
        setBookingData({ ...bookingData, location: e.target.value });
        setErrors((prev) => ({ ...prev, location: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]
        ${errors.location ? "border-red-400" : "border-[#5F8EBA]"}`}
    />
    {errors.location && (
      <p className="text-xs text-red-500 mt-2">{errors.location}</p>
    )}
  </div>

  {/* Service Required */}
  <div data-field="serviceRequired">
    <select
      value={bookingData.serviceRequired}
      onChange={(e) => {
        setBookingData({ ...bookingData, serviceRequired: e.target.value });
        setErrors((prev) => ({ ...prev, serviceRequired: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3E83C4]
        ${errors.serviceRequired ? "border-red-400" : "border-[#5F8EBA]"}`}
    >
      <option value="">Service Required</option>
      <option value="Screen Replacement">Screen Replacement</option>
      <option value="Battery Replacement">Battery Replacement</option>
      <option value="Charging Port Fix">Charging Port Fix</option>
      <option value="Camera Repair">Camera Repair</option>
      <option value="General Diagnostics">General Diagnostics</option>
    </select>
    {errors.serviceRequired && (
      <p className="text-xs text-red-500 mt-2">{errors.serviceRequired}</p>
    )}
  </div>

  {/* Upload */}
  <div data-field="imageFile">
    <p className="text-sm text-black mt-4 mb-4">
      Upload image of Damaged Device <span className="text-red-500">*</span>
    </p>

    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleFileChange}
    />

    <div
      onClick={handlePickFile}
      className={`border border-dashed rounded-md p-12 text-center text-sm cursor-pointer transition
        ${errors.imageFile ? "border-red-400 text-red-400" : "border-gray-300 text-gray-400 hover:border-blue-400"}`}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src={upload}
          alt=""
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#B3B3B3]"
        />

        <p>
          {bookingData.imageFile
            ? bookingData.imageFile.name
            : "Click to upload or drag & drop"}
        </p>
        <p className="text-xs">PNG, JPG, JPEG up to 5MB</p>
      </div>
    </div>

    {errors.imageFile && (
      <p className="text-xs text-red-500 mt-2">{errors.imageFile}</p>
    )}
  </div>

  {/* Issue Description */}
  <div data-field="issueDescription">
    <textarea
      placeholder="Issue Description"
      rows={4}
      value={bookingData.issueDescription}
      onChange={(e) => {
        setBookingData({ ...bookingData, issueDescription: e.target.value });
        setErrors((prev) => ({ ...prev, issueDescription: "" }));
      }}
      className={`w-full border rounded-md px-4 py-3 text-sm outline-none resize-none focus:border-[#3e83c4]
        ${errors.issueDescription ? "border-red-400" : "border-[#5F8EBA]"}`}
    />
    {errors.issueDescription && (
      <p className="text-xs text-red-500 mt-2">{errors.issueDescription}</p>
    )}
  </div>

  {/* Additional Notes */}
  <div>
    <input
      type="text"
      placeholder="Additional Notes"
      value={bookingData.additionalNotes}
      onChange={(e) => {
        setBookingData({ ...bookingData, additionalNotes: e.target.value });
      }}
      className="w-full border border-[#5F8EBA] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]"
    />
  </div>

  {/* Continue Button */}
  <div className="pt-4">
    <button
      onClick={() => {
        const ok = validateBooking();
        if (!ok) return;

        navigate("/client/booking-summary", {
          state: {
            artisan: artisanData,
            booking: bookingData,
          },
        });
      }}
      className="w-full md:w-48 mx-auto block bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md text-sm font-medium transition cursor-pointer"
    >
      Continue
    </button>
  </div>
</div>
            </div>

            {/* RIGHT – ARTISAN CARD */}
            <div className="bg-[#EEF6FF] rounded-xl px-6 py-4 w-fit h-fit mx-auto">
              <div className="flex flex-col items-center text-center gap-2">
                <img
                  src={artisanData.profilePicture || profileImage}
                  alt="artisan"
                  className="w-[240px] aspect-square rounded-lg object-cover"
                />

                <div className="flex items-center gap-2 mt-2">
                  <h3 className="font-semibold text-black">{displayName}</h3>
                  <img src={mark} alt="verified" className="w-4 h-4" />
                </div>

                <p className="text-sm text-[#656565]">Electronics Technicians</p>

                <div className="flex items-center gap-1 mt-1 text-sm text-black">
                  <img src={star} alt="star" className="w-4 h-4" />
                  <span>{artisanData.rating || 0}</span>
                  <span className="text-black">
                    ({artisanData.reviews || 0} reviews)
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  {(artisanData.categories || ["Phone", "Tablet", "Laptop"])
                    .slice(0, 3)
                    .map((item) => (
                      <span
                        key={item}
                        className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                </div>

                <div className="mt-2 text-sm text-[#656565] space-y-1">
                  <p>
                    Experience:{" "}
                    <span className="font-medium text-black">5+ years</span>
                  </p>
                  <p>
                    Location:{" "}
                    <span className="font-medium text-black">
                      {artisanData.location || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            {/* END RIGHT CARD */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientBooking;