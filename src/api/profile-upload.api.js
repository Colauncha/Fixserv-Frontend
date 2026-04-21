// import { getAuthToken, getAuthUser } from "../utils/auth";

// const PROFILE_UPLOAD_API_BASE = import.meta.env.DEV
//   ? "/api/upload"
//   : `${import.meta.env.VITE_USER_API_BASE_URL.replace(/\/$/, "")}/upload`;

// const ACCEPTED_PROFILE_MIME_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// const ACCEPTED_PROFILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
// const MAX_PROFILE_MB = 5;

// const getExtension = (filename = "") => {
//   const dot = filename.lastIndexOf(".");
//   return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
// };

// const resolveUserId = (fallbackUserId = "") => {
//   if (fallbackUserId) return fallbackUserId;

//   const user = getAuthUser();
//   return user?.id || user?._id || user?.artisanId || "";
// };

// export const validateProfileImageFile = (file) => {
//   if (!file) {
//     return { valid: false, message: "Please select an image first." };
//   }

//   const mime = String(file.type || "").toLowerCase();
//   const ext = getExtension(file.name || "");

//   const isAccepted =
//     ACCEPTED_PROFILE_MIME_TYPES.includes(mime) ||
//     ACCEPTED_PROFILE_EXTENSIONS.includes(ext);

//   if (!isAccepted) {
//     return {
//       valid: false,
//       message: "Only JPG, JPEG, PNG, and WEBP images are allowed.",
//     };
//   }

//   if (file.size > MAX_PROFILE_MB * 1024 * 1024) {
//     return {
//       valid: false,
//       message: `Image must be less than ${MAX_PROFILE_MB}MB.`,
//     };
//   }

//   return { valid: true, message: "" };
// };

// const readFileAsDataURL = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(file);
//   });

// const loadImage = (src) =>
//   new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });

// const canvasToBlob = (canvas, type, quality) =>
//   new Promise((resolve) => {
//     canvas.toBlob((blob) => resolve(blob), type, quality);
//   });

// export const compressProfileImage = async (file) => {
//   if (!file?.type?.startsWith("image/")) return file;

//   const targetMaxBytes = 2 * 1024 * 1024;

//   if (file.size <= targetMaxBytes) {
//     return file;
//   }

//   const dataUrl = await readFileAsDataURL(file);
//   const image = await loadImage(dataUrl);

//   let width = image.width;
//   let height = image.height;

//   const maxWidth = 1400;
//   const maxHeight = 1400;

//   if (width > maxWidth || height > maxHeight) {
//     const ratio = Math.min(maxWidth / width, maxHeight / height);
//     width = Math.round(width * ratio);
//     height = Math.round(height * ratio);
//   }

//   const canvas = document.createElement("canvas");
//   canvas.width = width;
//   canvas.height = height;

//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(image, 0, 0, width, height);

//   let quality = 0.85;
//   let blob = await canvasToBlob(canvas, "image/jpeg", quality);

//   while (blob && blob.size > targetMaxBytes && quality > 0.45) {
//     quality -= 0.08;
//     blob = await canvasToBlob(canvas, "image/jpeg", quality);
//   }

//   if (!blob) return file;

//   const compressedName =
//     file.name.replace(/\.[^.]+$/, "") + ".jpg";

//   return new File([blob], compressedName, {
//     type: "image/jpeg",
//     lastModified: Date.now(),
//   });
// };

// const getProfileUploadFriendlyError = (err, fallback = "Image upload failed. Please try again.") => {
//   if (!err) return fallback;

//   // ✅ Handle structured error (your new throw)
//   if (err?.status) {
//     if (err.status >= 500) {
//       return "Server error while uploading image. Please try again later.";
//     }
//     if (err.status === 413) {
//       return "Image too large. Please choose a smaller image.";
//     }
//     if (err.status === 401) {
//       return "Session expired. Please login again.";
//     }
//     if (err.status === 403) {
//       return "You don’t have permission to perform this action.";
//     }
//   }

//   const raw =
//     err?.data?.message ||
//     err?.data?.error ||
//     err?.message ||
//     "";

//   const msg = String(raw).toLowerCase();

//   if (msg.includes("network") || msg.includes("failed to fetch")) {
//     return "Network error. Please check your internet connection.";
//   }

//   return raw || fallback;
// };

// // const getProfileUploadFriendlyError = (err, fallback = "Image upload failed. Please try again.") => {
// //   const raw =
// //     err?.data?.message ||
// //     err?.data?.error ||
// //     err?.message ||
// //     "";
// //   const msg = String(raw).toLowerCase();

// //   if (msg.includes("failed to fetch") || msg.includes("network")) {
// //     return "Network error. Please check your internet connection.";
// //   }

// //   if (msg.includes("401") || msg.includes("unauthorized")) {
// //     return "Session expired. Please login again.";
// //   }

// //   if (msg.includes("403")) {
// //     return "You don’t have permission to perform this action.";
// //   }

// //   if (msg.includes("404")) {
// //     return "Upload endpoint not found.";
// //   }

// //   if (msg.includes("413") || msg.includes("too large")) {
// //     return "This image is too large. Please choose a smaller image.";
// //   }

// //   if (msg.includes("timeout")) {
// //     return "The request took too long. Please try again.";
// //   }

// //   if (msg.includes("500") || msg.includes("server")) {
// //     return "Server error. Please try again later.";
// //   }

// //   if (msg.includes("upload")) {
// //     return "Image upload failed. Please try again.";
// //   }

// //   return raw || fallback;
// // };

// // export const uploadProfilePictureFile = async ({ userId, file }) => {
// //   const token = getAuthToken();
// //   const resolvedUserId = resolveUserId(userId);

