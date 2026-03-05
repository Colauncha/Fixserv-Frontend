import React, { useState, useEffect } from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import tick from "../../assets/client images/client-home/tick.png";
import share from "../../assets/client images/client-home/share.png";
import settingImage from "../../assets/client images/client-home/setting.png";
import battery from "../../assets/client images/client-home/battery.png";
import flashImage from "../../assets/client images/client-home/flash.png";
import cameraImage from "../../assets/client images/client-home/camera.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import starIcon from "../../assets/client images/client-home/star.png";
import { useNavigate, useParams } from "react-router-dom";

const ClientArtisanProfile = () => {
  const navigate = useNavigate();
  const { artisanId } = useParams();
  const cleanText = (v, fallback = "") =>
  typeof v === "string" && v.trim() === "" ? fallback : v ?? fallback;

  const [artisan, setArtisan] = useState(null);
  const [loadingArtisan, setLoadingArtisan] = useState(true);

  const [activeTab, setActiveTab] = useState("services");

  const [recommendedArtisans, setRecommendedArtisans] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [artisanServices, setArtisanServices] = useState([]);
const [loadingServices, setLoadingServices] = useState(false);

const [servicesError, setServicesError] = useState("");

  const yearsFromCreatedAt = artisan?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(artisan.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      )
    : null;

  const fallbackServices = [
    { id: 1, title: "Screen Replacement", price: 12000, icon: settingImage },
    { id: 2, title: "Battery Replacement", price: 7000, icon: battery },
    { id: 3, title: "Charging port Fix", price: 5000, icon: flashImage },
    { id: 4, title: "Camera Repair", price: 8000, icon: cameraImage },
    { id: 5, title: "General Diagnostics", price: 3500, icon: settingImage },
  ];

  const formatNaira = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return value; // allow backend to return "₦12,000"
    return `₦${num.toLocaleString("en-NG")}`;
  };

const apiServices = (Array.isArray(artisanServices) ? artisanServices : [])
  .filter((s) => s?.isActive !== false) // keep active only (if backend uses isActive)
  .map((s, idx) => ({
    id: s?.id || s?._id || `${idx}`,
    title: s?.title || "Service",
    description: s?.description || "",
    price: s?.price ?? null,
    estimatedDuration: s?.estimatedDuration || "",
    icon:
      String(s?.title || "").toLowerCase().includes("battery")
        ? battery
        : String(s?.title || "").toLowerCase().includes("camera")
        ? cameraImage
        : String(s?.title || "").toLowerCase().includes("charg")
        ? flashImage
        : settingImage,
  }));

  // const servicesToShow = apiServices.length > 0 ? apiServices : fallbackServices;

  const servicesToShow = apiServices; 

