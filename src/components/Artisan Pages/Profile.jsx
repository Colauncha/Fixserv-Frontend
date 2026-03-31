import { useEffect, useRef, useState } from "react";
import { getAuthUser, getAuthToken } from "../../utils/auth";
import star from "../../assets/Artisan Images/star.png";
import locationIcon from "../../assets/Artisan Images/location.png";
import badge from "../../assets/Artisan Images/badge.png";
import profileImg from "../../assets/Artisan Images/adebayo.png";
import { useAuth } from "../../context/AuthContext";
import ArtisanHeader from "./ArtisanHeader";
import {
  getArtisanById,
  getArtisanServices,
  createArtisanService,
  updateArtisanData,
  updateArtisanService,
} from "../../api/artisan.api";

const getUserFriendlyError = (err, fallback = "Something went wrong. Please try again.") => {
  const msg = String(err?.message || "").toLowerCase();

  // 🌐 Network issues
  if (msg.includes("failed to fetch") || msg.includes("network error")) {
    return "Network error. Please check your internet connection.";
  }

  // 🔐 Auth issues
  if (msg.includes("unauthorized") || msg.includes("401")) {
    return "Session expired. Please login again.";
  }

  // 🚫 Forbidden
  if (msg.includes("403")) {
    return "You don’t have permission to perform this action.";
  }

  // ❌ Not found
  if (msg.includes("404")) {
    return "Requested data not found.";
  }

  if (msg.includes("400") || msg.includes("invalid")) {
    return "Invalid input. Please check your details and try again.";
  }

  if (msg.includes("timeout")) {
  return "The request took too long. Please try again.";
}

  if (msg.includes("500") || msg.includes("server")) {
    return "Server error. Please try again later.";
  }

  if (msg.includes("upload")) {
    return "Image upload failed. Please try again.";
  }

  return fallback;
};

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const defaultBusinessHours = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "", close: "" },
  sunday: { open: "", close: "" },
};

const isValidTime = (value) => {
  if (typeof value !== "string") return false;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
};

const getSavedBio = (artisanId) => {
  if (!artisanId) return "";
  return localStorage.getItem(`fixserv_artisan_bio_${artisanId}`) || "";
};

const setSavedBio = (artisanId, bio) => {
  if (!artisanId) return;
  localStorage.setItem(`fixserv_artisan_bio_${artisanId}`, bio || "");
};

const normalizeHours = (hours) => {
  const src = hours && typeof hours === "object" ? hours : {};
  const out = {};

  for (const day of DAYS) {
    const rawOpen = String(src?.[day]?.open || "").trim();
    const rawClose = String(src?.[day]?.close || "").trim();

    const isClosed =
      rawOpen.toLowerCase() === "closed" ||
      rawClose.toLowerCase() === "closed" ||
      rawOpen === "" ||
      rawClose === "" ||
      !isValidTime(rawOpen) ||
      !isValidTime(rawClose);

    out[day] = isClosed
      ? { open: "", close: "" }
      : { open: rawOpen, close: rawClose };
  }

  return out;
};

const toClosedMap = (hoursObj) => {
  const out = {};
  for (const day of DAYS) {
    const open = hoursObj?.[day]?.open || "";
    const close = hoursObj?.[day]?.close || "";
    out[day] = !open || !close;
  }
  return out;
};

const normalizeSkills = (user) => {
  if (Array.isArray(user?.skillSet)) return user.skillSet;
  if (Array.isArray(user?.skills)) return user.skills;
  return [];
};

const normalizeProfileImage = (user) => {
  return user?.profileImage || user?.profilePicture || user?.imageUrl || "";
};

