import React, { useEffect, useMemo, useRef, useState } from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import mark from "../../assets/client images/client-home/mark.png";
import star from "../../assets/client images/client-home/star.png";
import upload from "../../assets/client images/client-home/upload.png";
import settingImage from "../../assets/client images/client-home/setting.png";
import battery from "../../assets/client images/client-home/battery.png";
import flashImage from "../../assets/client images/client-home/flash.png";
import cameraImage from "../../assets/client images/client-home/camera.png";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getArtisanById, getArtisanServices } from "../../api/artisan.api";
import { normalizeArtisan } from "../../utils/normalizeArtisan";
import ArtisanCard from "./ArtisanCard";
import {
  compressProductImage,
  validateProductImageFile,
} from "../../api/product-upload.api";

const ClientBooking = () => {
  const navigate = useNavigate();
  const { artisanId } = useParams();
  const location = useLocation();

  const artisanFromState = location.state?.artisan;

  const [imagePreview, setImagePreview] = useState(null);
  const [artisanData, setArtisanData] = useState(artisanFromState || null);
  const [loading, setLoading] = useState(!artisanFromState);
  const [artisanServiceList, setArtisanServiceList] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [continueBlockMessage, setContinueBlockMessage] = useState("");

  const [bookingData, setBookingData] = useState({
    deviceType: "",
    brand: "",
    model: "",
    location: "",
    serviceRequired: "",
    issueDescription: "",
    additionalNotes: "",
    imageFile: null,
  });

  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const cleanText = (v, fallback = "") =>
    typeof v === "string" && v.trim() === "" ? fallback : v ?? fallback;

  const normalizeBusinessHours = (bh = {}) => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const out = {};
    for (const d of days) {
      const open = bh?.[d]?.open;
      const close = bh?.[d]?.close;

      const isClosed =
        !open ||
        !close ||
        String(open).toLowerCase() === "closed" ||
        String(close).toLowerCase() === "closed";

      out[d] = isClosed ? null : { open, close };
    }
    return out;
  };

  const serviceApiMapped = useMemo(() => {
    return (Array.isArray(artisanServiceList) ? artisanServiceList : [])
      .filter((s) => s?.isActive !== false)
      .map((s, idx) => {
        const title =
          s?.title || s?.name || s?.serviceName || `Service ${idx + 1}`;

        return {
          id: s?.id || s?._id || `api-${idx}`,
          title,
          price: s?.price ?? s?.amount ?? null,
          icon: String(title).toLowerCase().includes("battery")
            ? battery
            : String(title).toLowerCase().includes("camera")
            ? cameraImage
            : String(title).toLowerCase().includes("charg")
            ? flashImage
            : settingImage,
        };
      });
  }, [artisanServiceList]);

  const serviceOptions = useMemo(() => {
    if (serviceApiMapped.length > 0) return serviceApiMapped;
    return [];
  }, [serviceApiMapped]);

  const serviceMap = useMemo(() => {
    const map = new Map();
    serviceOptions.forEach((s) => {
      map.set(String(s.id), s);
    });
    return map;
  }, [serviceOptions]);

  const hasUploadedServices = serviceOptions.length > 0;

  const selectedService =
    serviceMap.get(String(bookingData.serviceRequired)) || null;

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (
      bookingData.serviceRequired &&
      serviceOptions.length > 0 &&
      !selectedService
    ) {
      setErrors((prev) => ({
        ...prev,
        serviceRequired: "Invalid service selected",
      }));
    }
  }, [bookingData.serviceRequired, selectedService, serviceOptions]);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!artisanId) return;

      try {
        setLoading(true);
        setLoadingServices(true);

        const [artisanRes, servicesRes] = await Promise.allSettled([
          artisanFromState
            ? Promise.resolve(artisanFromState)
            : getArtisanById(artisanId),
          getArtisanServices(artisanId),
        ]);

        if (artisanRes.status === "fulfilled") {
          setArtisanData(normalizeArtisan(artisanRes.value));
        } else {
          setArtisanData(null);
        }

        if (servicesRes.status === "fulfilled") {
          setArtisanServiceList(
            Array.isArray(servicesRes.value) ? servicesRes.value : []
          );
        } else {
          setArtisanServiceList([]);
        }
      } finally {
        setLoading(false);
        setLoadingServices(false);
      }
    };

    fetchBookingData();
  }, [artisanId, artisanFromState]);

  useEffect(() => {
    if (hasUploadedServices) {
      setContinueBlockMessage("");
    }
  }, [hasUploadedServices]);

  const handlePickFile = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      const validation = validateProductImageFile(selectedFile);

      if (!validation.valid) {
        setErrors((prev) => ({
          ...prev,
          imageFile: validation.message,
        }));
        e.target.value = "";
        return;
      }

      const processedFile = await compressProductImage(selectedFile);

      const postValidation = validateProductImageFile(processedFile);
      if (!postValidation.valid) {
        setErrors((prev) => ({
          ...prev,
          imageFile: postValidation.message,
        }));
        e.target.value = "";
        return;
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const previewUrl = URL.createObjectURL(processedFile);

      setBookingData((prev) => ({
        ...prev,
        imageFile: processedFile,
      }));

      setImagePreview(previewUrl);

      setErrors((prev) => ({
        ...prev,
        imageFile: "",
      }));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "Unable to process this image. Please try another one.",
      }));
    } finally {
      e.target.value = "";
    }
  };

  const validateBooking = () => {
    const nextErrors = {};

    if (!bookingData.deviceType.trim()) {
      nextErrors.deviceType = "Device type is required";
    }

    if (!bookingData.brand.trim()) {
      nextErrors.brand = "Device brand is required";
    }

    if (!bookingData.model.trim()) {
      nextErrors.model = "Device model is required";
    }

    if (!bookingData.location.trim()) {
      nextErrors.location = "Location is required";
    }

    if (!hasUploadedServices) {
      nextErrors.serviceRequired = "You Cant Continue, No Services Uploaded Yet";
    } else if (!bookingData.serviceRequired.trim()) {
      nextErrors.serviceRequired = "Service is required";
    }

    if (!bookingData.issueDescription.trim()) {
      nextErrors.issueDescription = "Issue description is required";
    }

    if (!bookingData.imageFile && !imagePreview) {
      nextErrors.imageFile = "Please upload an image of the damaged device";
    }

    setErrors(nextErrors);

    const firstKey = Object.keys(nextErrors)[0];
    if (firstKey) {
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(nextErrors).length === 0;
  };

  if (loading || !artisanData) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  const displayName =
    artisanData.fullName || artisanData.businessName || "Unnamed Artisan";

  const professionLabel = artisanData.profession || "Technician";

  const reviewsCount = Number(artisanData.reviewsCount || 0);

  const yearsFromCreatedAt = artisanData.createdAt
    ? Math.max(
        0,
        new Date().getFullYear() - new Date(artisanData.createdAt).getFullYear()
      )
    : null;

  return (
    <div className="w-full">
      <section className="w-full py-8 sm:py-10 lg:py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#3E83C4] mb-6 flex items-center gap-1"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
            <div className="order-2 lg:order-1">
              <h2 className="text-lg font-semibold text-black mb-6">
                Tell Us About The Issue
              </h2>

              <div className="space-y-6">
                <div data-field="deviceType">
                  <input
                    type="text"
                    placeholder="Device Type (e.g. inverter)"
                    value={bookingData.deviceType}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        deviceType: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, deviceType: "" }));
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4] ${
                      errors.deviceType ? "border-red-400" : "border-[#5F8EBA]"
                    }`}
                  />
                  {errors.deviceType && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.deviceType}
                    </p>
                  )}
                </div>

                <div data-field="brand">
                  <input
                    type="text"
                    placeholder="Device Brand"
                    value={bookingData.brand}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, brand: "" }));
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4] ${
                      errors.brand ? "border-red-400" : "border-[#5F8EBA]"
                    }`}
                  />
                  {errors.brand && (
                    <p className="text-xs text-red-500 mt-2">{errors.brand}</p>
                  )}
                </div>

                <div data-field="model">
                  <input
                    type="text"
                    placeholder="Device Model"
                    value={bookingData.model}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        model: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, model: "" }));
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4] ${
                      errors.model ? "border-red-400" : "border-[#5F8EBA]"
                    }`}
                  />
                  {errors.model && (
                    <p className="text-xs text-red-500 mt-2">{errors.model}</p>
                  )}
                </div>

                <div data-field="location">
                  <input
                    type="text"
                    placeholder="Location"
                    value={bookingData.location}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, location: "" }));
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4] ${
                      errors.location ? "border-red-400" : "border-[#5F8EBA]"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div data-field="serviceRequired">
                  <select
                    value={bookingData.serviceRequired}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        serviceRequired: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, serviceRequired: "" }));
                      setContinueBlockMessage("");
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none bg-white focus:border-[#3E83C4] ${
                      errors.serviceRequired
                        ? "border-red-400"
                        : "border-[#5F8EBA]"
                    }`}
                    disabled={loadingServices || !hasUploadedServices}
                  >
                    <option value="">
                      {loadingServices
                        ? "Loading services..."
                        : !hasUploadedServices
                        ? "No Services Uploaded Yet"
                        : "Select Service Required"}
                    </option>
                    {serviceOptions.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                        {service.price != null
                          ? ` — ₦${Number(service.price).toLocaleString("en-NG")}`
                          : ""}
                      </option>
                    ))}
                  </select>
                  {errors.serviceRequired && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.serviceRequired}
                    </p>
                  )}
                </div>

                <div data-field="imageFile">
                  <p className="text-sm text-black mt-4 mb-4">
                    Upload image of Damaged Device{" "}
                    <span className="text-red-500">*</span>
                  </p>

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={handlePickFile}
                    className={`border border-dashed rounded-md p-6 sm:p-8 lg:p-12 text-center text-sm cursor-pointer transition ${
                      errors.imageFile
                        ? "border-red-400 text-red-400"
                        : "border-gray-300 text-gray-400 hover:border-blue-400"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="preview"
                            className="w-40 h-40 object-cover rounded-md"
                          />

                          <p className="text-xs text-gray-600 break-words">
                            {bookingData.imageFile?.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <img
                            src={upload}
                            alt=""
                            className="w-10 h-10 rounded-full bg-[#B3B3B3]"
                          />

                          <p>Click to upload or drag & drop</p>
                          <p className="text-xs">
                            JPG, JPEG, PNG, WEBP up to 5MB. Large images are automatically compressed.
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {errors.imageFile && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.imageFile}
                    </p>
                  )}
                </div>

                <div data-field="issueDescription">
                  <textarea
                    placeholder="Issue Description"
                    rows={4}
                    value={bookingData.issueDescription}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        issueDescription: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, issueDescription: "" }));
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none resize-none focus:border-[#3e83c4] ${
                      errors.issueDescription
                        ? "border-red-400"
                        : "border-[#5F8EBA]"
                    }`}
                  />
                  {errors.issueDescription && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.issueDescription}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Additional Notes"
                    value={bookingData.additionalNotes}
                    onChange={(e) => {
                      setBookingData((prev) => ({
                        ...prev,
                        additionalNotes: e.target.value,
                      }));
                    }}
                    className="w-full border border-[#5F8EBA] rounded-md px-4 py-3 text-sm outline-none focus:border-[#3e83c4]"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!hasUploadedServices) {
                        setContinueBlockMessage("You Cant Continue, No Services Uploaded Yet");
                        setErrors((prev) => ({
                          ...prev,
                          serviceRequired: "You Cant Continue, No Services Uploaded Yet",
                        }));

                        const el = document.querySelector(`[data-field="serviceRequired"]`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        return;
                      }

                      setContinueBlockMessage("");

                      const ok = validateBooking();
                      if (!ok) return;

                      navigate("/client/booking-summary", {
                        state: {
                          artisan: artisanData,
                          booking: {
                            ...bookingData,
                            artisanId:
                              artisanData?.id || artisanData?._id || artisanData?.artisanId || null,
                            serviceId: selectedService?.id || null,
                            serviceRequired: selectedService?.title || "",
                            serviceCost: selectedService?.price || null,
                          },
                        },
                      });
                    }}
                    aria-disabled={!hasUploadedServices}
                    className={`w-full sm:w-56 md:w-48 mx-auto block py-3 rounded-md text-sm font-medium transition ${
                      !hasUploadedServices
                        ? "bg-gray-300 text-white cursor-not-allowed"
                        : "bg-[#3E83C4] hover:bg-[#2d75b8] text-white cursor-pointer"
                    }`}
                  >
                    Continue
                  </button>

                  {continueBlockMessage && (
                    <p className="text-sm text-red-500 text-center mt-3">
                      {continueBlockMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#EEF6FF] rounded-2xl p-5 w-full max-w-[340px] mx-auto lg:mx-0 lg:max-w-[420px] xl:max-w-[460px] shadow-sm">
              <div className="flex flex-col gap-3">
                <ArtisanCard artisan={artisanData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientBooking;