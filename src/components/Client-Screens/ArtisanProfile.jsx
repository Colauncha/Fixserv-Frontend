import React, { useEffect, useMemo, useState, useRef } from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import tick from "../../assets/client images/client-home/tick.png";
import share from "../../assets/client images/client-home/share.png";
import settingImage from "../../assets/client images/client-home/setting.png";
import battery from "../../assets/client images/client-home/battery.png";
import flashImage from "../../assets/client images/client-home/flash.png";
import cameraImage from "../../assets/client images/client-home/camera.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import starIcon from "../../assets/client images/client-home/star.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getArtisanById,
  getAllArtisans,
  getArtisanServices,
} from "../../api/artisan.api";
import { getAuthUser } from "../../utils/auth";

const ArtisanProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artisanId } = useParams();

  const passedState = location.state || {};
  const passedArtisan = passedState?.artisan || null;

  const [artisan, setArtisan] = useState(null);
  const [loadingArtisan, setLoadingArtisan] = useState(true);

  const [activeTab, setActiveTab] = useState("services");

  const [recommendedArtisans, setRecommendedArtisans] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [hoveredRecommendation, setHoveredRecommendation] = useState(null);

  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const marqueeWrapRef = useRef(null);
const marqueeTrackRef = useRef(null);

const [isDraggingMarquee, setIsDraggingMarquee] = useState(false);


  const cleanText = (v, fallback = "") =>
    typeof v === "string" && v.trim() === "" ? fallback : v ?? fallback;

  const formatNaira = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return `₦${num.toLocaleString("en-NG")}`;
  };

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

      const getSavedBio = (artisanId) => {
    if (!artisanId) return "";
    return localStorage.getItem(`fixserv_artisan_bio_${artisanId}`) || "";
  };

  const getCachedUserBio = (artisanId) => {
    if (!artisanId) return "";

    try {
      const authUser = getAuthUser();
      if (
        authUser &&
        String(authUser.id || authUser._id || authUser.artisanId) === String(artisanId) &&
        typeof authUser.bio === "string" &&
        authUser.bio.trim() !== ""
      ) {
        return authUser.bio;
      }

      const storedUser = JSON.parse(localStorage.getItem("fixserv_user") || "null");
      if (
        storedUser &&
        String(storedUser.id || storedUser._id || storedUser.artisanId) === String(artisanId) &&
        typeof storedUser.bio === "string" &&
        storedUser.bio.trim() !== ""
      ) {
        return storedUser.bio;
      }
    } catch (error) {
      console.error("FAILED TO READ CACHED BIO =>", error);
    }

    return "";
  };

  const extractBio = (raw, artisanIdForFallback = null) => {
  const resolvedId =
    artisanIdForFallback || raw?.id || raw?._id || raw?.artisanId || null;

  return firstNonEmptyText(
    raw?.bio,
    raw?.user?.bio,
    raw?.artisan?.bio,
    raw?.data?.bio,
    raw?.profile?.bio,
    raw?.artisanProfile?.bio,
    getSavedBio(resolvedId),
    getCachedUserBio(resolvedId)
  );
};

  const firstNonEmptyText = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }
  }
  return "";
};

const normalizeArtisan = (raw, servicesFromApi = []) => {
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

const mergedServices =
  Array.isArray(servicesFromApi) && servicesFromApi.length > 0
    ? servicesFromApi
    : Array.isArray(raw?.services)
    ? raw.services
    : [];

  const resolvedId = raw?.id || raw?._id || raw?.artisanId;

const serviceBios = mergedServices
  .flatMap((service) => [service?.bio, service?.details?.bio])
  .filter((value) => typeof value === "string" && value.trim() !== "");

const serviceLevelBio =
  serviceBios.length > 0 ? serviceBios[serviceBios.length - 1].trim() : "";

const latestSavedBio = getSavedBio(resolvedId);
const latestCachedBio = getCachedUserBio(resolvedId);

const resolvedBio = firstNonEmptyText(
  raw?.bio,
  raw?.user?.bio,
  raw?.artisan?.bio,
  raw?.data?.bio,
  raw?.profile?.bio,
  raw?.artisanProfile?.bio,
  latestSavedBio,
  latestCachedBio,
  serviceLevelBio
);

console.log("NORMALIZE RAW =>", raw);
console.log("MERGED SERVICES =>", mergedServices);
console.log("SERVICE LEVEL BIO =>", serviceLevelBio);
console.log("LATEST SAVED BIO =>", latestSavedBio);
console.log("LATEST CACHED BIO =>", latestCachedBio);
console.log("RESOLVED ID =>", resolvedId);
console.log("RESOLVED BIO =>", resolvedBio);

  return {
    ...raw,
    id: resolvedId,
    fullName: cleanText(
      raw?.fullName,
      cleanText(raw?.businessName, "Unnamed Artisan")
    ),
    businessName: cleanText(raw?.businessName, ""),
    location: cleanText(raw?.location, "Unknown location"),
    email: cleanText(raw?.email, ""),
    phoneNumber: cleanText(raw?.phoneNumber || raw?.phone, ""),
    role: cleanText(raw?.role, ""),
    categories: Array.isArray(raw?.categories) ? raw.categories : [],
    skills,
    skillSet: skills,
    rating: Number(raw?.rating || 0),
    bio: resolvedBio,
    services: mergedServices,
    reviewsList,
    reviewsCount,
    businessHours: normalizeBusinessHours(raw?.businessHours),
    createdAt: raw?.createdAt,
    totalRepairs: Number(raw?.totalRepairs || raw?.jobsDone || 0),
    profilePicture:
      raw?.profilePicture ||
      raw?.profileImage ||
      raw?.avatar ||
      raw?.photoURL ||
      raw?.imageUrl ||
      "",
  };
};

  const yearsFromCreatedAt = artisan?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(artisan.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      )
    : null;
  const requestState = {
    draftOrderId: passedState?.draftOrderId || "",
    uploadedProductId: passedState?.uploadedProductId || "",
    deviceType: passedState?.deviceType || "",
    deviceBrand: passedState?.deviceBrand || "",
    deviceModel: passedState?.deviceModel || "",
    serviceRequired: passedState?.serviceRequired || "",
    description: passedState?.description || "",
    objectName: passedState?.objectName || "",
    rawConfirm: passedState?.rawConfirm || null,
  };

