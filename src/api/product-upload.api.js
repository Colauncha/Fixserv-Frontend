import { getAuthToken, getAuthUser } from "../utils/auth";

const PRODUCT_UPLOAD_API_BASE = import.meta.env.DEV
  ? "/api/upload"
  : `${import.meta.env.VITE_USER_API_BASE_URL.replace(/\/$/, "")}/upload`;

const ACCEPTED_PRODUCT_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ACCEPTED_PRODUCT_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_PRODUCT_MB = 5;

const getExtension = (filename = "") => {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
};

const resolveUserId = (fallbackUserId = "") => {
  if (fallbackUserId) return fallbackUserId;

  const user = getAuthUser();
  return user?.id || user?._id || user?.userId || user?.wallet?.userId || "";
};

export const validateProductImageFile = (file) => {
  if (!file) {
    return {
      valid: false,
      message: "Please upload an image of the damaged device.",
    };
  }

  const mime = String(file.type || "").toLowerCase();
  const ext = getExtension(file.name || "");

  const isAccepted =
    ACCEPTED_PRODUCT_MIME_TYPES.includes(mime) ||
    ACCEPTED_PRODUCT_EXTENSIONS.includes(ext);

  if (!isAccepted) {
    return {
      valid: false,
      message: "Only JPG, JPEG, PNG, and WEBP images are allowed.",
    };
  }

  if (file.size > MAX_PRODUCT_MB * 1024 * 1024) {
    return {
      valid: false,
      message: `Image must be less than ${MAX_PRODUCT_MB}MB.`,
    };
  }

  return { valid: true, message: "" };
};

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

export const compressProductImage = async (file) => {
  if (!file?.type?.startsWith("image/")) return file;

  const targetMaxBytes = 2.5 * 1024 * 1024;

  if (file.size <= targetMaxBytes) {
    return file;
  }

  const dataUrl = await readFileAsDataURL(file);
  const image = await loadImage(dataUrl);

  let width = image.width;
  let height = image.height;

  const maxWidth = 1800;
  const maxHeight = 1800;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.85;
  let blob = await canvasToBlob(canvas, "image/jpeg", quality);

  while (blob && blob.size > targetMaxBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }

  if (!blob) return file;

  const compressedName =
    file.name.replace(/\.[^.]+$/, "") + ".jpg";

  return new File([blob], compressedName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

const safeParse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  let json = null;
  if (contentType.includes("application/json") && raw) {
    try {
      json = JSON.parse(raw);
    } catch {
      json = null;
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    contentType,
    raw,
    json,
  };
};

export const getProductUploadFriendlyError = (
  err,
  fallback = "Unable to upload device image. Please try again."
) => {
  const raw =
    err?.message ||
    err?.json?.message ||
    err?.json?.error ||
    "";
  const msg = String(raw).toLowerCase();

  if (msg.includes("timed out") || msg.includes("timeout")) {
    return "We could not complete this upload right now. Please try again.";
  }

  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "Network error. Please check your internet connection and try again.";
  }

  if (msg.includes("401") || msg.includes("unauthorized")) {
    return "Session expired. Please login again.";
  }

  if (msg.includes("400")) {
    return "We could not process the image upload. Please check the file and try again.";
  }

  if (msg.includes("404")) {
    return "Upload endpoint not found.";
  }

  if (msg.includes("413") || msg.includes("too large")) {
    return "This image is too large. Please choose a smaller image.";
  }

  if (msg.includes("500") || msg.includes("server")) {
    return "Server error. Please try again later.";
  }

  return raw || fallback;
};

export const uploadProductImageFile = async ({
  userId,
  file,
  objectName,
  description,
}) => {
  const token = getAuthToken();
  const resolvedUserId = resolveUserId(userId);

  if (!token) {
    throw new Error("Unauthorized: Please login again.");
  }

  if (!resolvedUserId) {
    throw new Error("User not found. Please login again.");
  }

  const validation = validateProductImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  const processedFile = await compressProductImage(file);

  const postValidation = validateProductImageFile(processedFile);
  if (!postValidation.valid) {
    throw new Error(postValidation.message);
  }

  const cleanObjectName = String(objectName || "").trim() || "Device";
  const cleanDescription =
    String(description || "").trim() || "Device repair request";

  const formData = new FormData();
  formData.append("productImage", processedFile);
  formData.append("objectName", cleanObjectName);
  formData.append("description", cleanDescription);

  const res = await fetch(
    `${PRODUCT_UPLOAD_API_BASE}/${resolvedUserId}/upload-products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const parsed = await safeParse(res);

  if (!parsed.ok) {
    const msg =
      parsed?.json?.message ||
      parsed?.json?.error ||
      parsed?.raw ||
      `Upload failed (${parsed.status})`;

    throw new Error(getProductUploadFriendlyError({ message: msg }));
  }

  const data = parsed.json || {};
  const uploadedProductId =
    data?.product?._id ||
    data?.product?.id ||
    data?.data?.product?._id ||
    data?.data?.product?.id;

  if (!uploadedProductId) {
    throw new Error("Upload succeeded but uploadedProductId was not returned.");
  }

  return {
    rawResponse: data,
    uploadedProductId,
  };
};