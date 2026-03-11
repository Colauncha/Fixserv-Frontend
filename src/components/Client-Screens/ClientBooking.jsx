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

const ClientBooking = () => {
  const navigate = useNavigate();
  const { artisanId } = useParams();
  const location = useLocation();

  const artisanFromState = location.state?.artisan;

  const [artisanData, setArtisanData] = useState(artisanFromState || null);
  const [loading, setLoading] = useState(!artisanFromState);

  const [artisanServiceList, setArtisanServiceList] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

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

  const normalizeArtisan = (raw) => {
    const rawReviews = raw?.reviews;

    const reviewsList = Array.isArray(raw?.reviewsList)
      ? raw.reviewsList
      : Array.isArray(raw?.reviewsData)
      ? raw.reviewsData
      : Array.isArray(rawReviews)
      ? rawReviews
      : [];

    const reviewsCount = Number(
      raw?.reviewsCount ||
        (Array.isArray(rawReviews) ? rawReviews.length : rawReviews) ||
        0
    );

    const skills = Array.isArray(raw?.skillSet)
      ? raw.skillSet
      : Array.isArray(raw?.skills)
      ? raw.skills
      : [];

    return {
      ...raw,
      id: raw?.id || raw?._id,
      fullName: cleanText(
        raw?.fullName,
        cleanText(raw?.businessName, "Unnamed Artisan")
      ),
      businessName: cleanText(raw?.businessName, ""),
      location: cleanText(raw?.location, "Unknown location"),
      categories: Array.isArray(raw?.categories) ? raw.categories : [],
      skills,
      rating: Number(raw?.rating || 0),
      bio: cleanText(raw?.bio || raw?.about || raw?.description, ""),
      services: Array.isArray(raw?.services) ? raw.services : [],
      reviewsList,
      reviewsCount,
      businessHours: normalizeBusinessHours(raw?.businessHours),
      createdAt: raw?.createdAt,
      totalRepairs: Number(raw?.totalRepairs || raw?.jobsDone || 0),
      profilePicture: raw?.profilePicture || raw?.avatar || raw?.photoURL || "",
      profession:
        raw?.profession ||
        raw?.roleTitle ||
        raw?.categoryTitle ||
        raw?.specialty ||
        "Technician",
    };
  };

  const fallbackServices = [
    { id: 1, title: "Screen Replacement", price: 12000, icon: settingImage },
    { id: 2, title: "Battery Replacement", price: 7000, icon: battery },
    { id: 3, title: "Charging port Fix", price: 5000, icon: flashImage },
    { id: 4, title: "Camera Repair", price: 8000, icon: cameraImage },
    { id: 5, title: "General Diagnostics", price: 3500, icon: settingImage },
  ];

  const handlePickFile = () => fileRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "Please upload an image file.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imageFile: "Image must be 5MB or less.",
      }));
      return;
    }

    setBookingData((prev) => ({ ...prev, imageFile: file }));
    setErrors((prev) => ({ ...prev, imageFile: "" }));
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

    if (!bookingData.serviceRequired.trim()) {
      nextErrors.serviceRequired = "Service is required";
    }

    if (!bookingData.issueDescription.trim()) {
      nextErrors.issueDescription = "Issue description is required";
    }

    if (!bookingData.imageFile) {
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
          console.error("BOOKING ARTISAN ERROR:", artisanRes.reason);
          setArtisanData(null);
        }

        if (servicesRes.status === "fulfilled") {
          setArtisanServiceList(
            Array.isArray(servicesRes.value) ? servicesRes.value : []
          );
        } else {
          console.error("BOOKING SERVICES ERROR:", servicesRes.reason);
          setArtisanServiceList([]);
        }
      } finally {
        setLoading(false);
        setLoadingServices(false);
      }
    };

    fetchBookingData();
  }, [artisanId, artisanFromState]);

  const serviceApiMapped = useMemo(() => {
    return (Array.isArray(artisanServiceList) ? artisanServiceList : [])
      .filter((s) => s?.isActive !== false)
      .map((s, idx) => {
        const title =
          s?.title || s?.name || s?.serviceName || `Service ${idx + 1}`;

        return {
          id: s?.id || s?._id || `api-${idx}`,
          title,
          description: s?.description || "",
          price: s?.price ?? s?.amount ?? null,
          estimatedDuration: s?.estimatedDuration || s?.duration || "",
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

  const profileServicesMapped = useMemo(() => {
    const rawProfileServices = Array.isArray(artisanData?.services)
      ? artisanData.services
      : [];

    return rawProfileServices
      .filter((s) => s?.isActive !== false)
      .map((s, idx) => {
        const title =
          s?.title || s?.name || s?.serviceName || `Service ${idx + 1}`;

        return {
          id: s?.id || s?._id || `profile-${idx}`,
          title,
          description: s?.description || "",
          price: s?.price ?? s?.amount ?? null,
          estimatedDuration: s?.estimatedDuration || s?.duration || "",
          icon: String(title).toLowerCase().includes("battery")
            ? battery
            : String(title).toLowerCase().includes("camera")
            ? cameraImage
            : String(title).toLowerCase().includes("charg")
            ? flashImage
            : settingImage,
        };
      });
  }, [artisanData]);

  const skillServicesMapped = useMemo(() => {
    const rawSkillServices = Array.isArray(artisanData?.skills)
      ? artisanData.skills
      : [];

    return rawSkillServices.map((s, idx) => {
      const title =
        typeof s === "string"
          ? s
          : s?.name || s?.title || s?.serviceName || `Service ${idx + 1}`;

      return {
        id: s?.id || s?._id || `skill-${idx}`,
        title,
        description: "",
        price: null,
        estimatedDuration: "",
        icon: String(title).toLowerCase().includes("battery")
          ? battery
          : String(title).toLowerCase().includes("camera")
          ? cameraImage
          : String(title).toLowerCase().includes("charg")
          ? flashImage
          : settingImage,
      };
    });
  }, [artisanData]);

  const serviceOptions =
    serviceApiMapped.length > 0
      ? serviceApiMapped
      : profileServicesMapped.length > 0
      ? profileServicesMapped
      : skillServicesMapped.length > 0
      ? skillServicesMapped
      : fallbackServices;

  if (loading || !artisanData) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  const displayName =
    artisanData.fullName || artisanData.businessName || "Unnamed Artisan";

  const yearsFromCreatedAt = artisanData?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(artisanData.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      )
    : null;

  const reviewsCount = Number(
    artisanData?.reviewsCount ||
      (Array.isArray(artisanData?.reviewsList)
        ? artisanData.reviewsList.length
        : 0) ||
      0
  );

  const professionLabel = artisanData?.profession || "Technician";

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
                    }}
                    className={`w-full border rounded-md px-4 py-3 text-sm outline-none bg-white focus:border-[#3E83C4] ${
                      errors.serviceRequired
                        ? "border-red-400"
                        : "border-[#5F8EBA]"
                    }`}
                    disabled={loadingServices}
                  >
                    <option value="">
                      {loadingServices
                        ? "Loading services..."
                        : "Select Service Required"}
                    </option>
                    {serviceOptions.map((service) => (
                      <option key={service.id} value={service.title}>
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
                    accept="image/*"
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
                      <img
                        src={upload}
                        alt=""
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#B3B3B3]"
                      />

                      <p className="break-words">
                        {bookingData.imageFile
                          ? bookingData.imageFile.name
                          : "Click to upload or drag & drop"}
                      </p>
                      <p className="text-xs">PNG, JPG, JPEG up to 5MB</p>
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
                    className="w-full sm:w-56 md:w-48 mx-auto block bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-3 rounded-md text-sm font-medium transition cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 bg-[#EEF6FF] rounded-xl px-4 sm:px-6 py-4 w-full h-fit mx-auto max-w-md lg:max-w-none">
              <div className="flex flex-col items-center text-center gap-2">
                <img
                  src={artisanData.profilePicture || profileImage}
                  alt="artisan"
                  className="w-full max-w-[240px] aspect-square rounded-lg object-cover"
                />

                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                  <h3 className="font-semibold text-black break-words">
                    {displayName}
                  </h3>
                  <img src={mark} alt="verified" className="w-4 h-4" />
                </div>

                <p className="text-sm text-[#656565] break-words">
                  {professionLabel}
                </p>

                <div className="flex items-center gap-1 mt-1 text-sm text-black flex-wrap justify-center">
                  <img src={star} alt="star" className="w-4 h-4" />
                  <span>{Number(artisanData.rating || 0).toFixed(1)}</span>
                  <span className="text-black">({reviewsCount} reviews)</span>
                </div>

                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {(Array.isArray(artisanData.categories) &&
                  artisanData.categories.length
                    ? artisanData.categories
                    : ["Phone", "Tablet", "Laptop"]
                  )
                    .slice(0, 3)
                    .map((c, idx) => {
                      const label =
                        typeof c === "string"
                          ? c
                          : c?.name || c?.title || `Category ${idx + 1}`;
                      return (
                        <span
                          key={label + idx}
                          className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs break-words"
                        >
                          {label}
                        </span>
                      );
                    })}
                </div>

                <div className="mt-2 text-sm text-[#656565] space-y-1">
                  <p className="break-words">
                    Experience:{" "}
                    <span className="font-medium text-black">
                      {yearsFromCreatedAt != null
                        ? `${yearsFromCreatedAt}+ years`
                        : "—"}
                    </span>
                  </p>

                  <p className="break-words">
                    Location:{" "}
                    <span className="font-medium text-black">
                      {artisanData.location?.trim()
                        ? artisanData.location
                        : "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClientBooking;