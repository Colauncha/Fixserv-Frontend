// import { useEffect, useRef, useState } from "react";
// import { getAuthUser, getAuthToken } from "../../utils/auth";
// import star from "../../assets/Artisan Images/star.png";
// import locationIcon from "../../assets/Artisan Images/location.png";
// import badge from "../../assets/Artisan Images/badge.png";
// import profileImg from "../../assets/Artisan Images/adebayo.png";
// import { useAuth } from "../../context/AuthContext";
// import ArtisanHeader from "./ArtisanHeader";

// const DAYS = [
//   "monday",
//   "tuesday",
//   "wednesday",
//   "thursday",
//   "friday",
//   "saturday",
//   "sunday",
// ];

// const defaultBusinessHours = {
//   monday: { open: "09:00", close: "18:00" },
//   tuesday: { open: "09:00", close: "18:00" },
//   wednesday: { open: "09:00", close: "18:00" },
//   thursday: { open: "09:00", close: "18:00" },
//   friday: { open: "09:00", close: "18:00" },
//   saturday: { open: "09:00", close: "18:00" },
//   sunday: { open: "09:00", close: "18:00" },
// };

// const isValidTime = (value) => {
//   if (typeof value !== "string") return false;
//   return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
// };

// const normalizeHours = (hours) => {
//   const src = hours && typeof hours === "object" ? hours : {};
//   const out = {};

//   for (const day of DAYS) {
//     const rawOpen = src?.[day]?.open;
//     const rawClose = src?.[day]?.close;

//     const isClosed =
//       rawOpen === "closed" ||
//       rawClose === "closed" ||
//       !isValidTime(rawOpen) ||
//       !isValidTime(rawClose);

//     out[day] = isClosed
//       ? { open: "", close: "" }
//       : { open: rawOpen, close: rawClose };
//   }

//   return out;
// };

// const toClosedMap = (hoursObj) => {
//   const out = {};
//   for (const day of DAYS) {
//     const open = hoursObj?.[day]?.open || "";
//     const close = hoursObj?.[day]?.close || "";
//     out[day] = !open || !close;
//   }
//   return out;
// };

// const normalizeSkills = (user) => {
//   if (Array.isArray(user?.skillSet)) return user.skillSet;
//   if (Array.isArray(user?.skills)) return user.skills;
//   return [];
// };

// const normalizeProfileImage = (user) => {
//   return user?.profileImage || user?.profilePicture || user?.imageUrl || "";
// };

// const Profile = () => {
//   const { setUser } = useAuth();

//   const [artisan, setArtisan] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [isEditing, setIsEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: "",
//     businessName: "",
//     location: "",
//     skillsText: "",
//     businessHours: normalizeHours(defaultBusinessHours),
//     closedDays: toClosedMap(normalizeHours(defaultBusinessHours)),
//   });

//   const fileRef = useRef(null);
//   const [imgPreview, setImgPreview] = useState("");
//   const [imgFile, setImgFile] = useState(null);
//   const [uploadingImg, setUploadingImg] = useState(false);

//   useEffect(() => {
//     const user = getAuthUser();

//     if (!user) {
//       setLoading(false);
//       return;
//     }

//     const normalizedUser = {
//       ...user,
//       profileImage: normalizeProfileImage(user),
//       skills: normalizeSkills(user),
//       businessHours: normalizeHours(user?.businessHours),
//     };

//     setArtisan(normalizedUser);

//     const hours = normalizeHours(normalizedUser.businessHours);
//     const closed = toClosedMap(hours);

//     setFormData({
//       fullName: normalizedUser.fullName || "",
//       businessName: normalizedUser.businessName || "",
//       location: normalizedUser.location || "",
//       skillsText: (normalizedUser.skills || []).join(", "),
//       businessHours: hours,
//       closedDays: closed,
//     });

//     setLoading(false);
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setError("");
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const setHoursField = (day, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       businessHours: {
//         ...prev.businessHours,
//         [day]: {
//           ...(prev.businessHours?.[day] || {}),
//           [field]: value,
//         },
//       },
//     }));
//   };

//   const toggleClosed = (day) => {
//     setFormData((prev) => {
//       const nextClosed = !prev.closedDays?.[day];

//       return {
//         ...prev,
//         closedDays: {
//           ...prev.closedDays,
//           [day]: nextClosed,
//         },
//         businessHours: {
//           ...prev.businessHours,
//           [day]: nextClosed
//             ? { open: "", close: "" }
//             : {
//                 open: defaultBusinessHours[day].open,
//                 close: defaultBusinessHours[day].close,
//               },
//         },
//       };
//     });
//   };

//   const copyMondayToAll = () => {
//     setFormData((prev) => {
//       const mondayClosed = !!prev.closedDays?.monday;
//       const mondayHours =
//         prev.businessHours?.monday || defaultBusinessHours.monday;

//       const nextBusinessHours = {};
//       const nextClosedDays = {};

//       for (const day of DAYS) {
//         nextClosedDays[day] = mondayClosed;
//         nextBusinessHours[day] = mondayClosed
//           ? { open: "", close: "" }
//           : { open: mondayHours.open, close: mondayHours.close };
//       }

//       return {
//         ...prev,
//         businessHours: nextBusinessHours,
//         closedDays: nextClosedDays,
//       };
//     });
//   };

//   const copyMondayToWeekdays = () => {
//     setFormData((prev) => {
//       const mondayClosed = !!prev.closedDays?.monday;
//       const mondayHours =
//         prev.businessHours?.monday || defaultBusinessHours.monday;

//       const nextBusinessHours = { ...prev.businessHours };
//       const nextClosedDays = { ...prev.closedDays };

//       const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//       for (const day of weekdays) {
//         nextClosedDays[day] = mondayClosed;
//         nextBusinessHours[day] = mondayClosed
//           ? { open: "", close: "" }
//           : { open: mondayHours.open, close: mondayHours.close };
//       }

//       return {
//         ...prev,
//         businessHours: nextBusinessHours,
//         closedDays: nextClosedDays,
//       };
//     });
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       setError("");

//       const token = getAuthToken();
//       if (!token) throw new Error("Missing auth token. Please login again.");

//       const artisanId = artisan?.id || artisan?._id || artisan?.artisanId;
//       if (!artisanId) throw new Error("Missing artisan id. Cannot update profile.");

//       const cleanedSkills = String(formData.skillsText || "")
//         .split(",")
//         .map((skill) => skill.trim())
//         .filter(Boolean);

//       const strictHours = {};

//       for (const day of DAYS) {
//         const isClosed = !!formData.closedDays?.[day];

//         if (isClosed) {
//           strictHours[day] = { open: "closed", close: "closed" };
//           continue;
//         }

//         const open = formData.businessHours?.[day]?.open || "";
//         const close = formData.businessHours?.[day]?.close || "";

//         if (!isValidTime(open) || !isValidTime(close)) {
//           strictHours[day] = {
//             open: defaultBusinessHours[day].open,
//             close: defaultBusinessHours[day].close,
//           };
//         } else {
//           strictHours[day] = { open, close };
//         }
//       }

//       const payload = {
//         fullName: formData.fullName.trim(),
//         businessName: formData.businessName.trim(),
//         location: formData.location.trim(),
//         skillSet: cleanedSkills,
//         businessHours: strictHours,
//       };

//       const res = await fetch(
//         `https://dev-user-api.fixserv.co/api/admin/${artisanId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       let data = null;
//       try {
//         data = await res.json();
//       } catch {
//         data = null;
//       }

//       if (!res.ok) {
//         throw new Error(data?.message || `Update failed (${res.status})`);
//       }

//       const updatedUser = {
//         ...artisan,
//         ...data,
//         profileImage:
//           normalizeProfileImage(data) || normalizeProfileImage(artisan),
//         skills: Array.isArray(data?.skills)
//           ? data.skills
//           : Array.isArray(data?.skillSet)
//           ? data.skillSet
//           : cleanedSkills,
//         skillSet: Array.isArray(data?.skillSet)
//           ? data.skillSet
//           : Array.isArray(data?.skills)
//           ? data.skills
//           : cleanedSkills,
//         businessHours: normalizeHours(data?.businessHours || strictHours),
//       };

//       setArtisan(updatedUser);
//       setUser(updatedUser);
//       localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

//       const hours = normalizeHours(updatedUser.businessHours);

//       setFormData({
//         fullName: updatedUser.fullName || "",
//         businessName: updatedUser.businessName || "",
//         location: updatedUser.location || "",
//         skillsText: (updatedUser.skillSet || updatedUser.skills || []).join(", "),
//         businessHours: hours,
//         closedDays: toClosedMap(hours),
//       });

//       setIsEditing(false);
//     } catch (err) {
//       console.error("Failed to update profile", err);
//       setError(err?.message || "Failed to update profile");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const onPickImage = () => fileRef.current?.click();

//   const onFileSelected = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const isImage = file.type.startsWith("image/");
//     if (!isImage) {
//       setError("Please select an image file.");
//       return;
//     }

//     const maxMB = 5;
//     if (file.size > maxMB * 1024 * 1024) {
//       setError(`Image must be less than ${maxMB}MB.`);
//       return;
//     }

//     setError("");
//     setImgFile(file);
//     setImgPreview(URL.createObjectURL(file));
//   };

//   const uploadProfilePicture = async () => {
//     try {
//       setUploadingImg(true);
//       setError("");

//       const token = getAuthToken();
//       if (!token) throw new Error("Missing auth token. Please login again.");

//       const userId = artisan?.id || artisan?._id || artisan?.artisanId;
//       if (!userId) throw new Error("Missing user id. Cannot upload image.");

//       if (!imgFile) throw new Error("Please select an image first.");

//       const fd = new FormData();
//       fd.append("profilePicture", imgFile);

//       const url = `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`;

//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: fd,
//       });

//       let data = null;
//       try {
//         data = await res.json();
//       } catch {
//         data = null;
//       }

//       if (!res.ok) {
//         throw new Error(data?.message || `Upload failed (${res.status})`);
//       }

//       const imageUrl =
//         data?.imageUrl ||
//         data?.user?.profilePicture ||
//         data?.user?.profileImage ||
//         "";

//       const updatedUser = {
//         ...artisan,
//         ...(data?.user || {}),
//         profileImage: imageUrl || artisan?.profileImage || "",
//       };

//       setArtisan(updatedUser);
//       setUser(updatedUser);
//       localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

//       setImgFile(null);
//       setImgPreview("");
//       if (fileRef.current) fileRef.current.value = "";
//     } catch (err) {
//       console.error("Upload profile picture failed", err);
//       setError(err?.message || "Upload failed");
//     } finally {
//       setUploadingImg(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         <p className="text-gray-500">Loading profile...</p>
//       </div>
//     );
//   }

//   if (!artisan) {
//     return (
//       <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         <p className="text-red-500">Failed to load profile</p>
//       </div>
//     );
//   }

//   const shownProfileImage =
//     imgPreview || artisan?.profileImage || artisan?.profilePicture || profileImg;

//   const headerProfileImage =
//     artisan?.profileImage || artisan?.profilePicture || profileImg;

//   return (
//     <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300">
//       <ArtisanHeader title="Profile" profileImage={headerProfileImage} />

//       {error ? (
//         <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
//           {error}
//         </div>
//       ) : null}

//       <div className="mt-6">
//         <div className="flex flex-col xl:flex-row gap-8 items-start">
//           <div className="flex flex-col items-center w-full xl:w-auto">
//             <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 group">
//               <img
//                 src={shownProfileImage}
//                 alt="artisan"
//                 className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-[#3E83C4]/30"
//               />

//               <div className="absolute -bottom-1 left-2">
//                 <img src={badge} alt="badge" className="w-10 sm:w-12" />
//               </div>

//               <input
//                 ref={fileRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={onFileSelected}
//                 className="hidden"
//               />

//               <button
//                 type="button"
//                 onClick={onPickImage}
//                 className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs sm:text-sm font-medium rounded-full"
//               >
//                 Change Photo
//               </button>
//             </div>

//             {imgFile && (
//               <button
//                 type="button"
//                 onClick={uploadProfilePicture}
//                 disabled={uploadingImg}
//                 className="mt-4 w-full sm:w-48 bg-[#3E83C4] hover:bg-[#2f6fa8] transition-all duration-300 text-white text-sm font-medium py-2 rounded-lg shadow-sm disabled:opacity-50"
//               >
//                 {uploadingImg ? "Uploading..." : "Save Photo"}
//               </button>
//             )}
//           </div>

//           <div className="flex-1 w-full flex flex-col justify-center gap-3">
//             {isEditing ? (
//               <input
//                 type="text"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
//               />
//             ) : (
//               <h2 className="text-2xl sm:text-3xl font-semibold break-words">
//                 {artisan.fullName}
//               </h2>
//             )}

//             <div className="text-sm text-gray-600">
//               <span className="font-medium text-gray-700">Business:</span>{" "}
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="businessName"
//                   value={formData.businessName}
//                   onChange={handleChange}
//                   className="mt-2 w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
//                 />
//               ) : (
//                 <span className="break-words">{artisan.businessName || "—"}</span>
//               )}
//             </div>

//             <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
//               <img src={star} alt="rating" className="w-4" />
//               <span>
//                 {artisan.rating || 0} ({artisan.reviewsCount || 0})
//               </span>
//             </div>

//             <div className="flex items-start sm:items-center gap-2 text-sm text-gray-600">
//               <img src={locationIcon} alt="location" className="w-4 mt-1 sm:mt-0" />
//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleChange}
//                   className="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3E83C4] focus:border-[#3E83C4] outline-none transition"
//                 />
//               ) : (
//                 <span className="break-words">{artisan.location || "—"}</span>
//               )}
//             </div>
//           </div>
//         </div>

//         <div
//           className={`mt-8 ${
//             isEditing ? "bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100" : ""
//           }`}
//         >
//           <h3 className="font-semibold mb-2">Skills</h3>

//           {isEditing ? (
//             <input
//               type="text"
//               placeholder="Separate skills with commas (e.g. phone repair, laptop repair)"
//               value={formData.skillsText}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, skillsText: e.target.value }))
//               }
//               className="border px-3 py-2 rounded-md w-full"
//             />
//           ) : (
//             <p className="text-sm text-gray-600 break-words">
//               {(artisan.skillSet || artisan.skills || []).length > 0
//                 ? (artisan.skillSet || artisan.skills).join(", ")
//                 : "—"}
//             </p>
//           )}
//         </div>

//         <div className="mt-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
//             <h3 className="font-semibold">Business hours</h3>

//             {isEditing ? (
//               <div className="flex flex-col sm:flex-row gap-2">
//                 <button
//                   type="button"
//                   onClick={copyMondayToWeekdays}
//                   className="text-xs px-3 py-2 rounded-md border"
//                 >
//                   Copy Monday → Weekdays
//                 </button>
//                 <button
//                   type="button"
//                   onClick={copyMondayToAll}
//                   className="text-xs px-3 py-2 rounded-md border"
//                 >
//                   Copy Monday → All
//                 </button>
//               </div>
//             ) : null}
//           </div>

//           {isEditing ? (
//             <div className="space-y-3">
//               {DAYS.map((day) => {
//                 const isClosed = !!formData.closedDays?.[day];
//                 const rawOpen = formData.businessHours?.[day]?.open || "";
//                 const rawClose = formData.businessHours?.[day]?.close || "";

//                 return (
//                   <div
//                     key={day}
//                     className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 text-sm bg-white p-3 rounded-lg border border-gray-200"
//                   >
//                     <div className="w-full lg:w-24 capitalize text-gray-700 font-medium">
//                       {day}
//                     </div>

//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={isClosed}
//                         onChange={() => toggleClosed(day)}
//                       />
//                       <span className="text-gray-600">Closed</span>
//                     </label>

//                     <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//                       <input
//                         type="time"
//                         value={rawOpen}
//                         disabled={isClosed}
//                         onChange={(e) => setHoursField(day, "open", e.target.value)}
//                         className={`border px-2 py-1 rounded-md ${
//                           isClosed ? "opacity-50" : ""
//                         }`}
//                       />

//                       <span className="text-gray-500 hidden sm:inline">to</span>

//                       <input
//                         type="time"
//                         value={rawClose}
//                         disabled={isClosed}
//                         onChange={(e) => setHoursField(day, "close", e.target.value)}
//                         className={`border px-2 py-1 rounded-md ${
//                           isClosed ? "opacity-50" : ""
//                         }`}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-sm text-gray-600 space-y-2">
//               {DAYS.map((day) => {
//                 const open = artisan.businessHours?.[day]?.open || "";
//                 const close = artisan.businessHours?.[day]?.close || "";
//                 const closed = !open || !close;

//                 return (
//                   <div
//                     key={day}
//                     className="flex flex-col sm:flex-row sm:gap-2"
//                   >
//                     <span className="w-full sm:w-24 capitalize font-medium text-gray-700">
//                       {day}:
//                     </span>
//                     <span>{closed ? "Closed" : `${open} - ${close}`}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <div className="mt-10 space-y-5">
//           <h3 className="text-lg font-semibold">Contact info</h3>

//           <div className="space-y-4 text-sm text-gray-500">
//             <p className="break-words">
//               <span className="font-medium text-gray-700">Phone :</span>{" "}
//               {artisan.phone || artisan.phoneNumber || "—"}
//             </p>

//             <p className="break-words">
//               <span className="font-medium text-gray-700">Email :</span>{" "}
//               {artisan.email || "—"}
//             </p>

//             {isEditing ? (
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="mt-6 mb-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 transition text-white px-8 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50 cursor-pointer"
//               >
//                 {saving ? "Saving..." : "Save Changes"}
//               </button>
//             ) : (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="mt-6 mb-10 w-full sm:w-auto bg-[#3E83C4] hover:bg-[#2f6fa8] transition text-white px-8 py-2.5 rounded-lg font-medium shadow-sm cursor-pointer"
//               >
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



import { useEffect, useRef, useState } from "react";
import { getAuthUser, getAuthToken } from "../../utils/auth";
import star from "../../assets/Artisan Images/star.png";
import locationIcon from "../../assets/Artisan Images/location.png";
import badge from "../../assets/Artisan Images/badge.png";
import profileImg from "../../assets/Artisan Images/adebayo.png";
import { useAuth } from "../../context/AuthContext";
import ArtisanHeader from "./ArtisanHeader";

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
  saturday: { open: "09:00", close: "18:00" },
  sunday: { open: "09:00", close: "18:00" },
};

const isValidTime = (value) => {
  if (typeof value !== "string") return false;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
};

const normalizeHours = (hours) => {
  const src = hours && typeof hours === "object" ? hours : {};
  const out = {};

  for (const day of DAYS) {
    const rawOpen = src?.[day]?.open;
    const rawClose = src?.[day]?.close;

    const isClosed =
      rawOpen === "closed" ||
      rawClose === "closed" ||
      rawOpen === "Closed" ||
      rawClose === "Closed" ||
      (!rawOpen && !rawClose);

    out[day] = isClosed
      ? { open: "", close: "" }
      : {
          open: isValidTime(rawOpen) ? rawOpen : defaultBusinessHours[day].open,
          close: isValidTime(rawClose) ? rawClose : defaultBusinessHours[day].close,
        };
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

const extractArtisanPayload = (data) => {
  if (!data || typeof data !== "object") return {};
  return data?.data || data?.artisan || data?.user || data?.updatedArtisan || data;
};

const normalizeServices = (source) => {
  const possible =
    source?.services ||
    source?.artisanServices ||
    source?.serviceManagement ||
    source?.data?.services ||
    [];

  if (!Array.isArray(possible)) return [];

  return possible.map((service, index) => ({
    localKey: service?.id || service?._id || service?.serviceId || `service-${index}`,
    id: service?.id || service?._id || service?.serviceId || "",
    title: service?.title || "",
    price:
      service?.price === 0 || service?.price
        ? String(service.price)
        : "",
    description: service?.description || "",
    estimatedDuration: service?.estimatedDuration || "",
    isActive:
      typeof service?.isActive === "boolean" ? service.isActive : true,
  }));
};

const Profile = () => {
  const { setUser } = useAuth();

  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingServices, setSavingServices] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    location: "",
    bio: "",
    skillsText: "",
    businessHours: normalizeHours(defaultBusinessHours),
    closedDays: toClosedMap(normalizeHours(defaultBusinessHours)),
  });

  const [services, setServices] = useState([]);

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

    const normalizedUser = {
      ...user,
      profileImage: normalizeProfileImage(user),
      skills: normalizeSkills(user),
      businessHours: normalizeHours(user?.businessHours),
    };

    setArtisan(normalizedUser);

    const hours = normalizeHours(normalizedUser.businessHours);
    const closed = toClosedMap(hours);

    setFormData({
      fullName: normalizedUser.fullName || "",
      businessName: normalizedUser.businessName || "",
      location: normalizedUser.location || "",
      bio: normalizedUser.bio || normalizedUser.description || "",
      skillsText: (normalizedUser.skills || []).join(", "),
      businessHours: hours,
      closedDays: closed,
    });

    setServices(normalizeServices(normalizedUser));
    setLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccessMessage("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setHoursField = (day, field, value) => {
    setError("");
    setSuccessMessage("");
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
    setSuccessMessage("");

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
                open:
                  prev.businessHours?.[day]?.open || defaultBusinessHours[day].open,
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
      const mondayHours =
        prev.businessHours?.monday || defaultBusinessHours.monday;

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
      const mondayHours =
        prev.businessHours?.monday || defaultBusinessHours.monday;

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

  const handleServiceFieldChange = (index, field, value) => {
    setError("");
    setSuccessMessage("");

    setServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

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
          strictHours[day] = { open: "closed", close: "closed" };
          continue;
        }

        const open = formData.businessHours?.[day]?.open || "";
        const close = formData.businessHours?.[day]?.close || "";

        if (!isValidTime(open) || !isValidTime(close)) {
          throw new Error(`Please enter valid opening and closing time for ${day}.`);
        }

        strictHours[day] = { open, close };
      }

const payload = {
  fullName: formData.fullName.trim(),
  businessName: formData.businessName.trim(),
  location: formData.location.trim(),
  description: formData.bio.trim(),
  skillSet: cleanedSkills,
  businessHours: strictHours,
};

      const res = await fetch(
        `https://dev-user-api.fixserv.co/api/admin/${artisanId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.message || `Update failed (${res.status})`);
      }

      const updatedPayload = extractArtisanPayload(data);

const updatedUser = {
  ...artisan,
  ...updatedPayload,
  fullName: updatedPayload?.fullName ?? payload.fullName,
  businessName: updatedPayload?.businessName ?? payload.businessName,
  location: updatedPayload?.location ?? payload.location,
  description: updatedPayload?.description ?? payload.description,
  bio: updatedPayload?.description ?? payload.description,
  profileImage:
    normalizeProfileImage(updatedPayload) || normalizeProfileImage(artisan),
        skills: Array.isArray(updatedPayload?.skills)
          ? updatedPayload.skills
          : Array.isArray(updatedPayload?.skillSet)
          ? updatedPayload.skillSet
          : cleanedSkills,
        skillSet: Array.isArray(updatedPayload?.skillSet)
          ? updatedPayload.skillSet
          : Array.isArray(updatedPayload?.skills)
          ? updatedPayload.skills
          : cleanedSkills,
        businessHours: normalizeHours(updatedPayload?.businessHours || strictHours),
        services:
          updatedPayload?.services ||
          updatedPayload?.artisanServices ||
          artisan?.services ||
          artisan?.artisanServices ||
          [],
      };

      setArtisan(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));

      const hours = normalizeHours(updatedUser.businessHours);

setFormData({
  fullName: updatedUser.fullName || "",
  businessName: updatedUser.businessName || "",
  location: updatedUser.location || "",
  bio: updatedUser.description || updatedUser.bio || "",
  skillsText: (updatedUser.skillSet || updatedUser.skills || []).join(", "),
  businessHours: hours,
  closedDays: toClosedMap(hours),
});

      setServices((prev) =>
        prev.length > 0 ? prev : normalizeServices(updatedUser)
      );

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    try {
      setSavingServices(true);
      setError("");
      setSuccessMessage("");

      const token = getAuthToken();
      if (!token) throw new Error("Missing auth token. Please login again.");

      if (!services.length) {
        throw new Error("No services found to update.");
      }

      for (const service of services) {
        const serviceId = service?.id;
        if (!serviceId) continue;

        const payload = {
          title: service.title.trim(),
          price: Number(service.price || 0),
          description: service.description.trim(),
          isActive: !!service.isActive,
          estimatedDuration: service.estimatedDuration.trim(),
        };

        if (!payload.title) {
          throw new Error("Each service must have a title.");
        }

        if (Number.isNaN(payload.price)) {
          throw new Error(`Invalid price for service "${payload.title}".`);
        }

        await fetch(`https://dev-service-api.fixserv.co/api/service/${serviceId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }).then(async (res) => {
          let data = null;
          try {
            data = await res.json();
          } catch {
            data = null;
          }

          if (!res.ok) {
            throw new Error(
              data?.message ||
                `Failed to update service "${payload.title}" (${res.status})`
            );
          }
        });
      }

      const updatedUser = {
        ...artisan,
        services: services.map((service) => ({
          ...service,
          price: Number(service.price || 0),
        })),
      };

      setArtisan(updatedUser);
      setUser(updatedUser);
      localStorage.setItem("fixserv_user", JSON.stringify(updatedUser));
      setSuccessMessage("Services updated successfully.");
    } catch (err) {
      console.error("Failed to update services", err);
      setError(err?.message || "Failed to update services");
    } finally {
      setSavingServices(false);
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
    setSuccessMessage("");
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const uploadProfilePicture = async () => {
    try {
      setUploadingImg(true);
      setError("");
      setSuccessMessage("");

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
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.message || `Upload failed (${res.status})`);
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
      if (fileRef.current) fileRef.current.value = "";
      setSuccessMessage("Profile picture updated successfully.");
    } catch (err) {
      console.error("Upload profile picture failed", err);
      setError(err?.message || "Upload failed");
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

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300">
      <ArtisanHeader title="Profile" profileImage={headerProfileImage} />

      {error ? (
        <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 text-sm">
          {successMessage}
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
              rows={5}
              placeholder="Tell clients about your business, experience and what you do."
              className="border px-3 py-2 rounded-md w-full resize-none"
            />
          ) : (
<p className="text-sm text-gray-600 break-words whitespace-pre-wrap">
  {artisan.description || artisan.bio || "—"}
</p>
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

        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold">Services</h3>

            {services.length > 0 ? (
              <button
                type="button"
                onClick={handleSaveServices}
                disabled={savingServices}
                className="w-full sm:w-auto bg-[#3E83C4] hover:bg-[#2f6fa8] transition text-white px-6 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50"
              >
                {savingServices ? "Saving Services..." : "Save Services"}
              </button>
            ) : null}
          </div>

          {services.length > 0 ? (
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={service.localKey}
                  className="border rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) =>
                          handleServiceFieldChange(index, "title", e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded-md"
                        placeholder="Service title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={service.price}
                        onChange={(e) =>
                          handleServiceFieldChange(index, "price", e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded-md"
                        placeholder="Enter service price"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration
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
                        className="w-full border px-3 py-2 rounded-md"
                        placeholder="e.g. 2 days"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                      <input
                        id={`service-active-${service.localKey}`}
                        type="checkbox"
                        checked={!!service.isActive}
                        onChange={(e) =>
                          handleServiceFieldChange(
                            index,
                            "isActive",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`service-active-${service.localKey}`}
                        className="text-sm text-gray-700"
                      >
                        Active Service
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={service.description}
                        onChange={(e) =>
                          handleServiceFieldChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full border px-3 py-2 rounded-md resize-none"
                        placeholder="Service description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border p-4 text-sm text-gray-500 bg-gray-50">
              No services found for this artisan yet.
            </div>
          )}
        </div>

        <div className="mt-10 space-y-5">
          <h3 className="text-lg font-semibold">Contact info</h3>

          <div className="space-y-4 text-sm text-gray-500">
            <p className="break-words">
              <span className="font-medium text-gray-700">Phone :</span>{" "}
              {artisan.phone || artisan.phoneNumber || "—"}
            </p>

            <p className="break-words">
              <span className="font-medium text-gray-700">Email :</span>{" "}
              {artisan.email || "—"}
            </p>

            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-6 mb-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 transition text-white px-8 py-2.5 rounded-lg font-medium shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={() => {
                    const hours = normalizeHours(artisan.businessHours);
setFormData({
  fullName: artisan.fullName || "",
  businessName: artisan.businessName || "",
  location: artisan.location || "",
  bio: artisan.description || artisan.bio || "",
  skillsText: (artisan.skillSet || artisan.skills || []).join(", "),
  businessHours: hours,
  closedDays: toClosedMap(hours),
});
                    setIsEditing(false);
                    setError("");
                    setSuccessMessage("");
                  }}
                  type="button"
                  className="mt-6 mb-10 w-full sm:w-auto bg-gray-200 hover:bg-gray-300 transition text-gray-800 px-8 py-2.5 rounded-lg font-medium shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
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