useEffect(() => {
  const fetchArtisanServices = async () => {
    if (!artisanId) return;

    try {
      setLoadingServices(true);
      setServicesError("");

      const token = localStorage.getItem("fixserv_token");

      const res = await fetch(`/service-api/api/service/artisan/${artisanId}`, {
  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
});

      const text = await res.text();
      let data;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(`Service API returned HTML (status ${res.status})`);
      }

      if (!res.ok) {
        throw new Error(data?.message || `Failed (${res.status})`);
      }

      const list = Array.isArray(data) ? data : data?.data || data?.services || [];
      setArtisanServices(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("SERVICES ERROR:", err);
      setServicesError(err.message || "Service API failed");
      setArtisanServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  fetchArtisanServices();
}, [artisanId]);

  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        setLoadingArtisan(true);

        const token = localStorage.getItem("fixserv_token");

        const res = await fetch(
          `https://dev-user-api.fixserv.co/api/admin/user/${artisanId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Failed to fetch artisan");
        }

        const raw = json?.data || json?.user || json;

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

        // ✅ reviews safety (prevents crashes if backend returns number)
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

        // ✅ IMPORTANT: backend uses skillSet
        const skills = Array.isArray(raw?.skillSet)
          ? raw.skillSet
          : Array.isArray(raw?.skills)
          ? raw.skills
          : [];

        const artisanData = {
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

          // if backend later adds this
          profilePicture:
            raw?.profilePicture || raw?.avatar || raw?.photoURL || "",
        };

        setArtisan(artisanData);
      } catch (err) {
        console.error(err);
        setArtisan(null);
      } finally {
        setLoadingArtisan(false);
      }
    };

    if (artisanId) fetchArtisan();
  }, [artisanId]);

  useEffect(() => {
    const fetchRecommendedArtisans = async () => {
      try {
        setLoadingRecommendations(true);

        const token = localStorage.getItem("fixserv_token");

        const res = await fetch(
          "https://dev-user-api.fixserv.co/api/admin/getAll?role=ARTISAN",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch artisans");
        }

        setRecommendedArtisans(data.users || []);
      } catch (err) {
        console.error("Recommendation error:", err);
        setRecommendedArtisans([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedArtisans();
  }, []);

const mappedRecommendations = (recommendedArtisans || [])
  .filter((a) => String(a.id || a._id) !== String(artisanId))
  .map((a) => ({
    id: a.id || a._id,
    name: cleanText(a.fullName, cleanText(a.businessName, "Unnamed Artisan")),
    location: cleanText(a.location, "Unknown location"),
    rating: Number(a.rating || 0),

    // ✅ getAll uses skillSet
    skills: Array.isArray(a.skillSet) ? a.skillSet : [],

    // ✅ getAll can return profilePicture
    image: a.profilePicture || johnOne,

    // not in your getAll response (so always false unless backend adds it)
    isAvailableNow: Boolean(a.isAvailableNow),
  }));

  if (loadingArtisan || !artisan) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading artisan profile...
      </div>
    );
  }

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

  return (
    <div className="w-full">
      <section className="w-full bg-[#3E83C4] py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* LEFT – IMAGE */}
            <div className="relative">
              <img
                src={artisan.profilePicture || profileImage}
                alt="Artisan"
                className="w-70 h-70 rounded-xl object-cover"
              />

              {/* Badge */}
              <span
                className="absolute top-1 right-1 
  bg-[linear-gradient(90deg,#3E83C4,#9747FF,#1E3F5E)]
  text-white text-xs px-3 py-1 rounded-full
  shadow-md tracking-wide"
              >
                Early User
              </span>
            </div>

            {/* CENTER – DETAILS */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">{artisan.fullName}</h2>
                <img src={tick} alt="verified" className="w-5 h-5" />
              </div>

              <p className="text-sm opacity-90 mt-1">Technician</p>

              <div className="mt-3 space-y-1 text-sm opacity-90">
                <p>
                  Experience:{" "}
                  <span className="font-medium">
                    {yearsFromCreatedAt != null ? `${yearsFromCreatedAt}+ years` : "—"}
                  </span>
                </p>
                <p>
                  Location:{" "}
                  <span className="font-medium">{artisan.location}</span>
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/client/booking/${artisan.id}`, { state: { artisan } })
                }
                className="mt-5 bg-white text-[#3E83C4] px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition cursor-pointer"
              >
                Request Appointment
              </button>
            </div>

            {/* RIGHT – STATS */}
            <div className="text-white flex flex-col items-center md:items-end gap-4">
              {/* Share */}
              <button className="p-2 rounded-md transition cursor-pointer">
                <img src={share} alt="share" className="w-4 h-4" />
              </button>

              {/* Categories */}
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

              {/* Top Skills */}
              <div className="mt-2 flex flex-wrap gap-2 justify-end">
                {(artisan.skills || []).slice(0, 3).map((s, idx) => {
                  const label =
                    typeof s === "string" ? s : s?.name || s?.title || `Skill ${idx + 1}`;
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

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm">
                {renderStars(artisan.rating)}
                <span className="text-white">
                  {Number(artisan.rating || 0).toFixed(1)} ({artisan.reviewsCount || 0} reviews)
                </span>
              </div>

              {/* Repairs */}
              <div className="text-center mt-2 text-white">
                <p className="text-2xl font-semibold">
                  {artisan.totalRepairs ?? 0}
                </p>
                <p className="text-xs opacity-90">Total Repairs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-8 md:px-18 py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          {/* About Me Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">About Me</h2>
            <div className="bg-white">
              <p className="text-[#535353] leading-relaxed text-lg">
                {artisan.bio || "No bio added yet."}
              </p>
            </div>
          </div>

          {/* Business Hours Section */}
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
              const isClosed = !hours; // normalized: closed => null

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
          {/* TABS */}
          <div className="flex gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-3 text-sm font-medium transition
                ${
                  activeTab === "services"
                    ? "text-black border-b-2 border-[#3E83C4]"
                    : "text-[#8B8B8B] hover:text-gray-600"
                }`}
            >
              My Services & Pricing
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 text-sm font-medium transition
                ${
                  activeTab === "reviews"
                    ? "text-black border-b-2 border-[#3E83C4]"
                    : "text-[#8B8B8B] hover:text-gray-600"
                }`}
            >
              Reviews & Ratings
            </button>
          </div>

          {/* CONTENT */}
          <div className="mt-8">
{activeTab === "services" && (
  <div>
    {servicesError ? (
      <div className="text-sm text-red-500 mb-4">{servicesError}</div>
    ) : null}

    {loadingServices ? (
      <div className="text-sm text-gray-500">Loading services...</div>
    ) : servicesToShow.length === 0 ? (
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

            {service.estimatedDuration ? (
              <p className="text-xs text-gray-500 mt-2">{service.estimatedDuration}</p>
            ) : null}

            {service.description ? (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {service.description}
              </p>
            ) : null}
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

          <div className="relative w-full overflow-hidden">
            <div className="flex w-max gap-8 marquee">
              {loadingRecommendations ? (
                <p className="text-sm text-gray-500 px-4">
                  Loading recommendations...
                </p>
              ) : (
                mappedRecommendations.slice(0, 6).map((a) => (
                  <div
                    key={a.id}
                    className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
                  >
                    <div className="relative">
                      <img
                        src={a.image}
                        alt={a.name}
                        className="w-full h-60 object-cover rounded-lg"
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

                      <div className="flex gap-2 mb-4">
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
                        onClick={() => navigate(`/client/artisan-profile/${a.id}`)}
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
      </section>
    </div>
  );
};

export default ClientArtisanProfile;