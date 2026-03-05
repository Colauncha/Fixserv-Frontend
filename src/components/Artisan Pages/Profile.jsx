import { useEffect, useRef, useState } from "react";
import { getAuthUser, getAuthToken } from "../../utils/auth";
import star from "../../assets/Artisan Images/star.png";
import locationIcon from "../../assets/Artisan Images/location.png";
import badge from "../../assets/Artisan Images/badge.png";
import profileImg from "../../assets/Artisan Images/adebayo.png";
import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/adebayo.png";
import { useAuth } from "../../context/AuthContext";



const DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const defaultBusinessHours = {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  wednesday: { open: "09:00", close: "18:00" },
  thursday: { open: "09:00", close: "18:00" },
  friday: { open: "09:00", close: "18:00" },
  saturday: { open: "09:00", close: "18:00" },
  sunday: { open: "09:00", close: "18:00" },
};

const isValidTime = (v) => {
  if (typeof v !== "string") return false;
  // accept "HH:mm" (browser time inputs use this)
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
};

const normalizeHours = (hours) => {
  const src = hours && typeof hours === "object" ? hours : {};
  const out = {};

  for (const d of DAYS) {
    const rawOpen = src?.[d]?.open;
    const rawClose = src?.[d]?.close;

    // If backend saved "closed" or anything invalid, force empty string
    const open = isValidTime(rawOpen) ? rawOpen : "";
    const close = isValidTime(rawClose) ? rawClose : "";

    // If both empty => closed (UI will show as Closed)
    out[d] = {
      open: open || defaultBusinessHours[d].open,
      close: close || defaultBusinessHours[d].close,
    };

    // IMPORTANT: if either is invalid we consider that day closed in UI
    if (!isValidTime(rawOpen) || !isValidTime(rawClose)) {
      out[d] = { open: "", close: "" };
    }
  }

  return out;
};

// Closed = open/close empty
const toClosedMap = (hoursObj) => {
  const out = {};
  for (const d of DAYS) {
    const o = hoursObj?.[d]?.open || "";
    const c = hoursObj?.[d]?.close || "";
    out[d] = !o || !c;
  }
  return out;
};

const Profile = () => {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useAuth();

  // Image upload state
  const fileRef = useRef(null);
  const [imgPreview, setImgPreview] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    const user = getAuthUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Normalize image field from backend variations
    const normalizedUser = {
      ...user,
      profileImage:
        user.profileImage ||
        user.profilePicture || // upload endpoint returns profilePicture
        user.imageUrl ||
        "",
    };

    setArtisan(normalizedUser);

    const normalizedSkills = normalizedUser.skills || normalizedUser.skillSet || [];
    const hours = normalizeHours(normalizedUser.businessHours);
    const closed = toClosedMap(hours);

    setFormData({
      fullName: normalizedUser.fullName || "",
      businessName: normalizedUser.businessName || "",
      location: normalizedUser.location || "",
      skillSet: normalizedSkills,
skillsText: (normalizedSkills || []).join(", "),
      businessHours: hours,
      closedDays: closed, // UI-only (we convert to open/close on save)
    });

    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setHoursField = (day, field, value) => {
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
  setFormData((prev) => {
    const nextIsClosed = !prev?.closedDays?.[day];
    const nextClosedDays = { ...(prev.closedDays || {}), [day]: nextIsClosed };

    const current = prev.businessHours?.[day] || {};
    const nextHoursForDay = nextIsClosed
      ? { open: "closed", close: "closed" }  // ✅
      : {
          open: isValidTime(current.open) ? current.open : defaultBusinessHours[day].open,
          close: isValidTime(current.close) ? current.close : defaultBusinessHours[day].close,
        };

    return {
      ...prev,
      closedDays: nextClosedDays,
      businessHours: {
        ...(prev.businessHours || {}),
        [day]: nextHoursForDay,
      },
    };
  });
};

  const copyMondayToAll = () => {
    setFormData((prev) => {
      const mon = prev.businessHours?.monday || defaultBusinessHours.monday;
      const monClosed = prev.closedDays?.monday ?? false;

      const bh = { ...(prev.businessHours || {}) };
      const cd = { ...(prev.closedDays || {}) };

      for (const d of DAYS) {
        bh[d] = monClosed ? { open: "", close: "" } : { open: mon.open, close: mon.close };
        cd[d] = monClosed;
      }

      return { ...prev, businessHours: bh, closedDays: cd };
    });
  };

  const copyMondayToWeekdays = () => {
    setFormData((prev) => {
      const mon = prev.businessHours?.monday || defaultBusinessHours.monday;
      const monClosed = prev.closedDays?.monday ?? false;

      const bh = { ...(prev.businessHours || {}) };
      const cd = { ...(prev.closedDays || {}) };

      const weekdays = ["monday","tuesday","wednesday","thursday","friday"];
      for (const d of weekdays) {
        bh[d] = monClosed ? { open: "", close: "" } : { open: mon.open, close: mon.close };
        cd[d] = monClosed;
      }

      return { ...prev, businessHours: bh, closedDays: cd };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const artisanId = artisan?.id || artisan?._id || artisan?.artisanId;
      if (!artisanId) throw new Error("Missing artisan id. Cannot update profile.");

      const cleanedSkills = String(formData.skillsText || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

      // Convert closedDays -> businessHours strictly for backend
      const strictHours = {};
for (const d of DAYS) {
  const isClosed = !!formData?.closedDays?.[d];

  if (isClosed) {
    // ✅ backend expects "closed", not empty strings
    strictHours[d] = { open: "closed", close: "closed" };
    continue;
  }

  const open = formData?.businessHours?.[d]?.open || defaultBusinessHours[d].open;
  const close = formData?.businessHours?.[d]?.close || defaultBusinessHours[d].close;

  // ✅ safety: if somehow user left one empty, force closed
  if (!isValidTime(open) || !isValidTime(close)) {
    strictHours[d] = { open: "closed", close: "closed" };
  } else {
    strictHours[d] = { open, close };
  }
}

      // ✅ STRICT payload = exactly backend spec
      const payload = {
        fullName: formData.fullName?.trim(),
        businessName: formData.businessName?.trim(),
        location: formData.location?.trim(),
        skillSet: cleanedSkills,
        businessHours: strictHours,
      };

      console.log("PATCH URL =>", `https://dev-user-api.fixserv.co/api/admin/${artisanId}`);
      console.log("PATCH PAYLOAD =>", payload);

      const res = await fetch(`https://dev-user-api.fixserv.co/api/admin/${artisanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        console.log("SERVER ERROR =>", data);
        throw new Error(data?.message || `Update failed (${res.status})`);
      }

      const updated = {
        ...data,
        // normalize skills for UI
        skills: data?.skills || data?.skillSet || cleanedSkills,
        businessHours: normalizeHours(data?.businessHours),
        profileImage:
          data?.profileImage ||
          data?.profilePicture ||
          artisan?.profileImage ||
          artisan?.profilePicture ||
          "",
      };

      setArtisan(updated);
setUser(updated); // ✅ this forces sidebar to update
localStorage.setItem("fixserv_user", JSON.stringify(updated));

      // Keep formData in sync
      const hours = normalizeHours(updated.businessHours);
      setFormData((prev) => ({
        ...prev,
        fullName: updated.fullName || "",
        businessName: updated.businessName || "",
        location: updated.location || "",
        skillSet: updated.skills || [],
        skillsText: (updated.skills || []).join(", "),
        businessHours: hours,
        closedDays: toClosedMap(hours),
      }));

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ====== Profile picture upload ======
  const onPickImage = () => fileRef.current?.click();

  const onFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple client-side checks
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
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const uploadProfilePicture = async () => {
    try {
      setUploadingImg(true);
      setError("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      const userId = artisan?.id || artisan?._id || artisan?.artisanId;
      if (!userId) throw new Error("Missing user id. Cannot upload image.");

      if (!imgFile) throw new Error("Please select an image first.");

      const fd = new FormData();
      fd.append("profilePicture", imgFile);

      const url = `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`;
      console.log("UPLOAD URL =>", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type manually for FormData
        },
        body: fd,
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        console.log("UPLOAD ERROR =>", data);
        throw new Error(data?.message || `Upload failed (${res.status})`);
      }

      // Response shape: { imageUrl, message, user: {... profilePicture } }
      const imageUrl = data?.imageUrl || data?.user?.profilePicture || data?.user?.profileImage;

      const updatedUser = data?.user
        ? {
            ...artisan,
            ...data.user,
            profileImage: imageUrl || data.user.profilePicture || artisan.profileImage,
          }
        : {
            ...artisan,
            profileImage: imageUrl || artisan.profileImage,
          };

      setArtisan(updatedUser);
setUser(updatedUser); // ✅ instant sidebar refresh
localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

      // reset picker
      setImgFile(null);
      setImgPreview("");
      if (fileRef.current) fileRef.current.value = "";

    } catch (err) {
      console.error("Upload profile picture failed", err);
      setError(err?.message || "Upload failed");
    } finally {
      setUploadingImg(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading profile...</p>;
  if (!artisan) return <p className="p-6 text-red-500">Failed to load profile</p>;

  const shownProfileImage = imgPreview || artisan.profileImage || artisan.profilePicture || profileImg;

  const headerProfileImage =
  artisan?.profileImage ||
  artisan?.profilePicture ||
  profileImg;

  return (
    <div className="w-full pr-4 transition-all duration-300">
      {/* Top Header */}
      <div className="flex justify-between p-4 items-center mb-4">
        <h1 className="text-2xl font-semibold text-black">Profile</h1>

        <div className="flex items-center gap-4">
          <img src={not} className="w-11 h-9 cursor-pointer" />
          <img
  src={headerProfileImage}
  className="w-9 h-9 rounded-full cursor-pointer" />
  {/* <img
  src={headerProfileImage}
  className="w-9 h-9 rounded-full object-cover cursor-pointer border border-gray-200"
/> */}
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="mx-6 mt-3 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      <div className="border-t border-blue-100">
        <div className="pl-6">
          <div className="flex gap-8 items-start mt-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center w-44">
  <div className="relative w-44 h-44 group">
    <img
      src={shownProfileImage}
      className="w-full h-full rounded-full object-cover 
                 border-4 border-white shadow-lg 
                 ring-4 ring-[#3E83C4]/30"
    />

    <div className="absolute -bottom-1 left-2">
      <img src={badge} className="w-12" />
    </div>

    {/* Hidden file input */}
    <input
      ref={fileRef}
      type="file"
      accept="image/*"
      onChange={onFileSelected}
      className="hidden"
    />

    {/* Hover overlay */}
    <button
      type="button"
      onClick={onPickImage}
      className="absolute inset-0 bg-black/40 opacity-0 
                 group-hover:opacity-100 transition 
                 flex items-center justify-center 
                 text-white text-sm font-medium 
                 rounded-full"
    >
      Change Photo
    </button>
  </div>

  {/* Save Photo Button */}
  {imgFile && (
    <button
      type="button"
      onClick={uploadProfilePicture}
      disabled={uploadingImg}
      className="mt-4 w-full bg-[#3E83C4] hover:bg-[#2f6fa8] 
           transition-all duration-300 
           text-white text-sm font-medium 
           py-2 rounded-lg shadow-sm 
           disabled:opacity-50"
    >
      {uploadingImg ? "Uploading..." : "Save Photo"}
    </button>
  )}
</div>

            {/* Name & Info */}
            <div className="flex flex-col justify-center gap-2">
              {/* fullName */}
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  className="w-80 px-4 py-2 rounded-lg border border-gray-300 
           focus:ring-2 focus:ring-[#3E83C4] 
           focus:border-[#3E83C4] outline-none transition"
                />
              ) : (
                <h2 className="text-2xl font-semibold">{artisan.fullName}</h2>
              )}

              {/* businessName */}
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Business:</span>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleChange}
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 
           focus:ring-2 focus:ring-[#3E83C4] 
           focus:border-[#3E83C4] outline-none transition"
                  />
                ) : (
                  <span>{artisan.businessName || "—"}</span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img src={star} className="w-4" />
                <span>
                  {artisan.rating} ({artisan.reviewsCount})
                </span>
              </div>

              {/* location */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img src={locationIcon} className="w-4" />
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 
           focus:ring-2 focus:ring-[#3E83C4] 
           focus:border-[#3E83C4] outline-none transition"
                  />
                ) : (
                  <span>{artisan.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className={`mt-6 ${isEditing ? "bg-blue-50 p-6 rounded-xl border border-blue-100" : ""}`}>
            <h3 className="font-semibold mb-1">Skills</h3>

            {isEditing ? (
  <input
    type="text"
    placeholder="Separate skills with commas (e.g. phone repair, laptop repair)"
    value={formData.skillsText || ""}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, skillsText: e.target.value }))
    }
    className="border px-2 py-2 rounded-md w-full"
  />
) : (
  <p className="text-sm text-gray-600">{(artisan.skills || []).join(", ")}</p>
)}
          </div>

          {/* Business Hours (Improved UX) */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold mb-2">Business hours</h3>

              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyMondayToWeekdays}
                    className="text-xs px-3 py-1 rounded-md border"
                  >
                    Copy Monday → Weekdays
                  </button>
                  <button
                    type="button"
                    onClick={copyMondayToAll}
                    className="text-xs px-3 py-1 rounded-md border"
                  >
                    Copy Monday → All
                  </button>
                </div>
              ) : null}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const isClosed = !!formData?.closedDays?.[day];
                  const rawOpen = formData?.businessHours?.[day]?.open || "";
const rawClose = formData?.businessHours?.[day]?.close || "";

const openVal = isValidTime(rawOpen) ? rawOpen : "";
const closeVal = isValidTime(rawClose) ? rawClose : "";

                  return (
                    <div key={day} className="flex items-center gap-4 text-sm 
           bg-white p-3 rounded-lg border border-gray-200">
                      <div className="w-24 capitalize text-gray-700 font-medium">{day}</div>

                      <label className="flex items-center gap-2 mr-2">
                        <input
                          type="checkbox"
                          checked={isClosed}
                          onChange={() => toggleClosed(day)}
                        />
                        <span className="text-gray-600">Closed</span>
                      </label>

                      <input
                        type="time"
                        value={openVal}
                        disabled={isClosed}
                        onChange={(e) => setHoursField(day, "open", e.target.value)}
                        className={`border px-2 py-1 rounded-md ${isClosed ? "opacity-50" : ""}`}
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={closeVal}
                        disabled={isClosed}
                        onChange={(e) => setHoursField(day, "close", e.target.value)}
                        className={`border px-2 py-1 rounded-md ${isClosed ? "opacity-50" : ""}`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-1">
                {DAYS.map((day) => {
                  const o = artisan.businessHours?.[day]?.open || "";
                  const c = artisan.businessHours?.[day]?.close || "";
                  const closed = !o || !c;
                  return (
                    <div key={day} className="flex gap-2">
                      <span className="w-24 capitalize">{day}:</span>
                      <span>{closed ? "Closed" : `${o} - ${c}`}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Contact info (Display only) */}
          <div className="mt-10 space-y-5">
            <h3 className="text-lg font-semibold">Contact info</h3>

            <div className="space-y-4 text-sm text-gray-500">
              <p>
                <span className="font-medium text-gray-700">Phone :</span>{" "}
                {artisan.phone || artisan.phoneNumber || "—"}
              </p>

              <p>
                <span className="font-medium text-gray-700">Email :</span>{" "}
                {artisan.email || "—"}
              </p>

              <p>
                <span className="font-medium text-gray-700">Address :</span>{" "}
                {artisan.address || "—"}
              </p>

              <p>
                <span className="font-medium text-gray-700">Available Work Locations :</span>{" "}
                {artisan.workLocations || "—"}
              </p>

              {isEditing ? (
                <button
  onClick={handleSave}
  disabled={saving}
  className="mt-6 bg-green-600 hover:bg-green-700 
             transition text-white px-8 py-2.5 
             rounded-lg font-medium shadow-sm 
             disabled:opacity-50"
>
  {saving ? "Saving..." : "Save Changes"}
</button>
              ) : (
                <button
  onClick={() => setIsEditing(true)}
  className="mt-6 bg-[#3E83C4] hover:bg-[#2f6fa8] 
             transition text-white px-8 py-2.5 
             rounded-lg font-medium shadow-sm"
>
  Edit Profile
</button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;