const USER_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_USER_API_BASE_URL ||
      import.meta.env.VITE_GENERAL_API_BASE_URL ||
      "https://dev-user-api.fixserv.co/api");

const SERVICE_BASE_URL = import.meta.env.DEV
  ? "/api/service"
  : (import.meta.env.VITE_SERVICE_API_BASE_URL ||
      "https://dev-service-api.fixserv.co/api/service");

const getAuthHeaders = () => {
  const token = localStorage.getItem("fixserv_token");

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const safeJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

const getResolvedArtisanId = (record) =>
  record?.id || record?._id || record?.artisanId || null;

const getSavedBio = (artisanId) => {
  if (!artisanId) return "";
  return localStorage.getItem(`fixserv_artisan_bio_${artisanId}`) || "";
};

const setSavedBio = (artisanId, bio) => {
  if (!artisanId) return;
  localStorage.setItem(
    `fixserv_artisan_bio_${artisanId}`,
    typeof bio === "string" ? bio : ""
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

const hydrateArtisanBio = (record) => {
  if (!record || typeof record !== "object") return record;

  const artisanId = getResolvedArtisanId(record);

  const resolvedBio = firstNonEmptyText(
    record?.bio,
    record?.user?.bio,
    record?.artisan?.bio,
    record?.data?.bio,
    getSavedBio(artisanId)
  );

  return {
    ...record,
    bio: resolvedBio,
  };
};

export const getArtisanById = async (artisanId) => {
  const res = await fetch(`${USER_BASE_URL}/admin/user/${artisanId}`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    const message = json?.message || "Failed to fetch artisan";

    if (
      res.status === 400 ||
      res.status === 404 ||
      /user not found/i.test(message)
    ) {
      return null;
    }

    throw new Error(message);
  }

  return hydrateArtisanBio(json?.data || json?.user || json);
};

export const getAllArtisans = async () => {
  const res = await fetch(`${USER_BASE_URL}/admin/getAll?role=ARTISAN`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(json?.message || "Failed to fetch artisans");
  }

  const rawList = json?.users || json?.data || [];
  return Array.isArray(rawList)
    ? rawList.map((item) => hydrateArtisanBio(item))
    : [];
};

export const updateArtisanData = async (artisanId, payload) => {
  const safeHours =
    payload?.businessHours && typeof payload.businessHours === "object"
      ? payload.businessHours
      : {};

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const openOnlyHours = {};

  for (const day of days) {
    const open = String(safeHours?.[day]?.open || "").trim();
    const close = String(safeHours?.[day]?.close || "").trim();

    if (open && close) {
      openOnlyHours[day] = { open, close };
    }
  }

  const finalPayload = {
    ...payload,
    businessHours: openOnlyHours,
  };

  const res = await fetch(`${USER_BASE_URL}/admin/${artisanId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(finalPayload),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      json?.message ||
        json?.error ||
        json?.errors?.[0]?.message ||
        `Failed to update artisan data (${res.status})`
    );
  }

  const updated = hydrateArtisanBio(json?.data || json?.user || json);

  if (typeof finalPayload?.bio === "string") {
    setSavedBio(artisanId, finalPayload.bio);
  } else if (typeof updated?.bio === "string") {
    setSavedBio(artisanId, updated.bio);
  }

  return updated;
};

export const getArtisanServices = async (artisanId) => {
  const res = await fetch(`${SERVICE_BASE_URL}/artisan/${artisanId}`, {
    headers: getAuthHeaders(),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      json?.message || `Failed to fetch artisan services (${res.status})`
    );
  }

  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.services)) return json.services;
  if (Array.isArray(json?.data?.services)) return json.data.services;

  return [];
};

export const createArtisanService = async (payload) => {
  const res = await fetch(`${SERVICE_BASE_URL}/createService`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      json?.message || `Failed to create service (${res.status})`
    );
  }

  return json?.data || json?.service || json;
};

export const updateArtisanService = async (serviceId, payload) => {
  const res = await fetch(`${SERVICE_BASE_URL}/${serviceId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await safeJson(res);

  if (!res.ok) {
    throw new Error(
      json?.message || `Failed to update service (${res.status})`
    );
  }

  return json?.data || json?.service || json;
};