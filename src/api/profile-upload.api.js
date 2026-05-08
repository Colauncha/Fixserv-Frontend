import { getAuthToken, getAuthUser } from "../utils/auth";

const PROFILE_UPLOAD_API_BASE = `${(
  import.meta.env.VITE_USER_API_BASE_URL ?? ""
).replace(/\/$/, "")}/upload`;

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