// //   if (!token) {
// //     throw new Error("Missing auth token. Please login again.");
// //   }

// //   if (!resolvedUserId) {
// //     throw new Error("Missing user id. Cannot upload image.");
// //   }

// //   const validation = validateProfileImageFile(file);
// //   if (!validation.valid) {
// //     throw new Error(validation.message);
// //   }

// //   const processedFile = await compressProfileImage(file);

// //   const postValidation = validateProfileImageFile(processedFile);
// //   if (!postValidation.valid) {
// //     throw new Error(postValidation.message);
// //   }

// //   const formData = new FormData();
// //   formData.append("profilePicture", processedFile);

// //   const res = await fetch(
// //     `${PROFILE_UPLOAD_API_BASE}/${resolvedUserId}/profile-picture`,
// //     {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: formData,
// //     }
// //   );

// //   let data = null;
// //   let rawText = "";

// //   try {
// //     data = await res.json();
// //   } catch {
// //     try {
// //       rawText = await res.text();
// //     } catch {
// //       rawText = "";
// //     }
// //   }

// //   if (!res.ok) {
// //     const apiError =
// //       data?.message ||
// //       data?.error ||
// //       data?.detail ||
// //       (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
// //       rawText ||
// //       `Upload failed (HTTP ${res.status})`;

// //     throw new Error(getProfileUploadFriendlyError({ message: apiError }));
// //   }

// //   return data;
// // };


// export const uploadProfilePictureFile = async ({ userId, file }) => {
//   const token = getAuthToken();

//   const formData = new FormData();

//   // ✅ THIS MUST MATCH BACKEND FIELD NAME
//   formData.append("profilePicture", file);

//   const res = await fetch(
//     `https://dev-user-api.fixserv.co/api/upload/${userId}/profile-picture`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // ❌ DO NOT set Content-Type manually
//       },
//       body: formData,
//     }
//   );

//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw {
//       status: res.status,
//       data,
//       message: data?.message || data?.error || "Upload failed",
//     };
//   }

//   return data;
// };

// export { getProfileUploadFriendlyError };


import { getAuthToken, getAuthUser } from "../utils/auth";

const PROFILE_UPLOAD_API_BASE = import.meta.env.DEV
  ? "/api/upload"
  : `${import.meta.env.VITE_USER_API_BASE_URL.replace(/\/$/, "")}/upload`;

const ACCEPTED_PROFILE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ACCEPTED_PROFILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_PROFILE_MB = 5;

const getExtension = (filename = "") => {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
};

const resolveUserId = (fallbackUserId = "") => {
  if (fallbackUserId) return fallbackUserId;

  const user = getAuthUser();
  return user?.id || user?._id || user?.artisanId || "";
};

export const validateProfileImageFile = (file) => {
  if (!file) {
    return { valid: false, message: "Please select an image first." };
  }

  const mime = String(file.type || "").toLowerCase();
  const ext = getExtension(file.name || "");

  const isAccepted =
    ACCEPTED_PROFILE_MIME_TYPES.includes(mime) ||
    ACCEPTED_PROFILE_EXTENSIONS.includes(ext);

  if (!isAccepted) {
    return {
      valid: false,
      message: "Only JPG, JPEG, PNG, and WEBP images are allowed.",
    };
  }

  if (file.size > MAX_PROFILE_MB * 1024 * 1024) {
    return {
      valid: false,
      message: `Image must be less than ${MAX_PROFILE_MB}MB.`,
    };
  }

  return { valid: true, message: "" };
};

export const compressProfileImage = async (file) => {
  if (!file?.type?.startsWith("image/")) return file;

  const targetMaxBytes = 2 * 1024 * 1024;

  if (file.size <= targetMaxBytes) return file;

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let width = image.width;
  let height = image.height;

  const max = 1400;
  if (width > max || height > max) {
    const ratio = Math.min(max / width, max / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.85;
  let blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );

  while (blob && blob.size > targetMaxBytes && quality > 0.5) {
    quality -= 0.1;
    blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
  }

  return new File([blob], "compressed.jpg", {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

export const getProfileUploadFriendlyError = (
  err,
  fallback = "Image upload failed. Please try again."
) => {
  if (!err) return fallback;

  if (err?.status >= 500) {
    return "Server error. Please try again later.";
  }

  if (err?.status === 401) {
    return "Session expired. Please login again.";
  }

  if (err?.status === 403) {
    return "You don’t have permission to perform this action.";
  }

  if (err?.status === 413) {
    return "Image too large.";
  }

  const raw =
    err?.data?.message ||
    err?.data?.error ||
    err?.message ||
    "";

  if (
    raw.toLowerCase().includes("network") ||
    raw.toLowerCase().includes("failed")
  ) {
    return "Network error. Please check your internet.";
  }

  return raw || fallback;
};

export const uploadProfilePictureFile = async ({ userId, file }) => {
  const token = getAuthToken();
  const resolvedUserId = resolveUserId(userId);

  if (!token) throw new Error("No auth token");
  if (!resolvedUserId) throw new Error("User not found");

  // ✅ validate
  const validation = validateProfileImageFile(file);
  if (!validation.valid) throw new Error(validation.message);

  // ✅ compress
  const processedFile = await compressProfileImage(file);

  const formData = new FormData();

  // ⚠️ MUST MATCH BACKEND
  formData.append("profilePicture", processedFile);

  const res = await fetch(
    `${PROFILE_UPLOAD_API_BASE}/${resolvedUserId}/profile-picture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.log("UPLOAD ERROR RESPONSE =>", data);
    throw {
      status: res.status,
      data,
      message: data?.message || data?.error || "Upload failed",
    };
  }

  return data;
};