const normalizeService = (service = {}) => {
  const src = service?.details && typeof service.details === "object"
    ? { ...service, ...service.details }
    : service;

  return {
    id: src?.id || src?._id || src?.serviceId || service?.id || service?._id || "",
    title: src?.title || "",
    price:
      src?.price !== undefined && src?.price !== null ? String(src.price) : "",
    estimatedDuration: src?.estimatedDuration || "",
    description: src?.description || "",
    bio: src?.bio || "",
    isActive: typeof src?.isActive === "boolean" ? src.isActive : true,
    rating: src?.rating ?? 0,
  };
};

const buildServiceForms = (services = []) => {
  if (Array.isArray(services) && services.length > 0) {
    return services.map((service) => normalizeService(service));
  }

  return [
    {
      id: "",
      title: "",
      price: "",
      estimatedDuration: "",
      description: "",
      isActive: true,
      rating: 0,
    },
  ];
};

const formatDayLabel = (day) => day.charAt(0).toUpperCase() + day.slice(1);

const Profile = () => {
  const { setUser } = useAuth();

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    location: "",
    phoneNumber: "",
    skillsText: "",
    bio: "",
    businessHours: normalizeHours(defaultBusinessHours),
    closedDays: toClosedMap(normalizeHours(defaultBusinessHours)),
    serviceDetails: buildServiceForms([]),
  });

  const fileRef = useRef(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccessMsg("");

        const cachedUser = getAuthUser();

        if (!cachedUser) {
          setLoading(false);
          return;
        }

        const artisanId = cachedUser?.id || cachedUser?._id || cachedUser?.artisanId;
        if (!artisanId) {
          throw new Error("Missing artisan id.");
        }

        let freshUser = cachedUser;
        let services = [];

               try {
          freshUser = await getArtisanById(artisanId);
          console.log("FRESH ARTISAN PROFILE =>", freshUser);
        } catch (err) {
          console.error("Failed to fetch latest artisan profile", err);
        }

        try {
          services = await getArtisanServices(artisanId);
          console.log("ARTISAN SERVICES =>", services);
        } catch (err) {
          console.error("Failed to fetch artisan services", err);
        }

        const resolvedArtisanId =
          freshUser?.id || cachedUser?.id || cachedUser?._id || cachedUser?.artisanId;

        const fallbackBio =
          getSavedBio(resolvedArtisanId) ||
          cachedUser?.bio ||
          "";

        const normalizedUser = {
          ...cachedUser,
          ...freshUser,
          id: resolvedArtisanId,
          profileImage:
            normalizeProfileImage(freshUser) || normalizeProfileImage(cachedUser),
          skills: normalizeSkills(freshUser).length
            ? normalizeSkills(freshUser)
            : normalizeSkills(cachedUser),
          skillSet: normalizeSkills(freshUser).length
            ? normalizeSkills(freshUser)
            : normalizeSkills(cachedUser),
                    bio:
            typeof freshUser?.bio === "string" && freshUser.bio.trim() !== ""
              ? freshUser.bio
              : fallbackBio,
          businessHours: normalizeHours(
            freshUser?.businessHours ||
              cachedUser?.businessHours ||
              defaultBusinessHours
          ),
          services: Array.isArray(services) ? services : [],
        };

                setArtisan(normalizedUser);
        setSavedBio(normalizedUser.id, normalizedUser.bio || "");

        const hours = normalizeHours(normalizedUser.businessHours);
        const closed = toClosedMap(hours);
                const serviceForms = buildServiceForms(normalizedUser.services);

        setFormData({
          fullName: normalizedUser.fullName || "",
          businessName: normalizedUser.businessName || "",
          location: normalizedUser.location || "",
          phoneNumber: normalizedUser.phoneNumber || normalizedUser.phone || "",
          skillsText: (normalizedUser.skillSet || normalizedUser.skills || []).join(", "),
          bio: normalizedUser?.bio || "",
          businessHours: hours,
          closedDays: closed,
          serviceDetails: serviceForms,
        });

        setUser(normalizedUser);
        localStorage.setItem("fixserv_user", JSON.stringify(normalizedUser));
      } catch (err) {
        console.error("Failed to load profile", err);
        setError(getUserFriendlyError(err, "Unable to load profile."));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccessMsg("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceFieldChange = (index, field, value) => {
    setError("");
    setSuccessMsg("");

    setFormData((prev) => ({
      ...prev,
      serviceDetails: prev.serviceDetails.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const addServiceRow = () => {
    setError("");
    setSuccessMsg("");

    setFormData((prev) => ({
      ...prev,
      serviceDetails: [
        ...prev.serviceDetails,
        {
          id: "",
          title: "",
          price: "",
          estimatedDuration: "",
          description: "",
          isActive: true,
          rating: 0,
        },
      ],
    }));
  };

  const removeServiceRow = (index) => {
    setError("");
    setSuccessMsg("");

    setFormData((prev) => {
      if (prev.serviceDetails.length === 1) {
        return {
          ...prev,
          serviceDetails: [
            {
              id: "",
              title: "",
              price: "",
              estimatedDuration: "",
              description: "",
              isActive: true,
              rating: 0,
            },
          ],
        };
      }

      return {
        ...prev,
        serviceDetails: prev.serviceDetails.filter((_, i) => i !== index),
      };
    });
  };

  const setHoursField = (day, field, value) => {
    setError("");
    setSuccessMsg("");

    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...(prev.businessHours?.[day] || {}),
          [field]: value,
        },
      },
    }));
  };

  const toggleClosed = (day) => {
    setError("");
    setSuccessMsg("");

    setFormData((prev) => {
      const nextClosed = !prev.closedDays?.[day];

      return {
        ...prev,
        closedDays: {
          ...prev.closedDays,
          [day]: nextClosed,
        },
        businessHours: {
          ...prev.businessHours,
          [day]: nextClosed
            ? { open: "", close: "" }
            : {
                open: prev.businessHours?.[day]?.open || defaultBusinessHours[day].open,
                close:
                  prev.businessHours?.[day]?.close || defaultBusinessHours[day].close,
              },
        },
      };
    });
  };

  const copyMondayToAll = () => {
    setFormData((prev) => {
      const mondayClosed = !!prev.closedDays?.monday;
      const mondayHours = prev.businessHours?.monday || defaultBusinessHours.monday;

      const nextBusinessHours = {};
      const nextClosedDays = {};

      for (const day of DAYS) {
        nextClosedDays[day] = mondayClosed;
        nextBusinessHours[day] = mondayClosed
          ? { open: "", close: "" }
          : { open: mondayHours.open, close: mondayHours.close };
      }

      return {
        ...prev,
        businessHours: nextBusinessHours,
        closedDays: nextClosedDays,
      };
    });
  };

  const copyMondayToWeekdays = () => {
    setFormData((prev) => {
      const mondayClosed = !!prev.closedDays?.monday;
      const mondayHours = prev.businessHours?.monday || defaultBusinessHours.monday;

      const nextBusinessHours = { ...prev.businessHours };
      const nextClosedDays = { ...prev.closedDays };

      const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

      for (const day of weekdays) {
        nextClosedDays[day] = mondayClosed;
        nextBusinessHours[day] = mondayClosed
          ? { open: "", close: "" }
          : { open: mondayHours.open, close: mondayHours.close };
      }

      return {
        ...prev,
        businessHours: nextBusinessHours,
        closedDays: nextClosedDays,
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const artisanId = artisan?.id || artisan?._id || artisan?.artisanId;
      if (!artisanId) throw new Error("Missing artisan id. Cannot update profile.");

      const cleanedSkills = String(formData.skillsText || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

     const strictHours = {};

for (const day of DAYS) {
  const isClosed = !!formData.closedDays?.[day];

  if (isClosed) {
    strictHours[day] = { open: "", close: "" };
    continue;
  }

  const open = String(formData.businessHours?.[day]?.open || "").trim();
  const close = String(formData.businessHours?.[day]?.close || "").trim();

  if (!isValidTime(open) || !isValidTime(close)) {
    throw new Error(
      `Please enter valid business hours for ${formatDayLabel(day)} or mark it closed.`
    );
  }

  strictHours[day] = { open, close };
}

const artisanPayload = {
  fullName: formData.fullName.trim(),
  businessName: formData.businessName.trim(),
  location: formData.location.trim(),
  phoneNumber: formData.phoneNumber.trim(),
  skillSet: cleanedSkills,
  bio: formData.bio.trim(),
  businessHours: strictHours,
};

      console.log("ARTISAN PATCH PAYLOAD =>", artisanPayload);

            const artisanResponse = await updateArtisanData(artisanId, artisanPayload);
      console.log("UPDATE ARTISAN RESPONSE =>", artisanResponse);
      setSavedBio(artisanId, formData.bio.trim());

      const submittedServices = formData.serviceDetails
        .map((service) => ({
          ...service,
          title: String(service.title || "").trim(),
          description: String(service.description || "").trim(),
          estimatedDuration: String(service.estimatedDuration || "").trim(),
          price: String(service.price || "").trim(),
        }))
        .filter(
          (service) =>
            service.title ||
            service.description ||
            service.estimatedDuration ||
            service.price
        );

        const nextHours = normalizeHours(strictHours);

      const updatedServices = [];

      for (const service of submittedServices) {
        const numericPrice = service.price === "" ? 0 : Number(service.price);

        if (Number.isNaN(numericPrice) || numericPrice < 0) {
          throw new Error(`Service price for "${service.title || "Untitled service"}" must be a valid number.`);
        }

        const sharedBio = formData.bio.trim();

const createPayload = {
  title: service.title,
  description: service.description,
  bio: sharedBio,
  price: numericPrice,
  estimatedDuration: service.estimatedDuration,
  rating: service.rating ?? 0,
};

const updatePayload = {
  title: service.title,
  description: service.description,
  bio: sharedBio,
  price: numericPrice,
  estimatedDuration: service.estimatedDuration,
  isActive: typeof service.isActive === "boolean" ? service.isActive : true,
};

        if (service.id) {
                    const updated = await updateArtisanService(service.id, updatePayload);
          console.log("UPDATE SERVICE RESPONSE =>", updated);

          updatedServices.push({
  ...service,
  ...updated,
  id: updated?.id || updated?._id || updated?.serviceId || service.id,
  price: numericPrice,
  description: updated?.description ?? service.description,
  bio: updated?.bio ?? sharedBio,
  estimatedDuration:
    updated?.estimatedDuration ?? service.estimatedDuration,
  title: updated?.title ?? service.title,
  isActive:
    typeof updated?.isActive === "boolean"
      ? updated.isActive
      : service.isActive,
  rating: updated?.rating ?? service.rating ?? 0,
});
        } else {
                    const created = await createArtisanService(createPayload);
          console.log("CREATE SERVICE RESPONSE =>", created);

          updatedServices.push({
  ...service,
  ...created,
  id: created?.id || created?._id || created?.serviceId || "",
  price: created?.price ?? numericPrice,
  description: created?.description ?? service.description,
  bio: created?.bio ?? sharedBio,
  estimatedDuration:
    created?.estimatedDuration ?? service.estimatedDuration,
  title: created?.title ?? service.title,
  isActive:
    typeof created?.isActive === "boolean" ? created.isActive : true,
  rating: created?.rating ?? service.rating ?? 0,
});
        }
      }

      const updatedUser = {
        ...artisan,
        ...artisanResponse,
        id: artisanResponse?.id || artisan?.id || artisanId,
        profileImage:
          normalizeProfileImage(artisanResponse) || normalizeProfileImage(artisan),
          phoneNumber:
  artisanResponse?.phoneNumber ||
  artisanResponse?.phone ||
  formData.phoneNumber.trim(),
phone:
  artisanResponse?.phone ||
  artisanResponse?.phoneNumber ||
  formData.phoneNumber.trim(),
        skills: Array.isArray(artisanResponse?.skills)
          ? artisanResponse.skills
          : Array.isArray(artisanResponse?.skillSet)
          ? artisanResponse.skillSet
          : cleanedSkills,
        skillSet: Array.isArray(artisanResponse?.skillSet)
          ? artisanResponse.skillSet
          : Array.isArray(artisanResponse?.skills)
          ? artisanResponse.skills
          : cleanedSkills,
                                bio:
          typeof artisanResponse?.bio === "string" &&
          artisanResponse.bio.trim() !== ""
            ? artisanResponse.bio
            : formData.bio.trim() || getSavedBio(artisanId),
        businessHours: nextHours,
        services: updatedServices,
      };

      setArtisan(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

            setFormData({
        fullName: updatedUser.fullName || "",
        businessName: updatedUser.businessName || "",
        location: updatedUser.location || "",
        phoneNumber: updatedUser.phoneNumber || updatedUser.phone || "",
        skillsText: (updatedUser.skillSet || updatedUser.skills || []).join(", "),
        bio: updatedUser?.bio || "",
        businessHours: nextHours,
        closedDays: toClosedMap(nextHours),
        serviceDetails: buildServiceForms(updatedServices),
      });

      setIsEditing(false);
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile", err);
      // setError(err?.message || "Failed to update profile");
      setError(getUserFriendlyError(err, "Failed to update profile."));
    } finally {
      setSaving(false);
    }
  };

  const onPickImage = () => fileRef.current?.click();

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setError("Please select an image file.");
      return;
    }

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image must be less than ${maxMB}MB.`);
      return;
    }

    setError("");
    setSuccessMsg("");
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const uploadProfilePicture = async () => {
    try {
      setUploadingImg(true);
      setError("");
      setSuccessMsg("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const userId = artisan?.id || artisan?._id || artisan?.artisanId;
      if (!userId) throw new Error("Missing user id. Cannot upload image.");

      if (!imgFile) throw new Error("Please select an image first.");

      const fd = new FormData();
      fd.append("profilePicture", imgFile);

      const url = `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

let data = null;
let rawText = "";

try {
  data = await res.json();
} catch {
  try {
    rawText = await res.text();
  } catch {
    rawText = "";
  }
}

if (!res.ok) {
  const apiError =
    data?.message ||
    data?.error ||
    data?.detail ||
    (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
    rawText ||
    `Upload failed (HTTP ${res.status})`;

  throw new Error(apiError);
}


      const imageUrl =
        data?.imageUrl ||
        data?.user?.profilePicture ||
        data?.user?.profileImage ||
        "";

      const updatedUser = {
        ...artisan,
        ...(data?.user || {}),
        profileImage: imageUrl || artisan?.profileImage || "",
      };

      setArtisan(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

      setImgFile(null);
      setImgPreview("");
      setSuccessMsg("Profile picture updated successfully.");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Upload profile picture failed", err);
//       setError(
//   typeof err?.message === "string" && err.message.trim() !== ""
//     ? err.message
//     : "Image upload failed. Please try again."
// );

setError(getUserFriendlyError(err, "Image upload failed. Please try again."));

    } finally {
      setUploadingImg(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  const shownProfileImage =
    imgPreview || artisan?.profileImage || artisan?.profilePicture || profileImg;

  const headerProfileImage =
    artisan?.profileImage || artisan?.profilePicture || profileImg;

  const displayServices = Array.isArray(artisan?.services) ? artisan.services : [];

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300">
      <ArtisanHeader title="Profile" profileImage={headerProfileImage} />

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

      <div className="mt-6">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="flex flex-col items-center w-full xl:w-auto">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 group">
              <img
                src={shownProfileImage}
                alt="artisan"
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-[#3E83C4]/30"
              />

              <div className="absolute -bottom-1 left-2">
                <img src={badge} alt="badge" className="w-10 sm:w-12" />
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileSelected}
                className="hidden"
              />

              <button
                type="button"
                onClick={onPickImage}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs sm:text-sm font-medium rounded-full"
              >
                Change Photo
              </button>
            </div>

            {imgFile && (
              <button
                type="button"
                onClick={uploadProfilePicture}
                disabled={uploadingImg}
                className="mt-4 w-full sm:w-48 bg-[#3E83C4] hover:bg-[#2f6fa8] transition-all duration-300 text-white text-sm font-medium py-2 rounded-lg shadow-sm disabled:opacity-50"
              >
                {uploadingImg ? "Uploading..." : "Save Photo"}
              </button>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col justify-center gap-3">
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
              />
            ) : (
              <h2 className="text-2xl sm:text-3xl font-semibold break-words">
                {artisan.fullName}
              </h2>
            )}

            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Business:</span>{" "}
              {isEditing ? (
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business name"
                  className="mt-2 w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
                />
              ) : (
                <span className="break-words">{artisan.businessName || "—"}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
              <img src={star} alt="rating" className="w-4" />
              <span>
                {artisan.rating || 0} ({artisan.reviewsCount || 0})
              </span>
            </div>

            <div className="flex items-start sm:items-center gap-2 text-sm text-gray-600">
              <img src={locationIcon} alt="location" className="w-4 mt-1 sm:mt-0" />
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location (Location should be in Lagos.)"
                  className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
                />
              ) : (
                <span className="break-words">{artisan.location || "—"}</span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mt-8 ${
            isEditing ? "bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100" : ""
          }`}
        >
          <h3 className="font-semibold mb-2">Skills</h3>

          {isEditing ? (
            <input
              type="text"
              placeholder="Separate skills with commas (e.g. phone repair, laptop repair)"
              value={formData.skillsText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, skillsText: e.target.value }))
              }
              className="border px-3 py-2 rounded-md w-full"
            />
          ) : (
            <p className="text-sm text-gray-600 break-words">
              {(artisan.skillSet || artisan.skills || []).length > 0
                ? (artisan.skillSet || artisan.skills).join(", ")
                : "—"}
            </p>
          )}
        </div>

                <div
          className={`mt-8 ${
            isEditing ? "bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100" : ""
          }`}
        >
          <h3 className="font-semibold mb-2">Bio</h3>

          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter artisan bio"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition resize-none"
            />
          ) : (
            <p className="text-sm text-gray-600 break-words">
              {artisan?.bio || "—"}
            </p>
          )}
        </div>

        <div
          className={`mt-8 ${
            isEditing ? "bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100" : ""
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-semibold">Service details</h3>

            {isEditing ? (
              <button
                type="button"
                onClick={addServiceRow}
                className="px-4 py-2 rounded-lg bg-[#3E83C4] text-white text-sm font-medium"
              >
                Add Service
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <div className="space-y-6">
              {formData.serviceDetails.map((service, index) => (
                <div
                  key={service.id || `service-${index}`}
                  className="border border-gray-200 rounded-xl p-4 bg-white"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-700">
                      Service {index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => removeServiceRow(index)}
                      className="text-sm px-3 py-1.5 rounded-md border border-red-200 text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Service title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          handleServiceFieldChange(index, "title", e.target.value)
                        }
                        placeholder="Enter service title"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Service price
                      </label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) =>
                          handleServiceFieldChange(index, "price", e.target.value)
                        }
                        placeholder="Enter service price"
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
                      />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Estimated duration
                      </label>
                      <input
                        type="text"
                        value={service.estimatedDuration}
                        onChange={(e) =>
                          handleServiceFieldChange(
                            index,
                            "estimatedDuration",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 2 hours, 3 days, 2 months"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
                      />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          handleServiceFieldChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Enter service description"
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5 text-sm text-gray-600">
              {displayServices.length > 0 ? (
                displayServices.map((service, index) => (
                  <div
                    key={service?.id || service?._id || service?.serviceId || index}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Service {index + 1} title:</span>{" "}
                      {service?.title || "—"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">Service price:</span>{" "}
                      {service?.price !== undefined &&
                      service?.price !== null &&
                      service?.price !== ""
                        ? service.price
                        : "—"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium text-gray-700">
                        Estimated duration:
                      </span>{" "}
                      {service?.estimatedDuration || "—"}
                    </p>
                    <p className="break-words">
                      <span className="font-medium text-gray-700">Description:</span>{" "}
                      {service?.description || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p>—</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h3 className="font-semibold">Business hours</h3>

            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={copyMondayToWeekdays}
                  className="text-xs px-3 py-2 rounded-md border"
                >
                  Copy Monday → Weekdays
                </button>
                <button
                  type="button"
                  onClick={copyMondayToAll}
                  className="text-xs px-3 py-2 rounded-md border"
                >
                  Copy Monday → All
                </button>
              </div>
            ) : null}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              {DAYS.map((day) => {
                const isClosed = !!formData.closedDays?.[day];
                const rawOpen = formData.businessHours?.[day]?.open || "";
                const rawClose = formData.businessHours?.[day]?.close || "";

                return (
                  <div
                    key={day}
                    className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 text-sm bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="w-full lg:w-24 capitalize text-gray-700 font-medium">
                      {day}
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isClosed}
                        onChange={() => toggleClosed(day)}
                      />
                      <span className="text-gray-600">Closed</span>
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <input
                        type="time"
                        value={rawOpen}
                        disabled={isClosed}
                        onChange={(e) => setHoursField(day, "open", e.target.value)}
                        className={`border px-2 py-1 rounded-md ${
                          isClosed ? "opacity-50" : ""
                        }`}
                      />

                      <span className="text-gray-500 hidden sm:inline">to</span>

                      <input
                        type="time"
                        value={rawClose}
                        disabled={isClosed}
                        onChange={(e) => setHoursField(day, "close", e.target.value)}
                        className={`border px-2 py-1 rounded-md ${
                          isClosed ? "opacity-50" : ""
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-gray-600 space-y-2">
              {DAYS.map((day) => {
                const open = artisan.businessHours?.[day]?.open || "";
                const close = artisan.businessHours?.[day]?.close || "";
                const closed = !open || !close;

                return (
                  <div key={day} className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="w-full sm:w-24 capitalize font-medium text-gray-700">
                      {day}:
                    </span>
                    <span>{closed ? "Closed" : `${open} - ${close}`}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 space-y-5">
          <h3 className="text-lg font-semibold">Contact info</h3>

          <div className="space-y-4 text-sm text-gray-500">
            {/* <p className="break-words">
              <span className="font-medium text-gray-700">Phone :</span>{" "}
              {artisan.phone || artisan.phoneNumber || "—"}
            </p> */}

            <div className="break-words">
  <span className="font-medium text-gray-700">Phone :</span>{" "}
  {isEditing ? (
    <input
      type="text"
      name="phoneNumber"
      value={formData.phoneNumber}
      onChange={handleChange}
      placeholder="Phone number"
      className="mt-2 w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
    />
  ) : (
    <span>{artisan.phone || artisan.phoneNumber || "—"}</span>
  )}
</div>

            <p className="break-words">
              <span className="font-medium text-gray-700">Email :</span>{" "}
              {artisan.email || "—"}
            </p>

            {isEditing ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 mb-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 transition text-white px-8 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setError("");
                  setSuccessMsg("");
                  setIsEditing(true);
                }}
                className="mt-6 mb-10 w-full sm:w-auto bg-[#3E83C4] hover:bg-[#2f6fa8] transition text-white px-8 py-2.5 rounded-lg font-medium shadow-sm cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;