useEffect(() => {
  const fetchArtisan = async () => {
    try {
      setLoadingArtisan(true);
      setLoadingServices(true);
      setServicesError("");

      const targetArtisanId =
        artisanId ||
        passedArtisan?.id ||
        passedArtisan?._id ||
        passedArtisan?.artisanId ||
        null;

      const fallbackArtisan = passedArtisan ? normalizeArtisan(passedArtisan) : null;

      if (fallbackArtisan) {
        setArtisan(fallbackArtisan);
      }

      if (!targetArtisanId) {
        if (!fallbackArtisan) {
          setArtisan(null);
          setServicesError("Unable to load artisan details.");
        }
        return;
      }

      const [rawProfile, rawServices, allArtisansResponse] = await Promise.all([
        getArtisanById(targetArtisanId).catch((err) => {
          console.error("ARTISAN PROFILE ERROR:", err);
          return null;
        }),
        getArtisanServices(targetArtisanId).catch((err) => {
          console.error("ARTISAN SERVICES ERROR:", err);
          setServicesError("Unable to load artisan services.");
          return [];
        }),
        getAllArtisans().catch((err) => {
          console.error("GET ALL ARTISANS ERROR:", err);
          return [];
        }),
      ]);

      const allArtisans = Array.isArray(allArtisansResponse)
        ? allArtisansResponse
        : Array.isArray(allArtisansResponse?.users)
        ? allArtisansResponse.users
        : [];

      const matchedFromAllArtisans =
        allArtisans.find(
          (a) =>
            String(a?.id || a?._id || a?.artisanId) === String(targetArtisanId)
        ) || null;

      console.log("ARTISAN PROFILE RAW =>", rawProfile);
      console.log("ARTISAN SERVICES RAW =>", rawServices);
      console.log("MATCHED FROM ALL ARTISANS =>", matchedFromAllArtisans);

      const resolvedBio = firstNonEmptyText(
        extractBio(rawProfile, targetArtisanId),
        extractBio(matchedFromAllArtisans, targetArtisanId),
        extractBio(passedArtisan, targetArtisanId),
        extractBio(fallbackArtisan, targetArtisanId),
        getSavedBio(targetArtisanId),
        getCachedUserBio(targetArtisanId)
      );

      const mergedRaw = {
        ...(matchedFromAllArtisans || {}),
        ...(fallbackArtisan || {}),
        ...(rawProfile || {}),
        bio: resolvedBio,
      };

      const artisanData = normalizeArtisan(mergedRaw, rawServices);

      console.log("FINAL ARTISAN DATA =>", artisanData);

      setArtisan(artisanData);
    } catch (err) {
      console.error("ARTISAN ERROR:", err);

      if (!passedArtisan) {
        setArtisan(null);
        setServicesError("Unable to load artisan details.");
      }
    } finally {
      setLoadingArtisan(false);
      setLoadingServices(false);
    }
  };

  fetchArtisan();
}, [artisanId, passedArtisan]);

  useEffect(() => {
    const fetchRecommendedArtisans = async () => {
      try {
        setLoadingRecommendations(true);

        const users = await getAllArtisans();
        const list = Array.isArray(users)
          ? users
          : Array.isArray(users?.users)
          ? users.users
          : [];

        setRecommendedArtisans(list);
      } catch (err) {
        console.error("Recommendation error:", err);
        setRecommendedArtisans([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedArtisans();
  }, []);

const apiServices = useMemo(() => {
  const rawProfileServices = Array.isArray(artisan?.services)
    ? artisan.services
    : [];

  console.log("ARTISAN FULL DATA =>", artisan);
  console.log("ARTISAN SERVICES RAW =>", artisan?.services);

  return rawProfileServices
    .filter((s) => s?.isActive !== false)
    .map((s, idx) => {
      const details =
        s?.details && typeof s.details === "object" ? s.details : null;

      const title =
        cleanText(s?.title) ||
        cleanText(details?.title) ||
        cleanText(s?.name) ||
        cleanText(s?.serviceName) ||
        `Service ${idx + 1}`;

      const description =
        cleanText(s?.description) ||
        cleanText(details?.description) ||
        cleanText(s?.details?.description, "");

      const estimatedDuration =
        cleanText(s?.estimatedDuration) ||
        cleanText(details?.estimatedDuration) ||
        cleanText(s?.duration) ||
        cleanText(details?.duration, "");

      const price =
        s?.price ??
        details?.price ??
        s?.amount ??
        details?.amount ??
        null;

      const bio =
        cleanText(s?.bio) ||
        cleanText(details?.bio) ||
        "";

      return {
        id: s?.id || s?._id || s?.serviceId || `${idx}`,
        title,
        price,
        estimatedDuration,
        description,
        bio,
        rating: Number(s?.rating || details?.rating || 0),
        isActive:
          typeof s?.isActive === "boolean"
            ? s.isActive
            : typeof details?.isActive === "boolean"
            ? details.isActive
            : true,
        icon: String(title).toLowerCase().includes("battery")
          ? battery
          : String(title).toLowerCase().includes("camera")
          ? cameraImage
          : String(title).toLowerCase().includes("charg")
          ? flashImage
          : settingImage,
      };
    });
}, [artisan]);

const servicesToShow = apiServices;

  const mappedRecommendations = useMemo(() => {
    return (recommendedArtisans || [])
      .filter((a) => String(a.id || a._id) !== String(artisan?.id || artisanId))
      .map((a) => ({
        id: a.id || a._id,
        name: cleanText(a.fullName, cleanText(a.businessName, "Unnamed Artisan")),
        location: cleanText(a.location, "Unknown location"),
        rating: Number(a.rating || 0),
        skills: Array.isArray(a.skillSet)
          ? a.skillSet
          : Array.isArray(a.skills)
          ? a.skills
          : [],
        image: a.profilePicture || a.avatar || johnOne,
        isAvailableNow: Boolean(a.isAvailableNow),
        raw: a,
      }));
  }, [recommendedArtisans, artisan?.id, artisanId]);
  
useEffect(() => {
  const wrap = marqueeWrapRef.current;
  const track = marqueeTrackRef.current;
  if (!wrap || !track) return;

  let animationFrameId;
  let isDragging = false;
  let isHovered = false;
  let startX = 0;
  let startScrollLeft = 0;
  const speed = 0.6;

  const getHalf = () => track.scrollWidth / 2;

  const normalizeLoop = () => {
    const half = getHalf();
    if (half <= 0) return;

    if (wrap.scrollLeft >= half) {
      wrap.scrollLeft -= half;
    } else if (wrap.scrollLeft <= 0) {
      wrap.scrollLeft += half;
    }
  };

  const animate = () => {
    if (!isDragging && !isHovered) {
      wrap.scrollLeft += speed;
      normalizeLoop();
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  const onDown = (x) => {
    isDragging = true;
    setIsDraggingMarquee(true);
    startX = x;
    startScrollLeft = wrap.scrollLeft;
  };

  const onMove = (x) => {
    if (!isDragging) return;
    const walk = x - startX;
    wrap.scrollLeft = startScrollLeft - walk;
    normalizeLoop();
  };

  const onUp = () => {
    isDragging = false;
    setIsDraggingMarquee(false);
  };

  // Mouse
  wrap.addEventListener("mousedown", (e) => onDown(e.pageX));
  window.addEventListener("mousemove", (e) => onMove(e.pageX));
  window.addEventListener("mouseup", onUp);

  // Touch
  wrap.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (t) onDown(t.pageX);
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    if (t) onMove(t.pageX);
  }, { passive: false });

  window.addEventListener("touchend", onUp);

  // Hover pause
  wrap.addEventListener("mouseenter", () => (isHovered = true));
  wrap.addEventListener("mouseleave", () => (isHovered = false));

  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}, [mappedRecommendations.length]);

  const renderStars = (rating) => {
    const r = Math.max(0, Math.min(5, Number(rating || 0)));
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <span className="flex">
        {"★"
          .repeat(full)
          .split("")
          .map((_, i) => (
            <span key={`f-${i}`} className="text-yellow-400">
              ★
            </span>
          ))}
        {half && <span className="text-yellow-400">☆</span>}
        {"☆"
          .repeat(empty)
          .split("")
          .map((_, i) => (
            <span key={`e-${i}`} className="text-gray-300">
              ☆
            </span>
          ))}
      </span>
    );
  };

const handleBookRepair = () => {
  if (!artisan) return;

  navigate("/client/booking-summary-a", {
    state: {
      artisan,
      draftOrderId: requestState.draftOrderId,
      uploadedProductId: requestState.uploadedProductId,
      deviceType: requestState.deviceType,
      deviceBrand: requestState.deviceBrand,
      deviceModel: requestState.deviceModel,
      serviceRequired: requestState.serviceRequired,
      description: requestState.description,
      objectName: requestState.objectName,
      rawConfirm: requestState.rawConfirm,
    },
  });
};

  const handleRecommendedProfile = (recommended) => {
    navigate(`/client/a-profile/${recommended.id}`, {
    // navigate(`/client/artisan-profile/${recommended.id}`, {
      state: {
        artisan: recommended.raw,
        draftOrderId: requestState.draftOrderId,
        uploadedProductId: requestState.uploadedProductId,
        deviceType: requestState.deviceType,
        deviceBrand: requestState.deviceBrand,
        deviceModel: requestState.deviceModel,
        serviceRequired: requestState.serviceRequired,
        description: requestState.description,
        objectName: requestState.objectName,
        rawConfirm: requestState.rawConfirm,
      },
    });
  };

  if (loadingArtisan || !artisan) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading artisan profile...
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="w-full bg-[#3E83C4] py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <img
                src={artisan.profilePicture || profileImage}
                alt="Artisan"
                className="w-70 h-70 rounded-xl object-cover"
              />

              <span
                className="absolute top-1 right-1 
  bg-[linear-gradient(90deg,#3E83C4,#9747FF,#1E3F5E)]
  text-white text-xs px-3 py-1 rounded-full
  shadow-md tracking-wide"
              >
                Early User
              </span>
            </div>

            <div className="flex-1 text-white">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">{artisan.fullName}</h2>
                <img src={tick} alt="verified" className="w-5 h-5" />
              </div>

              <p>
    Business Name:{" "}
    <span className="font-medium">{artisan.businessName || "—"}</span>
  </p>

              {/* <p className="text-sm opacity-90 mt-1">Technician</p> */}

              <div className="mt-3 space-y-1 text-sm opacity-90">
  <p>
    Experience:{" "}
    <span className="font-medium">
      {yearsFromCreatedAt != null ? `${yearsFromCreatedAt}+ years` : "—"}
    </span>
  </p>
  <p>
    Location: <span className="font-medium">{artisan.location}</span>
  </p>
  
  <p>
    Phone:{" "}
    <span className="font-medium">{artisan.phoneNumber || "—"}</span>
  </p>
  <p>
    Email: <span className="font-medium">{artisan.email || "—"}</span>
  </p>
</div>

              <button
                onClick={handleBookRepair}
                className="mt-5 bg-white text-[#3E83C4] px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition cursor-pointer"
              >
                Book repair
              </button>
            </div>

            <div className="text-white flex flex-col items-center md:items-end gap-4">
              <button className="p-2 rounded-md transition cursor-pointer">
                <img src={share} alt="share" className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {(artisan.categories?.length
                  ? artisan.categories
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
                        className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs"
                      >
                        {label}
                      </span>
                    );
                  })}
              </div>

              <div className="mt-2 flex flex-wrap gap-2 justify-end">
                {(artisan.skills || []).slice(0, 3).map((s, idx) => {
                  const label =
                    typeof s === "string"
                      ? s
                      : s?.name || s?.title || `Skill ${idx + 1}`;
                  return (
                    <span
                      key={label + idx}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-xs"
                    >
                      {label}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-sm">
                {renderStars(artisan.rating)}
                <span className="text-white">
                  {Number(artisan.rating || 0).toFixed(1)} ({artisan.reviewsCount || 0} reviews)
                </span>
              </div>

              <div className="text-center mt-2 text-white">
                <p className="text-2xl font-semibold">{artisan.totalRepairs ?? 0}</p>
                <p className="text-xs opacity-90">Total Repairs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-8 md:px-18 py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="mb-16">
  <h2 className="text-3xl font-bold text-black mb-8">About Me</h2>
  <div className="bg-white">
    <p className="text-[#535353] leading-relaxed text-lg">
  {artisan?.bio?.trim() ? artisan.bio : "No bio added yet."}
</p>
  </div>

  <div className="mt-8">
    <h3 className="text-xl font-semibold text-black mb-4">Skills</h3>
    <div className="flex flex-wrap gap-3">
      {(artisan.skills || []).length > 0 ? (
        artisan.skills.map((skill, idx) => {
          const label =
            typeof skill === "string"
              ? skill
              : skill?.name || skill?.title || `Skill ${idx + 1}`;

          return (
            <span
              key={label + idx}
              className="bg-[#C1DAF3] text-[#3E83C4] px-4 py-2 rounded-full text-sm"
            >
              {label}
            </span>
          );
        })
      ) : (
        <p className="text-[#535353]">No skills added yet.</p>
      )}
    </div>
  </div>
</div>

          <div className="space-y-3 text-sm text-[#535353]">
            {[
              { label: "Monday", key: "monday" },
              { label: "Tuesday", key: "tuesday" },
              { label: "Wednesday", key: "wednesday" },
              { label: "Thursday", key: "thursday" },
              { label: "Friday", key: "friday" },
              { label: "Saturday", key: "saturday" },
              { label: "Sunday", key: "sunday" },
            ].map((dayObj) => {
              const hours = artisan?.businessHours?.[dayObj.key];
              const isClosed = !hours;

              return (
                <div key={dayObj.key} className="flex items-center gap-6">
                  <span className="w-24 text-[#8B8B8B]">{dayObj.label}:</span>

                  {isClosed ? (
                    <span className="text-[#8B8B8B]">Closed</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 bg-white">
                        {hours.open}
                      </span>
                      <span className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 bg-white">
                        {hours.close}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === "services"
                  ? "text-black border-b-2 border-[#3E83C4]"
                  : "text-[#8B8B8B] hover:text-gray-600"
              }`}
            >
              My Services & Pricing
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-sm font-medium transition ${
                activeTab === "reviews"
                  ? "text-black border-b-2 border-[#3E83C4]"
                  : "text-[#8B8B8B] hover:text-gray-600"
              }`}
            >
              Reviews & Ratings
            </button>
          </div>

          <div className="mt-8">
            {activeTab === "services" && (
              <div>
                {servicesError ? (
                  <div className="text-sm text-red-500 mb-4">{servicesError}</div>
                ) : null}

                {loadingServices ? (
                  <div className="text-sm text-gray-500">Loading services...</div>
                ) : apiServices.length === 0 ? (
  <div className="text-sm text-gray-500">
    No services available for this artisan right now.
  </div>
) : (
                  <div className="grid md:grid-cols-4 gap-6">
                    {servicesToShow.map((service) => (
                      <div
                        key={service.id}
                        className="border border-[#3E83C4] rounded-xl p-6 text-center hover:shadow-md transition"
                      >
                        <div className="flex justify-center mb-4">
                          <img src={service.icon} alt={service.title} className="w-12 h-12" />
                        </div>

                        <h3 className="font-medium text-sm text-[#3E83C4]">
                          {service.title}
                        </h3>

                        <p className="text-sm text-[#535353] mt-2">
                          Starting Price:{" "}
                          <span className="font-semibold text-black">
                            {service.price == null ? "—" : formatNaira(service.price)}
                          </span>
                        </p>

                                                <p className="text-xs text-gray-500 mt-2">
                          Duration:{" "}
                          <span className="text-black">
                            {service.estimatedDuration || "—"}
                          </span>
                        </p>

                        <p className="text-xs text-gray-500 mt-2">
                          Description:{" "}
                          <span className="text-black">
                            {service.description || "No service description added yet."}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="mt-6">
                <div className="text-sm text-gray-600">
                  ⭐ {artisan.rating || 0} average rating from{" "}
                  {artisan.reviewsCount || 0} reviews
                </div>

                <div className="mt-4 space-y-4">
                  {(artisan.reviewsList || []).length === 0 ? (
                    <div className="text-sm text-gray-500">No reviews yet.</div>
                  ) : (
                    artisan.reviewsList.slice(0, 5).map((r, idx) => (
                      <div
                        key={r.id || r._id || idx}
                        className="border rounded-lg p-4"
                      >
                        <p className="font-medium text-sm text-black">
                          {r.title || r.summary || "Review"}
                        </p>
                        <p className="text-xs text-[#535353] mt-1">
                          {r.comment || r.message || r.text || ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <h2 className="text-lg font-semibold text-black mb-6">You may also like</h2>
      
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />
      
            <div
              ref={marqueeWrapRef}
              className={`overflow-x-hidden select-none ${
                isDraggingMarquee ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <div
                ref={marqueeTrackRef}
                className="flex w-max gap-4"
                onDragStart={(e) => e.preventDefault()}
              >
                {[...Array(2)].flatMap((_, loopIndex) =>
                  loadingRecommendations
                    ? [...Array(3)].map((_, i) => (
                        <div
                          key={`loading-${loopIndex}-${i}`}
                          className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm animate-pulse"
                        >
                          <div className="w-full h-60 bg-gray-200 rounded-lg mb-4" />
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                          <div className="flex gap-2 mb-4">
                            <div className="h-6 w-16 bg-gray-200 rounded-md" />
                            <div className="h-6 w-16 bg-gray-200 rounded-md" />
                          </div>
                          <div className="h-10 bg-gray-200 rounded-md" />
                        </div>
                      ))
                    : mappedRecommendations.slice(0, 6).map((a, index) => (
                        <div
                          key={`${loopIndex}-${a.id}-${index}`}
                          onMouseEnter={() => setHoveredRecommendation(a.id)}
                          onMouseLeave={() => setHoveredRecommendation(null)}
                          className={`min-w-[300px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${
                            hoveredRecommendation && hoveredRecommendation !== a.id
                              ? "opacity-30 grayscale"
                              : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={a.image}
                              alt={a.name}
                              className="w-full h-60 object-cover rounded-lg"
                              onDragStart={(e) => e.preventDefault()}
                              onError={(e) => {
                                e.currentTarget.src = johnOne;
                              }}
                            />
                          </div>
      
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-black">{a.name}</h3>
      
                              {typeof a.isAvailableNow === "boolean" ? (
                                a.isAvailableNow ? (
                                  <span className="text-xs text-[#43A047] bg-[#C9E8CA] px-2 py-0.5 rounded-full">
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-xs text-[#8B8B8B] bg-[#EFEFEF] px-2 py-0.5 rounded-full">
                                    Offline
                                  </span>
                                )
                              ) : null}
                            </div>
      
                            <p className="text-sm text-[#535353] mb-2">{a.location}</p>
      
                            <div className="flex items-center gap-1 text-sm mb-3">
                              <img src={starIcon} alt="star" className="w-4 h-4" />
                              <span className="font-medium text-black">{a.rating}</span>
                            </div>
      
                            <div className="flex gap-2 mb-4 flex-wrap">
                              {(a.skills || []).slice(0, 3).map((s, idx) => {
                                const label =
                                  typeof s === "string"
                                    ? s
                                    : s?.name || s?.title || `Skill ${idx + 1}`;
                                return (
                                  <span
                                    key={label + idx}
                                    className="text-xs text-[#3E83C4] bg-[#C1DAF3] px-2 py-1 rounded-md"
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                            </div>
      
                            <button
                              onClick={() => handleRecommendedProfile(a)}
                              className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition cursor-pointer"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArtisanProfile;