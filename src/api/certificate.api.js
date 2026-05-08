import { getAuthToken, getAuthUser } from "../utils/auth";

const CERTIFICATE_API_BASE =
  `${import.meta.env.VITE_USER_API_BASE_URL.replace(/\/$/, "")}/certificate`;

const MAX_CERT_MB = 5;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const ACCEPTED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".pdf"];

const getUserId = () => {
  const user = getAuthUser();
  return user?.id || user?._id || user?.artisanId || "";
};

const getExtension = (name = "") => {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot).toLowerCase() : "";
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)}MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)}KB`;
};

export const validateCertificateFile = (file) => {
  if (!file) {
    return { valid: false, message: "Please choose a certificate file." };
  }

  const mime = (file.type || "").toLowerCase();
  const ext = getExtension(file.name);

  // ✅ FIX: OR instead of AND
  if (!ACCEPTED_TYPES.includes(mime) && !ACCEPTED_EXT.includes(ext)) {
    return {
      valid: false,
      message: "Only JPG, PNG, WEBP, or PDF files are allowed.",
    };
  }

  if (file.size > MAX_CERT_MB * 1024 * 1024) {
    return {
      valid: false,
      message: `File must be less than ${MAX_CERT_MB}MB.`,
    };
  }

  return { valid: true, message: "" };
};

const readFile = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const loadImg = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const toBlob = (canvas, q) =>
  new Promise((res) => canvas.toBlob(res, "image/jpeg", q));

export const compressCertificateImage = async (file) => {
  if (!file?.type?.startsWith("image/")) return file;

  if (file.size <= 2.5 * 1024 * 1024) return file;

  const dataUrl = await readFile(file);
  const img = await loadImg(dataUrl);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let w = img.width;
  let h = img.height;

  const max = 1800;

  if (w > max || h > max) {
    const ratio = Math.min(max / w, max / h);
    w *= ratio;
    h *= ratio;
  }

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(img, 0, 0, w, h);

  let q = 0.85;
  let blob = await toBlob(canvas, q);

  while (blob && blob.size > 2.5 * 1024 * 1024 && q > 0.45) {
    q -= 0.08;
    blob = await toBlob(canvas, q);
  }

  return new File([blob], file.name.replace(/\..+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

export const getCertificateFriendlyError = (err) => {
  if (!err) return "Upload failed.";

  if (err.status === 400) return "Invalid file type.";
  if (err.status === 401) return "Session expired. Please login again.";
  if (err.status === 403) return "Permission denied.";
  if (err.status === 404) return "Endpoint not found.";
  if (err.status === 413) return "File too large.";
  if (err.status >= 500) return "Server error. Please try again later.";

  const msg =
    err?.data?.message ||
    err?.data?.error ||
    err?.message ||
    "";

  if (msg.toLowerCase().includes("network")) {
    return "Network error. Check your internet connection.";
  }

  return msg || "Upload failed.";
};

export const uploadCertificates = async ({
  userId,
  files,
  certificateNames,
  onProgress,
}) => {
  const token = getAuthToken();
  const resolvedUserId = userId || getUserId();

  if (!token) throw new Error("Login required.");
  if (!resolvedUserId) throw new Error("User not found.");

  if (!files?.length) {
    throw new Error("Please add at least one certificate.");
  }

  if (!certificateNames || certificateNames.length !== files.length) {
    throw new Error("Each certificate must have a name.");
  }

  const processedFiles = [];

  for (const file of files) {
    const validation = validateCertificateFile(file);
    if (!validation.valid) throw new Error(validation.message);

    const compressed = await compressCertificateImage(file);
    processedFiles.push(compressed);
  }

  const formData = new FormData();

  // ✅ MUST MATCH BACKEND
  processedFiles.forEach((f) => formData.append("certificates", f));
  formData.append("certificateNames", JSON.stringify(certificateNames));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${CERTIFICATE_API_BASE}/${resolvedUserId}/upload-certificates`
    );

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.timeout = 120000;

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch {}

      console.log("CERT UPLOAD =>", xhr.status, data);

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject({
          status: xhr.status,
          data,
          message:
            data?.message ||
            data?.error ||
            `Upload failed (${xhr.status})`,
        });
      }
    };

    xhr.onerror = () =>
      reject({
        status: 0,
        message: "Network error. Please check your connection.",
      });

    xhr.ontimeout = () =>
      reject({
        status: 408,
        message: "Request timed out. Please try again.",
      });

    xhr.send(formData);
  });
};

export const fetchCertificates = async (userId, signal) => {
  const token = getAuthToken();
  const resolvedUserId = userId || getUserId();

  if (!resolvedUserId) {
    throw new Error("User not found.");
  }

  const res = await fetch(
    `${CERTIFICATE_API_BASE}/${resolvedUserId}/certificates`,
    {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal,
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Failed to fetch certificates (${res.status})`
    );
  }

  return data;
};

export const deleteCertificate = async (userId, certificateId) => {
  const token = getAuthToken();
  const resolvedUserId = userId || getUserId();

  if (!resolvedUserId) {
    throw new Error("User not found.");
  }

  const res = await fetch(
    `${CERTIFICATE_API_BASE}/${resolvedUserId}/certificates/${certificateId}`,
    {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Delete failed (${res.status})`
    );
  }

  return data;
};